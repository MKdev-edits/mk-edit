// src/components/viewer/ViewerDashboard.jsx
import { useState } from 'react';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { Link } from 'react-router-dom';

export default function ViewerDashboard() {
    const { viewer, signOut, updateProfile, deleteAccount } = useViewerAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        full_name: viewer?.full_name || '',
        username: viewer?.username || '',
        avatar_url: viewer?.avatar_url || ''
    });

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

                {/* Settings Only */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
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
            </div>
        </div>
    );
}