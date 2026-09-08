import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const { signIn, user, profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ✅ Auto-redirect when profile is loaded
    useEffect(() => {
        if (user && profile && !authLoading) {
            navigate('/dashboard');
        }
    }, [user, profile, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            // ✅ Let useEffect handle navigation
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/update-password',
            });
            if (error) throw error;
            setResetSent(true);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    if (resetMode) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="relative w-full max-w-md p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-supabase-green/10 via-black to-emerald-500/10 rounded-3xl blur-3xl" />
                    <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">🔐</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
                            <p className="text-gray-400 text-sm">We'll send you a reset link</p>
                        </div>
                        {resetSent ? (
                            <div className="text-center">
                                <div className="mb-4 p-4 bg-supabase-green/20 border border-supabase-green/50 rounded-xl text-supabase-green text-sm">
                                    ✅ Check your email for a password reset link.
                                </div>
                                <button onClick={() => { setResetMode(false); setResetSent(false); }} className="text-supabase-green hover:underline text-sm">
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">{error}</div>}
                                <input
                                    type="email"
                                    placeholder="Your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                                    required
                                />
                                <button type="submit" disabled={loading} className="w-full py-3 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-white text-sm transition-all">
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                                <button type="button" onClick={() => setResetMode(false)} className="w-full text-center text-gray-500 hover:text-gray-400 text-sm">
                                    ← Back to Login
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="relative w-full max-w-md p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-supabase-green/10 via-black to-emerald-500/10 rounded-3xl blur-3xl" />
                <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-supabase-green/25">
                            <span className="text-white font-bold text-2xl">E</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Editor Login</h1>
                        <p className="text-gray-400 text-sm">Sign in to manage your video portfolio</p>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                            required
                        />
                        <button type="submit" disabled={loading} className="w-full py-3 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-white text-sm transition-all transform hover:scale-[1.02] shadow-lg shadow-supabase-green/25 disabled:opacity-50">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button onClick={() => setResetMode(true)} className="text-gray-500 hover:text-supabase-green text-sm transition-colors">
                            Forgot password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}