// src/components/landing/LandingPerk.jsx
import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LandingPerk({ onOpenModal }) {
    const [timeLeft, setTimeLeft] = useState({ days: 17, hours: 0, minutes: 0, seconds: 0, expired: false });
    const [loading, setLoading] = useState(true);

    const fetchTimer = async () => {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'launch_date')
                .maybeSingle();

            if (data?.value) {
                const launchDate = new Date(data.value.replace(' ', 'T'));
                const now = new Date();
                const diff = launchDate - now;

                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeLeft({ days, hours, minutes, seconds, expired: false });
                    setLoading(false);
                    return;
                }
            }

            const fallback = new Date();
            fallback.setDate(fallback.getDate() + 17);
            const diff = fallback - new Date();
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                expired: false
            });
        } catch (error) {
            console.error('Timer error:', error);
            const fallback = new Date();
            fallback.setDate(fallback.getDate() + 17);
            const diff = fallback - new Date();
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                expired: false
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTimer();

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.expired) return prev;

                const newSeconds = prev.seconds - 1;
                if (newSeconds < 0) {
                    const newMinutes = prev.minutes - 1;
                    if (newMinutes < 0) {
                        const newHours = prev.hours - 1;
                        if (newHours < 0) {
                            const newDays = prev.days - 1;
                            if (newDays < 0) {
                                return { ...prev, expired: true };
                            }
                            return { ...prev, days: newDays, hours: 23, minutes: 59, seconds: 59 };
                        }
                        return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
                    }
                    return { ...prev, minutes: newMinutes, seconds: 59 };
                }
                return { ...prev, seconds: newSeconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-10 h-10 border-4 border-white/10 border-t-white/60 rounded-full animate-spin mx-auto" />
                </div>
            </section>
        );
    }

    const isExpired =
        timeLeft.expired ||
        (timeLeft.days === 0 &&
            timeLeft.hours === 0 &&
            timeLeft.minutes === 0 &&
            timeLeft.seconds === 0);

    return (
        <section
            id="perk-section"
            className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden"
        >
            {/* ============ STRONG SPOTLIGHT BEHIND THE CARD ============ */}
            <div className="pointer-events-none absolute inset-0 -z-10">

                {/* Massive white spotlight centered behind card */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
                    style={{
                        background:
                            isExpired
                                ? "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 65%)"
                                : "radial-gradient(circle, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.08) 30%, transparent 65%)",
                        filter: "blur(60px)",
                    }}
                />

                {/* Warm amber glow — urgency */}
                {!isExpired && (
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,180,80,0.10) 0%, transparent 65%)",
                            filter: "blur(80px)",
                        }}
                    />
                )}

                {/* Faint grid to add texture */}
                <div className="landing-grid absolute inset-0 opacity-[0.25]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Card — glows hard */}
                <div className={`glass-strong rounded-[28px] p-7 sm:p-10 md:p-14 relative overflow-hidden
                    ${!isExpired ? 'glow-accent' : ''}`}
                >

                    {/* Inner top highlight */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                        }}
                    />

                    {/* ============ TOP BADGE ============ */}
                    <div className="text-center mb-6">
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                                ${isExpired
                                    ? 'bg-white/[0.04] border border-white/10'
                                    : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                                }`}
                        >
                            {isExpired ? (
                                <span className="text-[11px] font-semibold tracking-wider text-[var(--fg-subtle)] uppercase">
                                    ⏰ Offer Expired
                                </span>
                            ) : (
                                <>
                                    <span className="relative flex items-center justify-center w-1.5 h-1.5">
                                        <span className="absolute inline-flex w-1.5 h-1.5 rounded-full bg-amber-400 opacity-75 animate-ping" />
                                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    </span>
                                    <span className="text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
                                        Limited Time
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ============ HEADLINE ============ */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        <h2 className="font-display font-extrabold tracking-tight
                            text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.1] text-[var(--fg)]">
                            Launch Perk:{' '}
                            <span className={isExpired ? 'text-[var(--fg-subtle)]' : 'text-gradient'}>
                                Lifetime Access
                            </span>
                        </h2>
                    </div>

                    {/* ============ DESCRIPTION ============ */}
                    <div className="mt-5 text-center max-w-2xl mx-auto">
                        <p className="text-[15px] sm:text-base text-[var(--fg-muted)] leading-relaxed">
                            {isExpired
                                ? 'This offer has expired. But you can still join the waitlist!'
                                : 'Everyone on the waitlist today gets LIFETIME access to our Auto-Storyboard GIF Generator.'
                            }
                        </p>
                        {!isExpired && (
                            <>
                                <p className="text-sm text-[var(--fg-subtle)] mt-3 leading-relaxed">
                                    We automatically generate a{' '}
                                    <span className="text-[var(--fg)] font-medium">12-frame GIF storyboard</span>{' '}
                                    of your entire video. Clients can skim your whole project in 2 seconds.
                                </p>
                                <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                                    bg-white/[0.04] border border-[var(--glass-border-soft)]">
                                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs font-medium text-[var(--fg-muted)]">
                                        $29 value — Free for first 100 members
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ============ TIMER ============ */}
                    {!isExpired && (
                        <div className="mt-8 sm:mt-10 flex justify-center gap-2.5 sm:gap-3.5">
                            {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                                <div key={unit} className="text-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl
                                        bg-white/[0.04] border border-[var(--glass-border-soft)]
                                        backdrop-blur-xl flex items-center justify-center
                                        shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                                        <span className="font-mono font-bold text-[var(--fg)] text-2xl sm:text-3xl tabular-nums">
                                            {String(timeLeft[unit]).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--fg-subtle)] mt-2 font-medium">
                                        {unit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ============ CTA ============ */}
                    <div className="mt-9 sm:mt-10 text-center">
                        <button
                            onClick={onOpenModal}
                            className={`group inline-flex items-center gap-2.5
                                px-7 sm:px-9 py-3.5 sm:py-4 rounded-full
                                font-semibold text-[var(--fg)]
                                text-sm sm:text-base
                                transition-all duration-300
                                ${isExpired
                                    ? 'glass-strong glass-hover'
                                    : 'glow-accent glass-strong hover:scale-[1.02]'
                                }`}
                        >
                            <span>{isExpired ? 'Join Waitlist' : 'Claim My Perk'}</span>
                            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center
                                transition-transform duration-200 group-hover:translate-x-0.5">
                                <ArrowRight className="w-3.5 h-3.5 text-white" />
                            </span>
                        </button>

                        {!isExpired && (
                            <p className="mt-4 text-xs text-[var(--fg-subtle)]">
                                ⏳ Offer ends in{' '}
                                <span className="text-[var(--fg-muted)] font-medium tabular-nums">
                                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}