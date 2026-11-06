// src/components/landing/ClaimModal.jsx
import { useState, useEffect, useRef } from 'react';
import { X, Rocket, Check, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

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

    // Fetch waitlist count
    useEffect(() => {
        const fetchCount = async () => {
            const { count } = await supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true });
            setWaitlistCount(count || 0);
        };
        if (isOpen) fetchCount();
    }, [isOpen]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setSuccess(false);
            setError('');
            setEmail('');
            setSubdomain('');
            setIsAvailable(null);
        }
    }, [isOpen]);

    // Check availability
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

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Auto-focus + lock scroll
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

    // confirmation email using BREVO API
    const sendConfirmationEmail = async (email, subdomain, position) => {
        try {
            const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome-email`;

            console.log('📧 Sending via Edge Function...');

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ email, subdomain, position }),
            });

            const data = await response.json();
            console.log('📬 Response:', response.status, data);

            if (data.success) {
                console.log('✅ Email sent!');
            } else {
                console.error('❌ Email error:', data.error);
            }
        } catch (err) {
            console.error('❌ Failed:', err);
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

            const newPosition = 21;
            await sendConfirmationEmail(email, subdomain, newPosition);

            setSuccess(true);
            setWaitlistCount(newPosition);
        } catch (err) {
            console.error('Submission error:', err);
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    // ============================================
    // SUCCESS VIEW
    // ============================================
    if (success) {
        return (
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop with massive spotlight */}
                <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.15) 0%, transparent 55%)",
                    }}
                />

                <div
                    className="relative w-full max-w-md glass-strong rounded-[28px] p-7 sm:p-9 text-center fade-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Success icon with pulse */}
                    <div className="relative w-20 h-20 mx-auto mb-5">
                        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
                        <div className="relative w-20 h-20 rounded-full
                            bg-gradient-to-br from-emerald-400 to-emerald-600
                            flex items-center justify-center shadow-lg shadow-emerald-500/50">
                            <Check className="w-9 h-9 text-white" strokeWidth={3} />
                        </div>
                    </div>

                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--fg)] tracking-tight">
                        You're in! 🎉
                    </h2>

                    <p className="text-sm text-[var(--fg-muted)] mt-2">
                        Your spot is reserved
                    </p>

                    {/* Position badge */}
                    <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                        bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]
                        shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-white font-bold text-lg tabular-nums">
                            Position #{waitlistCount}
                        </span>
                    </div>

                    {/* Subdomain card */}
                    <div className="mt-6 p-4 rounded-2xl
                        bg-white/[0.03] border border-[var(--glass-border-soft)]">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-1.5 font-semibold">
                            Your Subdomain
                        </p>
                        <p className="text-[var(--color-accent)] font-bold text-base sm:text-lg break-all">
                            {subdomain}.mk-edit.com
                        </p>
                    </div>

                    <p className="text-xs text-[var(--fg-subtle)] mt-5 leading-relaxed">
                        We sent a confirmation to your email.
                        <br />
                        We'll notify you the moment we launch.
                    </p>

                    {gifPerk && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-full
                            bg-amber-500/10 border border-amber-500/20">
                            <Gift className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-medium text-amber-300">
                                GIF Perk Activated
                            </span>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="mt-7 w-full py-3.5 rounded-full
                            glass-soft glass-hover
                            text-sm font-semibold text-[var(--fg)]"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // ============================================
    // FORM VIEW
    // ============================================
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

            {/* Massive spotlight behind card */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(120,110,255,0.18) 0%, rgba(255,110,200,0.08) 30%, transparent 60%)",
                }}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-md glass-strong rounded-[28px] overflow-hidden
                    max-h-[92vh] overflow-y-auto fade-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top highlight line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                    }}
                />

                {/* Close button — fixed top right */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20
        w-9 h-9 rounded-full
        bg-white/[0.06] backdrop-blur-xl
        border border-[var(--glass-border-soft)]
        flex items-center justify-center
        text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/[0.1]
        transition-all duration-200"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* ============ HEADER ============ */}
                <div className="pt-8 px-7 sm:px-8 text-center">

                    {/* Icon */}
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <span className="absolute inset-0 rounded-2xl bg-[var(--color-accent)]/20 blur-xl" />
                        <div className="relative w-16 h-16 rounded-2xl
                            bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)]
                            flex items-center justify-center shadow-lg shadow-purple-500/40">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                    </div>

                    <h2 className="font-display font-extrabold tracking-tight
                        text-xl sm:text-2xl text-[var(--fg)] leading-tight">
                        Claim Your Free Subdomain
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1.5">
                        Reserve your portfolio URL — takes 20 seconds
                    </p>
                </div>

                {/* ============ PERK BANNER ============ */}
                <div className="mx-7 sm:mx-8 mt-6 p-4 rounded-2xl
                    bg-gradient-to-br from-amber-500/10 to-orange-500/5
                    border border-amber-500/20">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Gift className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--fg)] leading-tight">
                                Auto-Storyboard GIF Perk
                            </p>
                            <p className="text-[11px] text-[var(--fg-subtle)] mt-0.5">
                                $29 value — Free for first 100 members
                            </p>
                            <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={gifPerk}
                                    onChange={(e) => setGifPerk(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-amber-500 rounded"
                                />
                                <span className="text-xs text-[var(--fg-muted)]">
                                    Yes, I want this perk
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ============ FORM ============ */}
                <form onSubmit={handleSubmit} className="p-7 sm:p-8 pt-5 space-y-4">

                    {/* Email */}
                    <div>
                        <label className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider block mb-2">
                            Email
                        </label>
                        <input
                            id="modal-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl
                                bg-white/[0.04] border border-[var(--glass-border-soft)]
                                text-[var(--fg)] placeholder-[var(--fg-subtle)]
                                focus:outline-none focus:border-[var(--color-accent)] focus:bg-white/[0.06]
                                transition-all text-sm"
                            required
                        />
                    </div>

                    {/* Subdomain */}
                    <div>
                        <label className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider block mb-2">
                            Subdomain
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={subdomain}
                                onChange={(e) =>
                                    setSubdomain(
                                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                                    )
                                }
                                placeholder="yourname"
                                className="flex-1 min-w-0 px-4 py-3 rounded-xl
                                    bg-white/[0.04] border border-[var(--glass-border-soft)]
                                    text-[var(--fg)] placeholder-[var(--fg-subtle)]
                                    focus:outline-none focus:border-[var(--color-accent)] focus:bg-white/[0.06]
                                    transition-all text-sm"
                                required
                                minLength={3}
                                maxLength={30}
                            />
                            <span className="text-[10px] sm:text-xs text-[var(--fg-subtle)] whitespace-nowrap font-mono">
                                .mk-edit.com
                            </span>
                        </div>

                        {/* Availability */}
                        {subdomain.length >= 3 && (
                            <div className="mt-2 text-xs">
                                {isChecking ? (
                                    <span className="text-[var(--fg-subtle)] flex items-center gap-1.5">
                                        <span className="w-3 h-3 border-2 border-[var(--fg-subtle)]/30 border-t-[var(--fg-subtle)] rounded-full animate-spin" />
                                        Checking...
                                    </span>
                                ) : isAvailable === true ? (
                                    <span className="text-emerald-400 flex items-center gap-1.5">
                                        <Check className="w-3.5 h-3.5" />
                                        <span className="font-medium">{subdomain}</span> is available
                                    </span>
                                ) : isAvailable === false ? (
                                    <span className="text-red-400 flex items-center gap-1.5">
                                        <X className="w-3.5 h-3.5" />
                                        Taken. Try another.
                                    </span>
                                ) : null}
                            </div>
                        )}
                        <p className="text-[10px] text-[var(--fg-subtle)] mt-1.5">
                            Lowercase letters & numbers only
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20
                            text-red-400 text-xs leading-relaxed">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !isAvailable}
                        className="group w-full py-3.5 rounded-full
                            bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]
                            hover:shadow-lg hover:shadow-purple-500/40
                            text-white font-semibold text-sm
                            transition-all duration-300
                            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
                            flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Reserving...
                            </>
                        ) : (
                            <>
                                Reserve My Subdomain
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-[var(--fg-subtle)] text-center leading-relaxed">
                        🔒 We'll email you when your portfolio is ready.
                    </p>
                    <p className="text-[10px] text-[var(--fg-subtle)] text-center mt-3">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-[var(--color-accent)] hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}