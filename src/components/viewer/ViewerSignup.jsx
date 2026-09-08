import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';

export default function ViewerSignup() {
    const [form, setForm] = useState({
        email: '',
        username: '',
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useViewerAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (form.username.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        setLoading(true);

        const result = await signUp(form.email, form.username, form.fullName, form.password, rememberMe);

        if (result.success) {
            navigate('/viewer-dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center pt-16 pb-20">
            <div className="relative w-full max-w-md p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-supabase-green/10 via-black to-emerald-500/10 rounded-3xl blur-3xl" />

                <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-user-plus text-white text-2xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create Account</h1>
                        <p className="text-gray-400 text-sm">Join to like, comment & download</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 transition-all"
                            required
                            autoComplete="email"
                        />

                        <input
                            type="text"
                            placeholder="Username (unique, min 3 characters)"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 transition-all"
                            required
                            autoComplete="username"
                        />

                        <input
                            type="text"
                            placeholder="Full name"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 transition-all"
                            required
                            autoComplete="name"
                        />

                        <input
                            type="password"
                            placeholder="Password (min 6 characters)"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 transition-all"
                            required
                            autoComplete="new-password"
                        />

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 transition-all"
                            required
                            autoComplete="new-password"
                        />

                        {/* Remember Me Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-supabase-green focus:ring-supabase-green"
                            />
                            <span className="text-gray-400 text-sm">Remember me</span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-supabase-green to-emerald-500 hover:from-supabase-green/90 hover:to-emerald-500/90 rounded-xl font-medium text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-supabase-green/25"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Creating account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/viewer-login" className="text-supabase-green hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}