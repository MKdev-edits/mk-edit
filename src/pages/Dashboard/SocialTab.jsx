import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SocialTab() {
    const { user } = useAuth();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ platform: '', url: '' });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('social_links')
            .select('*')
            .eq('user_id', user.id);
        setLinks(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.platform || !form.url) return;

        const { error } = await supabase.from('social_links').insert([{
            user_id: user.id,
            platform: form.platform,
            url: form.url
        }]);

        if (!error) {
            setShowModal(false);
            setForm({ platform: '', url: '' });
            fetchLinks();
        }
    };

    const handleDelete = async (id) => {
        await supabase.from('social_links').delete().eq('id', id);
        fetchLinks();
    };

    const getPlatformIcon = (platform) => {
        const lower = platform.toLowerCase();
        if (lower.includes('youtube')) return 'fab fa-youtube text-red-500';
        if (lower.includes('twitter') || lower === 'x') return 'fab fa-twitter text-blue-400';
        if (lower.includes('instagram')) return 'fab fa-instagram text-pink-500';
        if (lower.includes('tiktok')) return 'fab fa-tiktok text-pink-400';
        if (lower.includes('discord')) return 'fab fa-discord text-indigo-400';
        if (lower.includes('whatsapp')) return 'fab fa-whatsapp text-green-400';
        if (lower.includes('linkedin')) return 'fab fa-linkedin text-blue-600';
        if (lower.includes('facebook')) return 'fab fa-facebook text-blue-500';
        if (lower.includes('telegram')) return 'fab fa-telegram text-blue-400';
        if (lower.includes('github')) return 'fab fa-github text-gray-400';
        return 'fas fa-link text-gray-400';
    };

    if (loading) {
        return <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="bg-gray-900 rounded-xl p-4 h-16 animate-pulse"></div>)}
        </div>;
    }

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all"
            >
                <i className="fas fa-plus text-sm"></i> Add Social Platform
            </button>

            {links.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <i className="fas fa-share-alt text-5xl text-gray-500 mb-3 block"></i>
                    <p className="text-gray-400">No social links yet. Add your social media profiles.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {links.map(link => (
                        <div key={link.id} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-3">
                                <i className={`${getPlatformIcon(link.platform)} text-lg w-6`}></i>
                                <span className="text-white capitalize text-sm">{link.platform}</span>
                            </div>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-supabase-green text-xs hover:underline truncate max-w-[200px]">
                                {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                            <button onClick={() => handleDelete(link.id)} className="text-red-400 hover:text-red-300">
                                <i className="fas fa-trash-alt text-sm"></i>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Social Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141419]/80 backdrop-blur-lg" onClick={() => setShowModal(false)}>
                    <div className="relative w-full max-w-md bg-[#141419]/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <i className="fas fa-times text-lg"></i>
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-share-alt text-supabase-green"></i> Add Social Link
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Platform (e.g., Instagram, Twitter, Discord)"
                                value={form.platform}
                                onChange={e => setForm({ ...form, platform: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                                required
                            />
                            <input
                                type="url"
                                placeholder="Profile URL"
                                value={form.url}
                                onChange={e => setForm({ ...form, url: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                                required
                            />
                            <button type="submit" className="w-full py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all">
                                <i className="fas fa-plus mr-2"></i> Add Social Link
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}