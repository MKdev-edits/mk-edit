// src/utils/thumbnail.js

export const getThumbnail = (video) => {
    if (!video) return 'https://via.placeholder.com/400x400/1a1a2e/10B981?text=🎬';

    // 1. If thumbnail exists in database, use it
    if (video.thumbnail_url) return video.thumbnail_url;

    // 2. YouTube fallback
    if (video.video_url?.includes('youtube.com')) {
        const id = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
        if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    // 3. TikTok placeholder
    if (video.video_url?.includes('tiktok.com')) {
        return 'https://via.placeholder.com/400x400/1a1a2e/00f2ea?text=🎵';
    }

    // 4. Twitter placeholder
    if (video.video_url?.includes('twitter.com') || video.video_url?.includes('x.com')) {
        return 'https://via.placeholder.com/400x400/1a1a2e/1DA1F2?text=🐦';
    }

    // 5. Default placeholder
    return 'https://via.placeholder.com/400x400/1a1a2e/10B981?text=🎬';
};