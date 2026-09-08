// src/utils/oembed.js

/**
 * Get thumbnail via your Supabase Edge Function
 * This proxies ALL platforms through your domain
 */
export async function fetchThumbnail(videoUrl) {
    if (!videoUrl) return null;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const functionUrl = `${supabaseUrl}/functions/v1/get-thumbnail?url=${encodeURIComponent(videoUrl)}`;

    try {
        const response = await fetch(functionUrl);
        if (!response.ok) throw new Error('Failed to fetch thumbnail');

        // The function returns the actual image
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Thumbnail fetch error:', error);
        return null;
    }
}

// src/utils/oembed.js

// ... keep your existing code ...

/**
 * Fetch oEmbed data (returns both thumbnail and metadata)
 * This is a wrapper around fetchThumbnail that returns more data
 */
export async function fetchOEmbed(videoUrl) {
    if (!videoUrl) return null;

    try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const functionUrl = `${supabaseUrl}/functions/v1/get-thumbnail?url=${encodeURIComponent(videoUrl)}`;

        const response = await fetch(functionUrl);
        if (!response.ok) throw new Error('Failed to fetch thumbnail');

        // The function returns the actual image
        const blob = await response.blob();
        const thumbnailUrl = URL.createObjectURL(blob);

        // Detect platform
        const platform = detectPlatform(videoUrl);

        return {
            thumbnailUrl,
            platform,
            title: null, // We don't get title from the proxy
            // You could fetch more metadata if needed
        };
    } catch (error) {
        console.error('oEmbed fetch error:', error);
        return null;
    }
}

// Keep your existing fetchThumbnail function too
/**
 * Detect platform from URL
 */
export function detectPlatform(url) {
    if (!url) return 'other';
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('instagram.com')) return 'instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
    if (lower.includes('facebook.com')) return 'facebook';
    if (lower.includes('vimeo.com')) return 'vimeo';
    return 'other';
}

/**
 * Check if video can be embedded
 */
export function canPlayOnSite(platform) {
    const playable = ['youtube', 'vimeo'];
    return playable.includes(platform);
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform) {
    const names = {
        youtube: 'YouTube',
        tiktok: 'TikTok',
        instagram: 'Instagram',
        twitter: 'Twitter',
        facebook: 'Facebook',
        vimeo: 'Vimeo',
        other: 'Website'
    };
    return names[platform] || platform;
}