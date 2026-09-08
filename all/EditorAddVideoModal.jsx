// src/components/editor/EditorAddVideoModal.jsx
import { useState, useEffect } from 'react';

export default function EditorAddVideoModal({
    isOpen,
    onClose,
    onSubmit,
    platform,
    isPlatformSpecific,
    editingVideo,
}) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        video_url: '',
        platform: platform || 'auto',
        is_vip: false,
        is_top_rated: false,
    });
    const [loading, setLoading] = useState(false);

    // ✅ FIX: Populate form when editingVideo changes
    useEffect(() => {
        if (editingVideo) {
            setForm({
                title: editingVideo.title || '',
                description: editingVideo.description || '',
                video_url: editingVideo.video_url || '',
                platform: editingVideo.platform || 'auto',
                is_vip: editingVideo.is_vip || false,
                is_top_rated: editingVideo.is_top_rated || false,
            });
        } else {
            // Reset form when not editing
            setForm({
                title: '',
                description: '',
                video_url: '',
                platform: platform || 'auto',
                is_vip: false,
                is_top_rated: false,
            });
        }
    }, [editingVideo, platform]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(form);
        setLoading(false);
        onClose();
    };

    const platforms = [
        { value: 'auto', label: '🤖 Auto-detect' },
        { value: 'youtube', label: '▶️ YouTube' },
        { value: 'tiktok', label: '🎵 TikTok' },
        { value: 'instagram', label: '📸 Instagram' },
        { value: 'twitter', label: '🐦 Twitter/X' },
        { value: 'facebook', label: '📘 Facebook' },
        { value: 'discord', label: '💬 Discord' },
        { value: 'other', label: '🌐 Other' },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <i className="fas fa-times text-lg"></i>
                </button>

                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-plus text-supabase-green"></i>
                    Add {isPlatformSpecific ? platform : ''} Video
                </h2>

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
                        placeholder="Video URL *"
                        value={form.video_url}
                        onChange={e => setForm({ ...form, video_url: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                        required
                    />

                    {!isPlatformSpecific && (
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Platform</label>
                            <select
                                value={form.platform}
                                onChange={e => setForm({ ...form, platform: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                            >
                                {platforms.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_vip}
                                onChange={e => setForm({ ...form, is_vip: e.target.checked })}
                                className="w-4 h-4 accent-supabase-green"
                            />
                            <i className="fas fa-crown text-yellow-400 text-xs"></i> VIP
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_top_rated}
                                onChange={e => setForm({ ...form, is_top_rated: e.target.checked })}
                                className="w-4 h-4 accent-supabase-green"
                            />
                            <i className="fas fa-star text-supabase-green text-xs"></i> Top Rated
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
                    >
                        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
                        {loading ? 'Adding...' : 'Add Video'}
                    </button>
                </form>
            </div>
        </div>
    );
}