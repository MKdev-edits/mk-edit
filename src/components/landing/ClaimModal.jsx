// src/components/landing/ClaimModal.jsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

export default function ClaimModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [gifPerk, setGifPerk] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [waitlistCount, setWaitlistCount] = useState(0);
    const [isAvailable, setIsAvailable] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const modalRef = useRef(null);

    // ✅ Fetch waitlist count
    useEffect(() => {
        const fetchCount = async () => {
            const { count } = await supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true });
            setWaitlistCount(count || 0);
        };
        if (isOpen) fetchCount();
    }, [isOpen]);

    // ✅ Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSuccess(false);
            setError('');
            setEmail('');
            setSubdomain('');
            setIsAvailable(null);
        }
    }, [isOpen]);

    // ✅ Check subdomain availability
    useEffect(() => {
        const checkAvailability = async () => {
            if (!subdomain || subdomain.length < 3) {
                setIsAvailable(null);
                return;
            }

            if (!/^[a-z0-9]+$/.test(subdomain)) {
                setIsAvailable(false);
                return;
            }

            setIsChecking(true);
            const { data } = await supabase
                .from('waitlist')
                .select('subdomain')
                .eq('subdomain', subdomain)
                .maybeSingle();

            setIsAvailable(!data);
            setIsChecking(false);
        };

        const timer = setTimeout(checkAvailability, 300);
        return () => clearTimeout(timer);
    }, [subdomain]);

    // ✅ Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // ✅ Auto-focus on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                document.getElementById('modal-email')?.focus();
            }, 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    // ✅ Send confirmation email via Supabase Edge Function
    const sendConfirmationEmail = async (email, subdomain, position) => {
        try {
            const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTION_URL; // ← Paste your URL

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    subdomain,
                    position,
                    to: email,
                }),
            });

            const data = await response.json();
            if (data.success) {
                console.log('✅ Confirmation email sent!');
            } else {
                console.error('Email error:', data.error);
            }
        } catch (err) {
            console.error('Failed to send email:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !subdomain) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!/^[a-z0-9]+$/.test(subdomain)) {
            setError('Subdomain: only lowercase letters and numbers');
            setLoading(false);
            return;
        }

        if (subdomain.length < 3) {
            setError('Subdomain must be at least 3 characters');
            setLoading(false);
            return;
        }

        try {
            const { data: existing } = await supabase
                .from('waitlist')
                .select('subdomain')
                .eq('subdomain', subdomain)
                .maybeSingle();

            if (existing) {
                setError('❌ Subdomain is taken. Try another.');
                setLoading(false);
                return;
            }

            const { error: insertError } = await supabase
                .from('waitlist')
                .insert([{
                    email: email.trim(),
                    subdomain: subdomain.trim(),
                    gif_perk: gifPerk,
                }]);

            if (insertError) {
                if (insertError.code === '23505') {
                    if (insertError.message.includes('email')) {
                        setError('❌ This email is already registered.');
                    } else {
                        setError('❌ This subdomain is already taken. Try another.');
                    }
                } else {
                    setError('Something went wrong. Please try again.');
                }
                setLoading(false);
                return;
            }

            // ✅ Success! Send confirmation email
            const newPosition = waitlistCount + 1;
            await sendConfirmationEmail(email, subdomain, newPosition);

            setSuccess(true);
            setWaitlistCount(newPosition);

        } catch (err) {
            console.error('Submission error:', err);
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    // ✅ Success view
    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in" onClick={onClose}>
                <div className="relative w-full max-w-md bg-[#1a1a2e]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
                        <i className="fas fa-check text-green-400 text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white">🎉 You're #21 in line!</h2>
                    <p className="text-gray-300 mt-2">Your subdomain is <span className="text-blue-400 font-medium">reserved</span>:</p>
                    <p className="text-blue-400 font-bold text-lg mt-1">{subdomain}.yourapp.pages.dev</p>
                    <p className="text-gray-400 text-sm mt-4">We'll email you when your portfolio is ready.</p>
                    {gifPerk && (
                        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <span className="text-blue-400 text-sm">💎 GIF Perk: <span className="text-white font-medium">ACTIVATED</span></span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in" onClick={onClose}>
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-[#1a1a2e]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 animate-scale-in overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-3">
                        <i className="fas fa-rocket text-blue-400 text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Claim Your Free Subdomain</h2>
                    <p className="text-gray-400 text-sm mt-1">Reserve your portfolio URL</p>
                </div>

                {/* Perk Banner */}
                <div className="mb-5 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <i className="fas fa-gift text-blue-400 text-lg mt-0.5"></i>
                        <div>
                            <p className="text-white text-sm font-medium">💎 Auto-Storyboard GIF Perk</p>
                            <p className="text-gray-400 text-xs">($29 value – Free for first 100 members)</p>
                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={gifPerk}
                                    onChange={(e) => setGifPerk(e.target.checked)}
                                    className="w-4 h-4 accent-blue-500"
                                />
                                <span className="text-gray-300 text-sm">Yes, I want this perk</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1.5">Email</label>
                        <input
                            id="modal-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Subdomain */}
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1.5">Subdomain</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={subdomain}
                                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                placeholder="yourname"
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                                minLength={3}
                                maxLength={30}
                            />
                            <span className="text-gray-400 text-sm whitespace-nowrap">.yourapp.pages.dev</span>
                        </div>

                        {/* Availability status */}
                        {subdomain.length >= 3 && (
                            <div className="mt-1.5 text-sm">
                                {isChecking ? (
                                    <span className="text-gray-400">Checking availability...</span>
                                ) : isAvailable === true ? (
                                    <span className="text-green-400">✅ <span className="font-medium">{subdomain}</span> is available!</span>
                                ) : isAvailable === false ? (
                                    <span className="text-red-400">❌ Taken. Try another.</span>
                                ) : null}
                            </div>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Only lowercase letters and numbers (no spaces, no hyphens)</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !isAvailable}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <i className="fas fa-spinner fa-spin"></i>
                                Reserving...
                            </span>
                        ) : (
                            <>
                                <span>🚀</span>
                                Reserve My Subdomain
                                <i className="fas fa-arrow-right text-sm"></i>
                            </>
                        )}
                    </button>

                    <p className="text-gray-500 text-xs text-center">
                        🔒 We'll email you when your portfolio is ready. No spam.
                    </p>
                </form>
            </div>
        </div>
    );
}