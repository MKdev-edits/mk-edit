import { useState } from 'react';

export default function SharePopup({ video, onClose, onShare }) {
    const [copied, setCopied] = useState(false);

    // ✅ Generate a proper share URL with full domain
    const getShareUrl = () => {
        // Use window.location.origin for the full URL
        const baseUrl = window.location.origin;
        return `${baseUrl}/video/${video.id}`;
    };

    const shareUrl = getShareUrl();
    const shareTitle = encodeURIComponent(video.title);
    const shareText = encodeURIComponent(`Check out this video: ${video.title}`);

    // ✅ Get thumbnail for sharing
    const getShareThumbnail = () => {
        if (video.thumbnail_url) return video.thumbnail_url;
        if (video.video_url?.includes('youtube.com') || video.video_url?.includes('youtu.be')) {
            const videoId = extractYouTubeId(video.video_url);
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return 'https://via.placeholder.com/400x400/1a1a2e/10B981?text=🎬';
    };

    const sharePlatforms = [
        {
            name: 'WhatsApp',
            icon: 'fab fa-whatsapp',
            color: 'bg-green-500 hover:bg-green-600',
            // ✅ Fixed: Better WhatsApp sharing with proper formatting
            getUrl: () => {
                const message = `${video.title}\n\n${shareUrl}`;
                return `https://wa.me/?text=${encodeURIComponent(message)}`;
            }
        },
        {
            name: 'Telegram',
            icon: 'fab fa-telegram',
            color: 'bg-blue-500 hover:bg-blue-600',
            getUrl: () => {
                const message = `${video.title}\n\n${shareUrl}`;
                return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`;
            }
        },
        {
            name: 'Facebook',
            icon: 'fab fa-facebook',
            color: 'bg-blue-600 hover:bg-blue-700',
            getUrl: () => {
                return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(video.title)}`;
            }
        },
        {
            name: 'Twitter',
            icon: 'fab fa-twitter',
            color: 'bg-black hover:bg-gray-800',
            getUrl: () => {
                const text = `${video.title} ${shareUrl}`;
                return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            }
        },
        {
            name: 'Copy Link',
            icon: 'fas fa-link',
            color: 'bg-gray-600 hover:bg-gray-700',
            action: 'copy'
        }
    ];

    const handleShare = async (platform) => {
        if (platform.action === 'copy') {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                if (onShare) onShare();
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                if (onShare) onShare();
            }
            return;
        }

        // Open share window with proper URL
        const url = platform.getUrl();
        window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
        if (onShare) onShare();

        // Close popup after short delay
        setTimeout(onClose, 500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg" onClick={onClose}>
            <div className="relative w-full max-w-md bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <i className="fas fa-times text-xl"></i>
                </button>

                <h3 className="text-xl font-bold text-white mb-2">Share this video</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-1">{video.title}</p>

                {/* ✅ Thumbnail preview in share popup */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
                    <img
                        src={getShareThumbnail()}
                        alt={video.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/64x64/1a1a2e/10B981?text=🎬'}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{video.title}</p>
                        <p className="text-gray-400 text-xs truncate">{shareUrl}</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {sharePlatforms.map(platform => (
                        <button
                            key={platform.name}
                            onClick={() => handleShare(platform)}
                            className={`${platform.color} flex flex-col items-center gap-1 p-3 rounded-xl transition-all transform hover:scale-105`}
                        >
                            <i className={`${platform.icon} text-xl text-white`}></i>
                            <span className="text-white text-[10px]">{platform.name}</span>
                        </button>
                    ))}
                </div>

                {/* Direct URL with copy button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl p-2">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 bg-transparent text-white text-sm px-2 outline-none"
                        />
                        <button
                            onClick={() => handleShare({ action: 'copy' })}
                            className="px-3 py-1.5 bg-supabase-green rounded-lg text-white text-sm hover:bg-supabase-green/80 transition-colors whitespace-nowrap"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
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