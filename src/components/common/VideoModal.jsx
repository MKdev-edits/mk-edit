import { useEffect } from 'react';

export default function VideoModal({ isOpen, onClose, video }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // If TikTok, open in new tab instead of modal
            if (video?.platform === 'tiktok') {
                window.open(video.video_url, '_blank');
                onClose();
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, video, onClose]);

    if (!isOpen) return null;

    // Don't render modal for TikTok
    if (video?.platform === 'tiktok') return null;

    const getEmbedUrl = () => {
        const url = video.video_url;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return url;
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-liquid-glass"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" />

            <div
                className="relative w-full max-w-5xl bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-all text-white border border-white/20 cursor-pointer"
                >
                    <i className="fas fa-times text-lg"></i>
                </button>

                <div className="aspect-video w-full bg-black">
                    <iframe
                        src={getEmbedUrl()}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                    />
                </div>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
                    <p className="text-gray-300 text-base leading-relaxed">{video.description}</p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                        <span className="capitalize"><i className="fas fa-play-circle mr-1"></i> {video.platform || 'Video'}</span>
                        {video.views > 0 && <span><i className="far fa-eye mr-1"></i> {video.views?.toLocaleString()} views</span>}
                        {video.likes > 0 && <span><i className="far fa-heart mr-1"></i> {video.likes?.toLocaleString()} likes</span>}
                    </div>

                    <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-all cursor-pointer"
                    >
                        Open in {video.platform === 'youtube' ? 'YouTube' : 'Browser'}
                        <i className="fas fa-external-link-alt text-xs"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}