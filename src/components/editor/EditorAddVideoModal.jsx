// src/components/editor/EditorAddVideoModal.jsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function EditorAddVideoModal({
    isOpen,
    onClose,
    onSubmit,
    platform,
    isPlatformSpecific,
    editingVideo,
}) {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '',
        description: '',
        video_url: '',
        platform: platform || 'auto',
        is_vip: false,
        is_top_rated: false,
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setLoading(false);
        setUploading(false);
    }, [isOpen]);

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
            if (editingVideo.thumbnail_url) {
                setThumbnailPreview(editingVideo.thumbnail_url);
            }
        } else {
            setForm({
                title: '',
                description: '',
                video_url: '',
                platform: platform || 'auto',
                is_vip: false,
                is_top_rated: false,
            });
            setThumbnailFile(null);
            setThumbnailPreview(null);
        }
    }, [editingVideo, platform]);

    // ✅ Handle thumbnail file selection
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    // ✅ Upload thumbnail to Supabase Storage
    const uploadThumbnail = async (videoId) => {
        if (!thumbnailFile) return null;

        try {
            const fileExt = thumbnailFile.name.split('.').pop();
            const fileName = `${videoId}/thumbnail_${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('video-thumbnails')
                .upload(fileName, thumbnailFile, { upsert: true });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('video-thumbnails')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (err) {
            console.error('Thumbnail upload error:', err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.video_url || !form.title) return;

        setLoading(true);

        try {
            let platform = form.platform === 'auto' ? detectPlatform(form.video_url) : form.platform;

            if (editingVideo) {
                let thumbnail_url = editingVideo.thumbnail_url || '';

                if (thumbnailFile) {
                    const uploadedUrl = await uploadThumbnail(editingVideo.id);
                    if (uploadedUrl) {
                        thumbnail_url = uploadedUrl;
                    }
                }

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

                if (error) {
                    console.error('Edit failed:', error);
                    alert('Failed to save changes: ' + error.message);
                    return;   // ← loading stays true, but finally will reset
                }

                onClose();
                onSubmit(form, null);
            } else {
                const { data: newVideo, error: insertError } = await supabase
                    .from('videos')
                    .insert([{
                        user_id: user.id,
                        title: form.title,
                        description: form.description,
                        video_url: form.video_url,
                        platform: platform,
                        is_vip: form.is_vip,
                        is_top_rated: form.is_top_rated,
                    }])
                    .select()
                    .single();

                if (insertError) {
                    console.error('Insert failed:', insertError);
                    alert('Failed to add video: ' + insertError.message);
                    return;
                }

                if (thumbnailFile) {
                    const uploadedUrl = await uploadThumbnail(newVideo.id);
                    if (uploadedUrl) {
                        await supabase
                            .from('videos')
                            .update({ thumbnail_url: uploadedUrl })
                            .eq('id', newVideo.id);
                        newVideo.thumbnail_url = uploadedUrl;
                    }
                }

                onClose();
                onSubmit(form, newVideo);
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('Something went wrong: ' + err.message);
        } finally {
            setLoading(false);
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
        return 'other';
    };

    if (!isOpen) return null;

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
                className="relative w-full max-w-lg bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <i className="fas fa-times text-lg"></i>
                </button>

                <h2 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                    <i className={`fas ${editingVideo ? 'fa-edit' : 'fa-plus'} text-supabase-green`}></i>
                    {editingVideo ? 'Edit' : 'Add'} {isPlatformSpecific ? platform : ''} Video
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

                    {/* ✅ Thumbnail Upload */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Thumbnail Image</label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all"
                            >
                                {thumbnailPreview ? 'Change Image' : 'Upload Image'}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailChange}
                            />
                            {thumbnailPreview && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThumbnailFile(null);
                                        setThumbnailPreview(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        {thumbnailPreview && (
                            <div className="mt-2">
                                <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    className="w-32 h-20 object-cover rounded-lg border border-white/10"
                                />
                            </div>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Upload a custom thumbnail (JPEG, PNG, max 5MB)</p>
                    </div>

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
                        disabled={loading || uploading}
                        className="w-full py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
                    >
                        <i className={`fas ${loading || uploading ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
                        {loading || uploading ? 'Saving...' : editingVideo ? 'Update' : 'Add'} Video
                    </button>
                </form>
            </div>
        </div>
    );
}