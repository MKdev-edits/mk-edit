import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';

export default function ViewerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, savedEmail, viewer, loading: authLoading } = useViewerAuth();
    const navigate = useNavigate();

    // ✅ FIX: Auto-redirect when viewer is loaded
    useEffect(() => {
        if (viewer && !authLoading) {
            console.log('✅ Viewer loaded, redirecting to dashboard...');
            navigate('/viewer-dashboard');
        }
    }, [viewer, authLoading, navigate]);

    // ✅ Also redirect if already logged in (when component mounts)
    useEffect(() => {
        if (viewer && !authLoading) {
            navigate('/viewer-dashboard');
        }
    }, []);

    useEffect(() => {
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, [savedEmail]);

    const [savedEmails, setSavedEmails] = useState([]);

    useEffect(() => {
        const emails = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === 'savedViewerEmail') {
                const value = localStorage.getItem(key);
                if (value && !emails.includes(value)) emails.push(value);
            }
        }
        setSavedEmails(emails);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('🔑 ViewerLogin: Attempting login...');
        const result = await signIn(email, password, rememberMe);

        if (result.success) {
            console.log('✅ Login successful, waiting for viewer profile...');
            // ✅ DON'T navigate here - let the useEffect handle it
        } else {
            console.error('❌ Login failed:', result.error);
            setError(result.error || 'Invalid email or password');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center pt-16 pb-20">
            <div className="relative w-full max-w-md p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-supabase-green/10 via-black to-emerald-500/10 rounded-3xl blur-3xl" />

                <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-supabase-green/25">
                            <i className="fas fa-user text-white text-2xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
                        <p className="text-gray-400 text-sm">Sign in to continue watching</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                            <input
                                type="email"
                                list="savedEmailsList"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 transition-all"
                                style={{ fontSize: '16px' }}
                                required
                                autoComplete="email"
                            />
                            <datalist id="savedEmailsList">
                                {savedEmails.map((savedEmail, idx) => (
                                    <option key={idx} value={savedEmail} />
                                ))}
                            </datalist>
                        </div>

                        <div className="relative">
                            <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20 transition-all"
                                style={{ fontSize: '16px' }}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                            </button>
                        </div>

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
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/viewer-signup" className="text-supabase-green hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}