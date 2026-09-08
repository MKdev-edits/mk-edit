import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useViewerAuth } from '../contexts/ViewerAuthContext';
import { canPlayOnSite, detectPlatform, getPlatformDisplayName } from '../utils/oembed';
import ExternalVideoPopup from '../components/common/ExternalVideoPopup';
import VideoPlayer from '../components/common/VideoPlayer';
import Footer from '../components/common/Footer';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function VideoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const { viewer } = useViewerAuth();
    const isEditor = !!user && !!profile;

    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewRecorded, setViewRecorded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [platformInfo, setPlatformInfo] = useState(null);

    // ✅ DYNAMIC META TAGS FOR VIDEO SHARING
    const updateMetaTags = (videoData) => {
        // Update page title
        document.title = `${videoData.title} | Gojou's Hub`;

        // Update OG tags for social sharing
        const metaTags = {
            'og:title': videoData.title,
            'og:description': videoData.description || 'Watch this amazing video on Gojou\'s Hub',
            'og:image': videoData.thumbnail_url || 'https://yourdomain.com/og-image.jpg',
            'og:url': `${window.location.origin}/video/${videoData.id}`,
            'og:type': 'video.other',
        };

        // Update or create meta tags
        Object.entries(metaTags).forEach(([property, content]) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });
    };

    useEffect(() => {
        fetchVideoAndRelated();
    }, [id]);

    useEffect(() => {
        if (viewer && video) {
            checkIfLiked();
        }
    }, [viewer, video]);

    useEffect(() => {
        if (video) {
            const platform = detectPlatform(video.video_url);
            const canPlay = canPlayOnSite(platform);
            setPlatformInfo({
                platform,
                canPlay,
                displayName: getPlatformDisplayName(platform),
            });
        }
    }, [video]);

    const checkIfLiked = async () => {
        if (!viewer) return;
        const { data } = await supabase
            .from('video_likes')
            .select('id')
            .eq('video_id', id)
            .eq('viewer_id', viewer.id)
            .maybeSingle();
        setIsLiked(!!data);
    };

    const handlePlayClick = () => {
        if (platformInfo?.canPlay) {
            // ✅ Playable → Open Video Modal
            setShowPlayer(true);
        } else {
            // ✅ Non-playable → Show popup
            setShowPopup(true);
        }
    };

    const fetchVideoAndRelated = async () => {
        setLoading(true);
        try {
            const { data: videoData } = await supabase
                .from('videos')
                .select('*')
                .eq('id', id)
                .single();

            if (videoData) {
                setVideo(videoData);
                setLikeCount(videoData.likes || 0);

                // ✅ UPDATE META TAGS FOR THIS VIDEO
                updateMetaTags(videoData);

                await recordView(videoData);

                const { data: relatedData } = await supabase
                    .from('videos')
                    .select('*')
                    .eq('platform', videoData.platform)
                    .neq('id', id)
                    .limit(10);

                setRelatedVideos(relatedData || []);
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Error fetching video:', err);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const recordView = async (videoData) => {
        if (isEditor) return;
        if (viewRecorded) return;
        if (!viewer) return;

        try {
            const { data: existingView } = await supabase
                .from('video_views')
                .select('id')
                .eq('video_id', id)
                .eq('viewer_id', viewer.id)
                .maybeSingle();

            if (existingView) {
                setViewRecorded(true);
                return;
            }

            const { error: viewError } = await supabase
                .from('video_views')
                .insert([{ video_id: id, viewer_id: viewer.id }]);

            if (!viewError) {
                await supabase
                    .from('videos')
                    .update({ views: (videoData.views || 0) + 1 })
                    .eq('id', id);

                setViewRecorded(true);
                videoData.views = (videoData.views || 0) + 1;
            }
        } catch (err) {
            console.error('Error recording view:', err);
        }
    };

    // ✅ FIXED: Like toggle with proper state management
    const handleLike = async () => {
        if (isProcessing) return;
        if (isEditor) return;
        if (!viewer) {
            navigate('/viewer-login');
            return;
        }

        setIsProcessing(true);

        try {
            if (isLiked) {
                // ✅ UNLIKE
                const { error } = await supabase
                    .from('video_likes')
                    .delete()
                    .eq('video_id', id)
                    .eq('viewer_id', viewer.id);

                if (!error) {
                    setIsLiked(false);
                    // ✅ Fetch fresh count from database
                    const { data: updatedVideo } = await supabase
                        .from('videos')
                        .select('likes')
                        .eq('id', id)
                        .single();

                    if (updatedVideo) {
                        setLikeCount(updatedVideo.likes);
                    }
                }
            } else {
                // ✅ LIKE
                const { error } = await supabase
                    .from('video_likes')
                    .insert([{ video_id: id, viewer_id: viewer.id }]);

                if (!error) {
                    setIsLiked(true);
                    // ✅ Fetch fresh count from database
                    const { data: updatedVideo } = await supabase
                        .from('videos')
                        .select('likes')
                        .eq('id', id)
                        .single();

                    if (updatedVideo) {
                        setLikeCount(updatedVideo.likes);
                    }
                }
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const getThumbnail = () => {
        if (video?.thumbnail_url) return video.thumbnail_url;
        if (video?.video_url?.includes('youtube.com') || video?.video_url?.includes('youtu.be')) {
            const videoId = extractYouTubeId(video.video_url);
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return 'https://via.placeholder.com/800x450?text=Video';
    };

    const getPlatformColor = () => {
        const platform = video?.platform?.toLowerCase();
        if (platform === 'youtube') return 'text-red-500';
        if (platform === 'tiktok') return 'text-pink-400';
        return 'text-supabase-green';
    };

    if (loading) return <LoadingSkeleton />;
    if (!video) return null;

    return (
        <div className="min-h-screen bg-black pt-20">
            {showPlayer && (
                <VideoPlayer
                    video={video}
                    onClose={() => setShowPlayer(false)}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 py-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-900 group cursor-pointer">
                            <img
                                src={getThumbnail()}
                                alt={video.title}
                                className="w-full aspect-video object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/50 transition-all"
                                onClick={() => setShowPlayer(true)}
                            >
                                <div
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/50 transition-all"
                                    onClick={handlePlayClick}  // ← This checks platform first
                                ></div>
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-supabase-green rounded-full flex items-center justify-center shadow-lg shadow-supabase-green/50 animate-pulse-glow transform group-hover:scale-110 transition-transform">
                                    <i className="fas fa-play text-white text-xl md:text-2xl ml-1"></i>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-white flex-1">
                                    {video.title}
                                </h1>

                                <button
                                    onClick={handleLike}
                                    disabled={isEditor}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isEditor
                                        ? 'opacity-50 cursor-not-allowed bg-white/5'
                                        : isLiked
                                            ? 'bg-red-500/20 hover:bg-red-500/30'
                                            : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                >
                                    <i className={`${isLiked ? 'fas' : 'far'} fa-heart ${isLiked ? 'text-red-500' : 'text-gray-400'}`}></i>
                                    <span className={isLiked ? 'text-red-500' : 'text-white'}>
                                        {likeCount}
                                    </span>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className={`flex items-center gap-1 text-sm ${getPlatformColor()}`}>
                                    <i className={`fab fa-${video.platform === 'youtube' ? 'youtube' : video.platform === 'tiktok' ? 'tiktok' : 'video'}`}></i>
                                    {video.platform?.charAt(0).toUpperCase() + video.platform?.slice(1)}
                                </span>
                                {video.is_vip && (
                                    <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                                        <i className="fas fa-crown text-xs"></i> VIP
                                    </span>
                                )}
                                {video.is_top_rated && (
                                    <span className="flex items-center gap-1 text-xs bg-supabase-green/20 text-supabase-green px-2 py-1 rounded-full">
                                        <i className="fas fa-star text-xs"></i> Top Rated
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <i className="far fa-eye"></i> {video.views?.toLocaleString()} views
                                </span>
                            </div>

                            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {video.description || 'No description provided.'}
                                </p>
                            </div>

                            <a
                                href={video.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 text-gray-400 hover:text-supabase-green transition-colors text-sm"
                            >
                                <i className="fas fa-external-link-alt"></i>
                                Watch original on {video.platform === 'youtube' ? 'YouTube' : video.platform === 'tiktok' ? 'TikTok' : 'browser'}
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-thumbs-up text-supabase-green"></i>
                            You May Also Like
                        </h3>

                        {relatedVideos.length === 0 ? (
                            <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-gray-400 text-sm">No related videos found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {relatedVideos.map(relVideo => (
                                    <Link
                                        key={relVideo.id}
                                        to={`/video/${relVideo.id}`}
                                        className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group"
                                    >
                                        <img
                                            src={relVideo.thumbnail_url || `https://img.youtube.com/vi/${extractYouTubeId(relVideo.video_url)}/mqdefault.jpg`}
                                            alt={relVideo.title}
                                            className="w-24 h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-supabase-green transition-colors">
                                                {relVideo.title}
                                            </h4>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {relVideo.views?.toLocaleString()} views
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            {showPopup && platformInfo && (
                <ExternalVideoPopup
                    platform={platformInfo.platform}
                    platformDisplayName={platformInfo.displayName}
                    videoUrl={video?.video_url}
                    onContinue={() => {
                        setShowPopup(false);
                        window.open(video?.video_url, '_blank', 'noopener,noreferrer');
                    }}
                    onCancel={() => setShowPopup(false)}
                />
            )}
        </div>
    );
}

function extractYouTubeId(url) {
    if (!url) return '';
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return '';
}