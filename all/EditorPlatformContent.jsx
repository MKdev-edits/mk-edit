// src/components/editor/EditorPlatformContent.jsx
import EditorVideoGrid from './EditorVideoGrid';

export default function EditorPlatformContent({
    videos,
    platform,
    onPlayVideo,
    onAddVideo
}) {
    // ✅ Make sure videos is an array
    const videoList = videos || [];

    // If 'all', show ALL videos, otherwise filter by platform
    const filteredVideos = platform === 'all'
        ? videoList
        : videoList.filter(v => v.platform?.toLowerCase() === platform.toLowerCase());

    // ✅ Log for debugging
    console.log(`📂 Platform: ${platform}, Videos: ${filteredVideos.length}`);

    // Get platform display name
    const platformNames = {
        all: 'All Videos',
        youtube: 'YouTube Videos',
        tiktok: 'TikTok Videos',
        instagram: 'Instagram Videos',
        twitter: 'Twitter/X Videos',
        facebook: 'Facebook Videos',
        discord: 'Discord Videos',
        telegram: 'Telegram Videos',
    };

    const displayName = platformNames[platform?.toLowerCase()] || `${platform} Videos`;

    if (filteredVideos.length === 0 && platform !== 'all') {
        return (
            <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
                <i className="fas fa-video text-4xl text-gray-500 mb-3 block"></i>
                <p className="text-gray-400 text-sm">No {displayName} yet</p>
                <button
                    onClick={onAddVideo}
                    className="mt-2 text-supabase-green text-sm hover:underline"
                >
                    Add your first {platform} video
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                    {displayName}
                </h2>
                <button
                    onClick={onAddVideo}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
                >
                    <i className="fas fa-plus text-xs"></i> Add {platform === 'all' ? 'Video' : platform}
                </button>
            </div>
            <EditorVideoGrid
                videos={filteredVideos}
                onPlayVideo={onPlayVideo}
            />
        </>
    );
}