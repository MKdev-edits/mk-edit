// src/components/common/VideoCard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import VideoCardMenu from './VideoCardMenu';
import VideoPlayer from './VideoPlayer';
import SharePopup from './SharePopup';
import LoginRequiredModal from './LoginRequiredModal';
import { fetchOEmbed } from '../../utils/oembed';
import { supabase } from '../../lib/supabase';

export default function VideoCard({ video, small = false }) {
    const { user, profile } = useAuth();
    const { viewer } = useViewerAuth();
    const isEditor = !!user && !!profile;
    const navigate = useNavigate();

    const [showPlayer, setShowPlayer] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(video.likes || 0);
    const [thumbnailError, setThumbnailError] = useState(false);

    // ✅ oEmbed thumbnail state
    const [oembedThumbnail, setOembedThumbnail] = useState(null);
    const [thumbnailLoading, setThumbnailLoading] = useState(true);

    const isInQueue = false;

    // ✅ Fetch oEmbed thumbnail when video loads
    useEffect(() => {
        const loadThumbnail = async () => {
            if (!video?.video_url) {
                setThumbnailLoading(false);
                return;
            }

            try {
                const result = await fetchOEmbed(video.video_url);
                if (result?.thumbnailUrl) {
                    setOembedThumbnail(result.thumbnailUrl);
                }
            } catch (err) {
                console.error('❌ oEmbed thumbnail error:', err);
            } finally {
                setThumbnailLoading(false);
            }
        };

        loadThumbnail();
    }, [video?.video_url]);

    useEffect(() => {
        if (viewer) checkIfLiked();
    }, [viewer, video.id]);

    const checkIfLiked = async () => {
        const { data } = await supabase
            .from('video_likes')
            .select('id')
            .eq('video_id', video.id)
            .eq('viewer_id', viewer.id)
            .maybeSingle();
        setIsLiked(!!data);
    };

    // ✅ Priority: oEmbed → Manual Upload → YouTube Fallback → Placeholder
    const getThumbnail = () => {
        // 1. oEmbed thumbnail (highest priority)
        if (oembedThumbnail && !thumbnailError) return oembedThumbnail;

        // 2. Manual upload (from dashboard)
        if (video.thumbnail_url && !thumbnailError) return video.thumbnail_url;

        // 3. YouTube fallback (extract from URL)
        if (video.video_url) {
            const youtubeMatch = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
            if (youtubeMatch) return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;

            // 4. TikTok fallback (show platform icon)
            if (video.video_url.includes('tiktok.com')) {
                return 'https://via.placeholder.com/400x400/1a1a2e/10B981?text=🎵';
            }
        }

        // 5. Placeholder
        return 'https://via.placeholder.com/400x400/1a1a2e/10B981?text=🎬';
    };

    const handleThumbnailError = (e) => {
        setThumbnailError(true);
        e.target.src = 'https://via.placeholder.com/400x400/1a1a2e/10B981?text=🎬';
    };

    // ✅ LIKE HANDLER
    const handleLike = async (e) => {
        e.stopPropagation();
        if (isEditor) return;
        if (!viewer) {
            setPendingAction('like');
            setShowLoginModal(true);
            return;
        }

        const newLikeState = !isLiked;
        const newLikeCount = newLikeState ? likeCount + 1 : likeCount - 1;
        setIsLiked(newLikeState);
        setLikeCount(newLikeCount);

        try {
            if (isLiked) {
                const { error } = await supabase
                    .from('video_likes')
                    .delete()
                    .eq('video_id', video.id)
                    .eq('viewer_id', viewer.id);
                if (error) {
                    setIsLiked(!newLikeState);
                    setLikeCount(likeCount);
                } else {
                    await supabase.from('videos').update({ likes: newLikeCount }).eq('id', video.id);
                }
            } else {
                const { error } = await supabase
                    .from('video_likes')
                    .insert([{ video_id: video.id, viewer_id: viewer.id }]);
                if (error) {
                    setIsLiked(!newLikeState);
                    setLikeCount(likeCount);
                } else {
                    await supabase.from('videos').update({ likes: newLikeCount }).eq('id', video.id);
                }
            }
        } catch (err) {
            console.error('Like error:', err);
            setIsLiked(!newLikeState);
            setLikeCount(likeCount);
        }
    };

    // ✅ SHARE HANDLER
    const handleShare = (e) => {
        e.stopPropagation();
        if (isEditor) {
            setShowShare(true);
            return;
        }
        if (!viewer) {
            setPendingAction('share');
            setShowLoginModal(true);
            return;
        }
        setShowShare(true);
    };

    // ✅ THUMBNAIL CLICK
    const handleImageClick = () => {
        if (isEditor) {
            navigate(`/video/${video.id}`);
            return;
        }
        if ((video.is_vip || video.is_top_rated) && !viewer) {
            setPendingAction('watch');
            setShowLoginModal(true);
            return;
        }
        navigate(`/video/${video.id}`);
    };

    return (
        <>
            <div className="group cursor-pointer w-full">
                {/* ✅ Thumbnail Container */}
                <div className="video-card-thumbnail relative" onClick={handleImageClick}>
                    <img
                        src={getThumbnail()}
                        alt={video.title}
                        className="video-card-img"
                        onError={handleThumbnailError}
                        loading="lazy"
                    />

                    {/* ✅ VIP / Top Rated Badges */}
                    {(video.is_vip || video.is_top_rated) && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-medium bg-yellow-500/20 text-yellow-400 backdrop-blur-sm flex items-center gap-0.5 z-10">
                            <i className={`fas ${video.is_vip ? 'fa-crown' : 'fa-star'} text-[8px]`}></i>
                            <span className="hidden md:inline">{video.is_vip ? 'VIP' : 'Top Rated'}</span>
                        </div>
                    )}
                </div>

                {/* ✅ Title Row - Video Title (left) + 3-Dot Menu (right) */}
                <div className="flex items-center justify-between mt-2 gap-2">
                    <h3
                        className="text-white font-medium text-xs md:text-sm line-clamp-1 hover:text-supabase-green transition-colors cursor-pointer flex-1"
                        onClick={handleImageClick}
                    >
                        {video.title}
                    </h3>

                    {/* ✅ 3-Dot Menu */}
                    <div className="flex-shrink-0">
                        <VideoCardMenu video={video} isInQueue={isInQueue} />
                    </div>
                </div>

                {/* ✅ Meta Row - Likes + Share (left) | Views (right) */}
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            disabled={isEditor}
                            className={`flex items-center gap-1 text-xs transition-colors ${isEditor ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <i className={`${isLiked ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400 hover:text-red-400'} text-[10px] md:text-xs`}></i>
                            <span className={`text-[10px] ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                                {likeCount}
                            </span>
                        </button>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-supabase-green transition-colors cursor-pointer"
                        >
                            <i className="fas fa-share-alt text-[10px]"></i>
                            <span className="text-[10px] hidden sm:inline">Share</span>
                        </button>
                    </div>

                    {/* ✅ Views - ALWAYS GREEN */}
                    <span className="text-[10px] text-supabase-green flex items-center gap-1">
                        <i className="far fa-eye"></i> {video.views || 0} views
                    </span>
                </div>
            </div>

            {showPlayer && <VideoPlayer video={video} onClose={() => setShowPlayer(false)} />}
            {showShare && <SharePopup video={video} onClose={() => setShowShare(false)} />}
            {showLoginModal && (
                <LoginRequiredModal
                    onClose={() => setShowLoginModal(false)}
                    action={pendingAction === 'like' ? 'like this video' : pendingAction === 'share' ? 'share this video' : 'watch this video'}
                />
            )}
        </>
    );
}