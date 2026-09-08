// src/components/common/VideoCard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import VideoPlayer from './VideoPlayer';
import SharePopup from './SharePopup';
import LoginRequiredModal from './LoginRequiredModal';
import { fetchOEmbed } from '../../utils/oembed';
import { getThumbnail } from '../../utils/thumbnail';

export default function VideoCard({ video, small = false }) {
    const { user, profile } = useAuth();
    const { viewer } = useViewerAuth();
    const isEditor = !!user && !!profile;
    const navigate = useNavigate();

    const [showPlayer, setShowPlayer] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
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

    const handleThumbnailError = (e) => {
        setThumbnailError(true);
        e.target.src = 'https://via.placeholder.com/400x400/1a1a2e/10B981?text=🎬';
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
                <div className="video-card-thumbnail relative group cursor-pointer" onClick={handleImageClick}>
                    <img
                        src={getThumbnail(video)}
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

                    {/* ✅ HOVER OVERLAY - Like YouTube/Spotify */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-lg shadow-2xl shadow-black/50">
                        <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                            <i className="fas fa-play-circle text-white text-4xl md:text-5xl mb-2 drop-shadow-lg"></i>
                            <p className="text-white text-xs md:text-sm font-medium drop-shadow-lg">Click to watch</p>
                        </div>
                    </div>

                    {/* ✅ Drop shadow on hover - Full card effect */}
                    <div className="absolute inset-0 rounded-lg shadow-2xl shadow-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* ✅ Title + Description */}
                <div className="mt-2 space-y-0.5">
                    <h3
                        className="text-white font-medium text-[15px] md:text-md line-clamp-1 hover:text-supabase-green transition-colors cursor-pointer"
                        onClick={handleImageClick}
                    >
                        {video.title}
                    </h3>
                    <p className="text-gray-400 text-[13px] md:text-md line-clamp-1">
                        {video.description || 'No description'}
                    </p>
                </div>

                {/* ✅ Meta Row - Share Only */}
                <div className="flex items-center justify-between mt-1">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-supabase-green transition-colors cursor-pointer"
                    >
                        <i className="fas fa-share-alt text-[10px]"></i>
                        <span className="text-[10px] hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>

            {showPlayer && <VideoPlayer video={video} onClose={() => setShowPlayer(false)} />}
            {showShare && <SharePopup video={video} onClose={() => setShowShare(false)} />}
            {showLoginModal && (
                <LoginRequiredModal
                    onClose={() => setShowLoginModal(false)}
                    action={pendingAction === 'share' ? 'share this video' : 'watch this video'}
                />
            )}
        </>
    );
}