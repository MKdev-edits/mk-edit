import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function PrivateTab() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ video_url: '', original_name: '' });

    useEffect(() => {
        fetchPrivateVideos();
    }, []);

    const fetchPrivateVideos = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('private_storage')
            .select('*')
            .eq('user_id', user.id);
        setVideos(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.video_url) return;

        const { error } = await supabase.from('private_storage').insert([{
            user_id: user.id,
            video_url: form.video_url,
            original_name: form.original_name || 'Private Video',
        }]);

        if (!error) {
            setShowModal(false);
            setForm({ video_url: '', original_name: '' });
            fetchPrivateVideos();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete from private storage?')) {
            await supabase.from('private_storage').delete().eq('id', id);
            fetchPrivateVideos();
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="bg-gray-900 rounded-xl p-4 h-48 animate-pulse"></div>)}
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all"
            >
                <i className="fas fa-lock text-sm"></i> Add Private Video
            </button>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                <i className="fas fa-shield-alt text-yellow-400 text-lg"></i>
                <p className="text-yellow-400 text-sm">🔒 Private videos are hidden from the homepage. You can watch them anytime.</p>
            </div>

            {videos.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <i className="fas fa-lock text-5xl text-gray-500 mb-3 block"></i>
                    <p className="text-gray-400">No private videos. Add videos to store them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map(video => (
                        <div key={video.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="fas fa-lock text-gray-500 text-sm"></i>
                                <p className="text-white text-sm font-medium truncate flex-1">{video.original_name || 'Private Video'}</p>
                            </div>
                            <p className="text-gray-500 text-xs truncate">{video.video_url}</p>
                            <div className="flex gap-2 mt-3">
                                <a
                                    href={video.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center py-2 bg-supabase-green/20 text-supabase-green rounded-lg text-xs hover:bg-supabase-green hover:text-white transition-all flex items-center justify-center gap-1"
                                >
                                    <i className="fas fa-play text-xs"></i> Watch
                                </a>
                                <button
                                    onClick={() => handleDelete(video.id)}
                                    className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <i className="fas fa-trash-alt text-xs"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Private Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141419]/80 backdrop-blur-lg" onClick={() => setShowModal(false)}>
                    <div className="relative w-full max-w-lg bg-[#141419]/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <i className="fas fa-times text-lg"></i>
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-lock text-supabase-green"></i> Add Private Video
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Video Name (optional)"
                                value={form.original_name}
                                onChange={e => setForm({ ...form, original_name: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                            />
                            <input
                                type="url"
                                placeholder="Video URL"
                                value={form.video_url}
                                onChange={e => setForm({ ...form, video_url: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                                required
                            />
                            <button type="submit" className="w-full py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all">
                                <i className="fas fa-save mr-2"></i> Save to Private Storage
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}