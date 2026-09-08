import { useState, useEffect } from 'react';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function ViewerDashboard() {
    const { viewer, signOut, updateProfile, deleteAccount } = useViewerAuth();
    const [activeTab, setActiveTab] = useState('likes');
    const [likedVideos, setLikedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        full_name: viewer?.full_name || '',
        username: viewer?.username || '',
        avatar_url: viewer?.avatar_url || ''
    });

    useEffect(() => {
        if (viewer) {
            fetchLikedVideos();
        }
    }, [viewer]);

    const fetchLikedVideos = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('video_likes')
            .select('video_id, videos(*)')
            .eq('viewer_id', viewer.id)
            .order('created_at', { ascending: false });

        if (data) {
            const videos = data.map(item => item.videos).filter(v => v);
            setLikedVideos(videos);
        }
        setLoading(false);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const result = await updateProfile(form);
        if (result.success) {
            setEditing(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm('Are you sure? This will delete ALL your data permanently.')) {
            await deleteAccount();
            window.location.href = '/';
        }
    };

    const tabs = [
        { id: 'likes', label: 'Liked Videos', icon: 'fas fa-heart' },
        { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
    ];

    if (!viewer) {
        return (
            <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400">Please login to view dashboard</p>
                    <Link to="/viewer-login" className="text-supabase-green mt-2 inline-block">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-20 pb-20">
            <div className="max-w-2xl mx-auto px-4">
                {/* Profile Header */}
                <div className="text-center mb-8">
                    {viewer.avatar_url ? (
                        <img src={viewer.avatar_url} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-supabase-green/50" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-user text-white text-4xl"></i>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-white">{viewer.full_name}</h1>
                    <p className="text-gray-400">@{viewer.username}</p>
                    <button onClick={signOut} className="mt-3 text-sm text-red-400 hover:text-red-300">
                        <i className="fas fa-sign-out-alt mr-1"></i> Sign Out
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/10">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === tab.id
                                ? 'text-supabase-green border-b-2 border-supabase-green'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <i className={tab.icon}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Liked Videos Tab */}
                {activeTab === 'likes' && (
                    <div>
                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : likedVideos.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-2xl">
                                <i className="fas fa-heart text-5xl text-gray-500 mb-3"></i>
                                <p className="text-gray-400">No liked videos yet</p>
                                <Link to="/" className="text-supabase-green text-sm mt-2 inline-block">
                                    Browse videos
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {likedVideos.map(video => (
                                    <Link
                                        key={video.id}
                                        to={`/video/${video.id}`}
                                        className="flex gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        <img src={video.thumbnail_url} className="w-20 h-20 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium line-clamp-2">{video.title}</h3>
                                            <p className="text-gray-500 text-xs mt-1">{video.views} views</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div>
                        {editing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={form.full_name}
                                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white"
                                />
                                <input
                                    type="url"
                                    placeholder="Avatar URL"
                                    value={form.avatar_url}
                                    onChange={e => setForm({ ...form, avatar_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white"
                                />
                                <div className="flex gap-3">
                                    <button type="submit" className="flex-1 py-2 bg-supabase-green rounded-xl">Save</button>
                                    <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 bg-white/10 rounded-xl">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm">Full Name</p>
                                    <p className="text-white">{viewer.full_name}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm">Username</p>
                                    <p className="text-white">@{viewer.username}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-white">{viewer.email}</p>
                                </div>
                                <button onClick={() => setEditing(true)} className="w-full py-2 bg-supabase-green/20 text-supabase-green rounded-xl">
                                    Edit Profile
                                </button>
                                <button onClick={handleDeleteAccount} className="w-full py-2 bg-red-600/20 text-red-400 rounded-xl">
                                    Delete Account
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}