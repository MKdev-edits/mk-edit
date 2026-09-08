// src/components/common/VideoPlayer.jsx
import { useEffect, useState } from 'react';
import { canPlayOnSite, getPlatformDisplayName, detectPlatform } from '../../utils/oembed';
import ExternalVideoPopup from './ExternalVideoPopup';

/**
 * VideoPlayer - Main video player component
 * 
 * Why this is crucial:
 * - It's the primary way users watch videos
 * - It handles both playable (YouTube/Vimeo) and non-playable videos
 * - Detects errors and shows appropriate popups
 * 
 * Flow:
 * 1. Check if video can play on site
 * 2. If yes → Show iframe player
 * 3. If no → Show popup to go to platform
 * 4. If iframe errors → Show popup
 */

export default function VideoPlayer({ video, onClose }) {
    const [showPopup, setShowPopup] = useState(false);
    const [iframeError, setIframeError] = useState(false);

    const platform = detectPlatform(video?.video_url);
    const canPlay = canPlayOnSite(platform);
    const platformDisplayName = getPlatformDisplayName(platform);

    // ✅ If video can't play on site, show popup
    useEffect(() => {
        if (video && !canPlay) {
            setShowPopup(true);
        }
    }, [video, canPlay]);

    // ✅ Handle iframe errors
    const handleIframeError = () => {
        setIframeError(true);
        setShowPopup(true);
    };

    const handlePopupContinue = () => {
        setShowPopup(false);
        onClose();
    };

    const handlePopupCancel = () => {
        setShowPopup(false);
        onClose();
    };

    // ✅ Get embed URL (for playable videos)
    const getEmbedUrl = () => {
        if (!video?.video_url) return '';
        if (video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be')) {
            const id = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
            return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
        }
        if (video.video_url.includes('vimeo.com')) {
            const id = video.video_url.match(/vimeo\.com\/(\d+)/)?.[1];
            return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : '';
        }
        return '';
    };

    // ✅ Body scroll lock
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // ✅ If not playable, show just the popup (no modal)
    if (!canPlay) {
        return (
            <ExternalVideoPopup
                platform={platform}
                platformDisplayName={platformDisplayName}
                videoUrl={video?.video_url}
                onContinue={handlePopupContinue}
                onCancel={handlePopupCancel}
            />
        );
    }

    // ✅ If iframe error, show popup
    if (iframeError) {
        return (
            <ExternalVideoPopup
                platform={platform}
                platformDisplayName={platformDisplayName}
                videoUrl={video?.video_url}
                onContinue={handlePopupContinue}
                onCancel={handlePopupCancel}
            />
        );
    }

    // ✅ Playable video - show modal with iframe
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/80 transition-all text-white border border-white/20 cursor-pointer"
                >
                    <i className="fas fa-times text-lg"></i>
                </button>

                {/* Video Player */}
                <div className="aspect-video w-full bg-black">
                    <iframe
                        src={getEmbedUrl()}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                        onError={handleIframeError}
                    />
                </div>

                {/* Video Info */}
                <div className="p-4 bg-black/80">
                    <h3 className="text-white font-medium line-clamp-1">{video.title}</h3>
                </div>
            </div>
        </div>
    );
}