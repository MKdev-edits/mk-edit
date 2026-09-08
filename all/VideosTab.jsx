import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { fetchOEmbed } from '../../utils/oembed';

export default function VideosTab() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [uploading, setUploading] = useState({});
    const [videoThumbnails, setVideoThumbnails] = useState({});
    const [form, setForm] = useState({
        title: '',
        description: '',
        video_url: '',
        platform: 'auto',
        is_vip: false,
        is_top_rated: false,
    });

    useEffect(() => {
        if (user?.id) fetchVideos();
    }, [user?.id]);

    useEffect(() => {
        if (videos.length > 0) {
            const query = searchQuery.toLowerCase();
            const filtered = videos.filter(video => {
                return (
                    video.title?.toLowerCase().includes(query) ||
                    video.description?.toLowerCase().includes(query) ||
                    video.platform?.toLowerCase().includes(query)
                );
            });
            setFilteredVideos(filtered);
        } else {
            setFilteredVideos(videos);
        }
    }, [searchQuery, videos]);

    // ✅ Fetch oEmbed thumbnails for dashboard videos
    useEffect(() => {
        const loadThumbnails = async () => {
            const thumbnails = {};
            for (const video of filteredVideos) {
                if (video.thumbnail_url) {
                    // Use manual upload if exists
                    thumbnails[video.id] = video.thumbnail_url;
                } else {
                    // Try oEmbed
                    try {
                        const result = await fetchOEmbed(video.video_url);
                        if (result?.thumbnailUrl) {
                            thumbnails[video.id] = result.thumbnailUrl;
                        }
                    } catch (err) {
                        console.error('oEmbed error for video:', video.id);
                    }
                }
            }
            setVideoThumbnails(thumbnails);
        };

        if (filteredVideos.length > 0) {
            loadThumbnails();
        }
    }, [filteredVideos]);

    // ✅ Get thumbnail for dashboard
    const getDashboardThumbnail = (video) => {
        // 1. Check if we have oEmbed thumbnail
        if (videoThumbnails[video.id]) return videoThumbnails[video.id];

        // 2. Check manual upload
        if (video.thumbnail_url) return video.thumbnail_url;

        // 3. YouTube fallback
        if (video.video_url?.includes('youtube.com')) {
            const id = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
            if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        }

        // 4. Placeholder
        return 'https://via.placeholder.com/300x300/1a1a2e/10B981?text=🎬';
    };

    const fetchVideos = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching videos:', error);
                setVideos([]);
            } else {
                setVideos(data || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ NEW: Thumbnail upload function
    const handleThumbnailUpload = async (file, videoId) => {
        if (!file) return;

        setUploading(prev => ({ ...prev, [videoId]: true }));

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${videoId}/thumbnail_${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('video-thumbnails')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('video-thumbnails')
                .getPublicUrl(fileName);

            // Update video with new thumbnail
            const { error: updateError } = await supabase
                .from('videos')
                .update({ thumbnail_url: publicUrl })
                .eq('id', videoId);

            if (updateError) throw updateError;

            // Refresh videos to show new thumbnail
            await fetchVideos();

        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload thumbnail');
        } finally {
            setUploading(prev => ({ ...prev, [videoId]: false }));
        }
    };

    const detectPlatform = (url) => {
        if (!url) return 'other';
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
        if (lowerUrl.includes('tiktok.com')) return 'tiktok';
        if (lowerUrl.includes('instagram.com')) return 'instagram';
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
        if (lowerUrl.includes('facebook.com')) return 'facebook';
        if (lowerUrl.includes('discord.com')) return 'discord';
        if (lowerUrl.includes('vimeo.com')) return 'vimeo';
        return 'other';
    };

    const getYouTubeThumbnail = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.video_url || !form.title) return;

        let platform = form.platform === 'auto' ? detectPlatform(form.video_url) : form.platform;
        let thumbnail_url = platform === 'youtube' ? getYouTubeThumbnail(form.video_url) : '';

        if (editingVideo) {
            const { error } = await supabase
                .from('videos')
                .update({
                    title: form.title,
                    description: form.description,
                    video_url: form.video_url,
                    thumbnail_url: thumbnail_url,
                    platform: platform,
                    is_vip: form.is_vip,
                    is_top_rated: form.is_top_rated
                })
                .eq('id', editingVideo.id);

            if (!error) {
                setShowModal(false);
                setEditingVideo(null);
                setForm({ title: '', description: '', video_url: '', platform: 'auto', is_vip: false, is_top_rated: false });
                fetchVideos();
            }
        } else {
            const { error } = await supabase.from('videos').insert([{
                user_id: user.id,
                title: form.title,
                description: form.description,
                video_url: form.video_url,
                thumbnail_url: thumbnail_url,
                platform: platform,
                is_vip: form.is_vip,
                is_top_rated: form.is_top_rated
            }]);

            if (!error) {
                setShowModal(false);
                setForm({ title: '', description: '', video_url: '', platform: 'auto', is_vip: false, is_top_rated: false });
                fetchVideos();
            }
        }
    };

    const handleEdit = (video) => {
        setEditingVideo(video);
        setForm({
            title: video.title || '',
            description: video.description || '',
            video_url: video.video_url || '',
            platform: video.platform || 'auto',
            is_vip: video.is_vip || false,
            is_top_rated: video.is_top_rated || false,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this video?')) {
            await supabase.from('videos').delete().eq('id', id);
            fetchVideos();
        }
    };

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p === 'youtube') return <i className="fab fa-youtube text-red-500"></i>;
        if (p === 'tiktok') return <i className="fab fa-tiktok text-pink-400"></i>;
        if (p === 'instagram') return <i className="fab fa-instagram text-pink-500"></i>;
        if (p === 'twitter' || p === 'x') return <i className="fab fa-twitter text-blue-400"></i>;
        if (p === 'discord') return <i className="fab fa-discord text-indigo-400"></i>;
        if (p === 'facebook') return <i className="fab fa-facebook text-blue-500"></i>;
        if (p === 'telegram') return <i className="fab fa-telegram text-blue-400"></i>;
        return <i className="fas fa-globe text-gray-400"></i>;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-900 rounded-xl p-4 h-48 animate-pulse"></div>)}
            </div>
        );
    }

    return (
        <div>
            {/* Search + Add Button */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Search by title, description, or platform..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white/10 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <i className="fas fa-times text-xs"></i>
                            </button>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingVideo(null);
                        setForm({ title: '', description: '', video_url: '', platform: 'auto', is_vip: false, is_top_rated: false });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all whitespace-nowrap"
                >
                    <i className="fas fa-plus text-sm"></i> Add Video
                </button>
            </div>

            {searchQuery && (
                <p className="text-gray-400 text-sm mb-4">
                    Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
            )}

            {filteredVideos.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <i className="fas fa-video text-5xl text-gray-500 mb-3 block"></i>
                    <p className="text-gray-400">
                        {searchQuery ? 'No videos match your search' : 'No videos yet. Click "Add Video" to get started.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredVideos.map(video => {
                        // Get thumbnail with fallback
                        const thumbnail = video.thumbnail_url ||
                            (video.video_url?.includes('youtube.com') ?
                                `https://img.youtube.com/vi/${extractYouTubeId(video.video_url)}/hqdefault.jpg` :
                                null);

                        return (
                            <div key={video.id} className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all">
                                {/* ✅ Thumbnail Image - Fixed background issue */}
                                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800 mb-2">
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x300/1a1a2e/10B981?text=🎬';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
                                            🎬
                                        </div>
                                    )}

                                    {/* ✅ Upload Button - Clean design */}
                                    <div className="absolute bottom-2 right-2">
                                        <label className={`cursor-pointer ${uploading[video.id] ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <div className="bg-black/70 backdrop-blur-sm rounded-full p-2 hover:bg-black/90 transition-all border border-white/20">
                                                {uploading[video.id] ? (
                                                    <div className="w-4 h-4 border-2 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin"></div>
                                                ) : (
                                                    <i className="fas fa-upload text-white text-xs"></i>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleThumbnailUpload(file, video.id);
                                                    }
                                                    e.target.value = ''; // Reset input
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                    {getPlatformIcon(video.platform)}
                                    <h3 className="text-white font-medium text-sm truncate flex-1">{video.title}</h3>
                                </div>
                                <p className="text-gray-400 text-xs line-clamp-2 mb-2">{video.description || 'No description'}</p>

                                <div className="flex gap-1 mb-2 flex-wrap">
                                    {video.is_vip && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full"><i className="fas fa-crown text-xs mr-1"></i>VIP</span>}
                                    {video.is_top_rated && <span className="text-xs bg-supabase-green/20 text-supabase-green px-2 py-0.5 rounded-full"><i className="fas fa-star text-xs mr-1"></i>Top</span>}
                                </div>

                                <div className="flex gap-2">
                                    <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-1.5 bg-supabase-green/20 text-supabase-green rounded-lg text-xs hover:bg-supabase-green hover:text-white transition-all">
                                        <i className="fas fa-play text-xs mr-1"></i>Play
                                    </a>
                                    <button onClick={() => handleEdit(video)} className="flex-1 text-center py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500 hover:text-white transition-all">
                                        <i className="fas fa-edit text-xs mr-1"></i>Edit
                                    </button>
                                    <button onClick={() => handleDelete(video.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600 hover:text-white transition-all">
                                        <i className="fas fa-trash-alt text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal - Keep same as before */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg" onClick={() => setShowModal(false)}>
                    <div className="relative w-full max-w-lg bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <i className="fas fa-times text-lg"></i>
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4">{editingVideo ? 'Edit Video' : 'Add Video'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Video Title *"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                rows="3"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                            />
                            <input
                                type="url"
                                placeholder="Video URL (YouTube, TikTok, etc.) *"
                                value={form.video_url}
                                onChange={e => setForm({ ...form, video_url: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                                required
                            />
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Platform</label>
                                <select
                                    value={form.platform}
                                    onChange={e => setForm({ ...form, platform: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                                >
                                    <option value="auto">🤖 Auto-detect</option>
                                    <option value="youtube">▶️ YouTube</option>
                                    <option value="tiktok">🎵 TikTok</option>
                                    <option value="instagram">📸 Instagram</option>
                                    <option value="twitter">🐦 Twitter/X</option>
                                    <option value="discord">💬 Discord</option>
                                    <option value="facebook">📘 Facebook</option>
                                    <option value="telegram">✈️ Telegram</option>
                                    <option value="other">🌐 Other</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input type="checkbox" checked={form.is_vip} onChange={e => setForm({ ...form, is_vip: e.target.checked })} className="w-4 h-4" />
                                    <i className="fas fa-crown text-yellow-400 text-xs"></i> VIP
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input type="checkbox" checked={form.is_top_rated} onChange={e => setForm({ ...form, is_top_rated: e.target.checked })} className="w-4 h-4" />
                                    <i className="fas fa-star text-supabase-green text-xs"></i> Top Rated
                                </label>
                            </div>
                            <button type="submit" className="w-full py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all">
                                <i className="fas fa-save mr-2"></i> {editingVideo ? 'Update' : 'Add'} Video
                            </button>
                        </form>
                    </div>
                </div>
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