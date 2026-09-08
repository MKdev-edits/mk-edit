import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileTab() {
    const { profile, updateProfile } = useAuth();
    const [form, setForm] = useState({
        name: profile?.name || '',
        tagline: profile?.tagline || '',
        about: profile?.about || '',
        profile_image: profile?.profile_image || '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await updateProfile(form);
        if (!error) {
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage('Error updating profile');
        }
        setSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
            {message && (
                <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-supabase-green/20 text-supabase-green'}`}>
                    <i className={`fas ${message.includes('Error') ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
                    {message}
                </div>
            )}

            <div>
                <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                    <i className="fas fa-image text-xs"></i> Profile Image URL
                </label>
                <input
                    type="url"
                    value={form.profile_image}
                    onChange={e => setForm({ ...form, profile_image: e.target.value })}
                    placeholder="https://example.com/your-image.jpg"
                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                />
                {form.profile_image && (
                    <div className="mt-2">
                        <img src={form.profile_image} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-supabase-green/50" />
                    </div>
                )}
            </div>

            <div>
                <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                    <i className="fas fa-user text-xs"></i> Display Name
                </label>
                <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                />
            </div>

            <div>
                <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                    <i className="fas fa-tag text-xs"></i> Tagline
                </label>
                <input
                    type="text"
                    value={form.tagline}
                    onChange={e => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Video Editor | Content Creator"
                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                />
            </div>

            <div>
                <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                    <i className="fas fa-align-left text-xs"></i> About Section
                </label>
                <textarea
                    rows="5"
                    value={form.about}
                    onChange={e => setForm({ ...form, about: e.target.value })}
                    placeholder="Tell your audience about yourself..."
                    className="w-full px-4 py-2 bg-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green"
                />
            </div>

            <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
            >
                <i className="fas fa-save text-sm"></i> {saving ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    );
}