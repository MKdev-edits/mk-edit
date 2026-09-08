import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="relative w-full max-w-md p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-supabase-green/10 via-black to-emerald-500/10 rounded-3xl blur-3xl" />

                <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-2xl animate-scale-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">🔑</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Update Password</h1>
                        <p className="text-gray-400 text-sm">Choose a new password for your account</p>
                    </div>

                    {success ? (
                        <div className="text-center">
                            <div className="mb-4 p-4 bg-supabase-green/20 border border-supabase-green/50 rounded-xl text-supabase-green text-sm">
                                ✅ Password updated successfully! Redirecting to login...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-white text-sm transition-all"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}