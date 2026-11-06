// src/pages/Signup.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user, profile, loading: authLoading } = useAuth();

    // ✅ If already signed in with a profile, skip to dashboard
    useEffect(() => {
        if (user && profile && !authLoading) {
            navigate('/dashboard');
        }
    }, [user, profile, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // ✅ Client-side validation
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (name.trim().length < 2) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);

        try {
            // ✅ Create the auth user AND pass the name in metadata
            // The database trigger will read raw_user_meta_data->>'name'
            // and create the profiles row automatically.
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name: name.trim() },
                },
            });

            if (signupError) throw signupError;

            // Supabase returns a user object even if email confirmation is
            // required. If confirmation is off, we're signed in immediately.
            // Either way, AuthContext will pick up the session and the
            // redirect useEffect above will fire.
            if (!data.user) {
                throw new Error('Signup failed. Please try again.');
            }

            // If email confirmation is required, Supabase will not create a
            // session — the user sees a "check your email" state instead.
            // We'll handle that by checking `data.session`.
            if (!data.session) {
                setError('Check your email to confirm your account, then sign in.');
            }
            // Otherwise, the redirect useEffect fires automatically.
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#141419] flex items-center justify-center">
            <div className="relative w-full max-w-md p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-supabase-green/10 via-black to-emerald-500/10 rounded-3xl blur-3xl" />
                <div className="relative bg-[#141419]/60 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-supabase-green/25">
                            <span className="text-white font-bold text-2xl">E</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Create Editor Account</h1>
                        <p className="text-gray-400 text-sm">Start collecting client feedback</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                            required
                            autoComplete="name"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                            required
                            autoComplete="email"
                        />

                        <input
                            type="password"
                            placeholder="Password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                            required
                            autoComplete="new-password"
                        />

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                            required
                            autoComplete="new-password"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-supabase-green hover:bg-supabase-green/80 rounded-xl font-medium text-white text-sm transition-all transform hover:scale-[1.02] shadow-lg shadow-supabase-green/25 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <span className="text-gray-500 text-sm">Already have an account? </span>
                        <Link
                            to="/login"
                            className="text-supabase-green hover:underline text-sm font-medium"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}