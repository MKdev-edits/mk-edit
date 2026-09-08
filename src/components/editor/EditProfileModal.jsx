// src/components/editor/EditProfileModal.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function EditProfileModal({ isOpen, onClose, onSuccess }) {
    const { profile, updateProfile } = useAuth();
    const [form, setForm] = useState({
        name: '',
        tagline: '',
        about: '',
        profile_image: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name || '',
                tagline: profile.tagline || '',
                about: profile.about || '',
                profile_image: profile.profile_image || '',
            });
        }
    }, [profile]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const { error } = await updateProfile(form);
            if (!error) {
                setMessage('✅ Profile updated successfully!');
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                setMessage('❌ Error updating profile');
            }
        } catch (err) {
            setMessage('❌ Error updating profile');
        }
        setSaving(false);
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <i className="fas fa-times text-lg"></i>
                </button>

                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-user-edit text-supabase-green"></i>
                    Edit Profile
                </h2>

                {message && (
                    <div className={`p-3 rounded-xl text-sm mb-4 ${message.includes('✅')
                            ? 'bg-supabase-green/20 text-supabase-green border border-supabase-green/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                            <i className="fas fa-user text-xs"></i> Display Name
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Your display name"
                            className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                        />
                    </div>

                    {/* Tagline */}
                    <div>
                        <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                            <i className="fas fa-tag text-xs"></i> Tagline
                        </label>
                        <input
                            type="text"
                            value={form.tagline}
                            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                            placeholder="Video Editor | Content Creator"
                            className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                        />
                    </div>

                    {/* About/Bio */}
                    <div>
                        <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                            <i className="fas fa-align-left text-xs"></i> About / Bio
                        </label>
                        <textarea
                            rows="4"
                            value={form.about}
                            onChange={(e) => setForm({ ...form, about: e.target.value })}
                            placeholder="Tell your audience about yourself..."
                            className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 resize-none"
                        />
                    </div>

                    {/* Profile Image URL */}
                    <div>
                        <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                            <i className="fas fa-image text-xs"></i> Profile Image URL
                        </label>
                        <input
                            type="url"
                            value={form.profile_image}
                            onChange={(e) => setForm({ ...form, profile_image: e.target.value })}
                            placeholder="https://example.com/your-image.jpg"
                            className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                        />
                        {form.profile_image && (
                            <div className="mt-2">
                                <img
                                    src={form.profile_image}
                                    alt="Preview"
                                    className="w-12 h-12 rounded-full object-cover border border-supabase-green/50"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-50"
                    >
                        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}