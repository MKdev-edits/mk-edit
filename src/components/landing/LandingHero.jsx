// src/components/landing/LandingHero.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ChevronDown, MapPin, Volume2, Maximize, Pause } from 'lucide-react';

export default function LandingHero() {
    const [progress, setProgress] = useState(33);
    const [pinActive, setPinActive] = useState(true);

    useEffect(() => {
        const t = setInterval(() => {
            setProgress((p) => (p >= 100 ? 0 : p + 0.4));
        }, 100);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setPinActive((v) => !v), 1600);
        return () => clearInterval(t);
    }, []);

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden pt-24 sm:pt-28 pb-16 bg-[#141419]"
        >
            {/* Background spotlights */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[#0A0A0F]" />

                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[-20%] w-[1000px] h-[900px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.01) 50%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[10%] w-[700px] h-[700px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 65%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="absolute right-[-15%] bottom-[-25%] w-[700px] h-[700px] rounded-full opacity-70"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)",
                        filter: "blur(90px)",
                    }}
                />

                <div className="landing-grid absolute inset-0 opacity-[0.35]" />

                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(10,10,15,0.7) 100%)",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">

                    {/* LEFT: Text */}
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-7 rounded-full glass-soft">
                            <span className="relative flex items-center justify-center w-2 h-2">
                                <span className="absolute inline-flex w-2 h-2 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                            </span>
                            <span className="text-xs font-medium tracking-wide text-[var(--fg-muted)]">
                                Early Access — Now Open
                            </span>
                        </div>

                        <h1 className="font-display font-bold tracking-tight
                            text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.08] text-[var(--fg)]">
                            Stop Sending MP4s.
                            <br />
                            <span className="text-gradient">
                                Start Sending a Client Review Room.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base md:text-[17px] text-[var(--fg-muted)] leading-relaxed">
                            One link. Your client watches. They leave comments on exact timestamps.
                            You see it all on your dashboard. No login for your client. Ever.
                        </p>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Link
                                to="/review/demo"
                                className="group glass-strong glass-hover
                                    inline-flex items-center justify-center gap-2.5
                                    px-6 py-3.5 rounded-full
                                    font-semibold text-[var(--fg)]
                                    text-sm sm:text-base whitespace-nowrap"
                            >
                                <span>Try the demo</span>
                                <span className="w-6 h-6 rounded-full bg-[var(--color-accent)]
                                    flex items-center justify-center
                                    transition-transform duration-200 group-hover:translate-x-0.5">
                                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                                </span>
                            </Link>

                            <Link
                                to="/signup"
                                className="group glass-soft glass-hover
                                    inline-flex items-center justify-center gap-2
                                    px-5 py-3.5 rounded-full
                                    font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]
                                    text-sm sm:text-base whitespace-nowrap"
                            >
                                <span>Sign up free</span>
                            </Link>
                        </div>

                        <p className="mt-4 text-xs text-[var(--fg-subtle)]">
                            No credit card. No client login. Free to start.
                        </p>
                    </div>

                    {/* RIGHT: Video mockup */}
                    <div className="w-full max-w-lg lg:max-w-none">
                        <div className="glass rounded-[24px] overflow-hidden shadow-2xl shadow-black/50">
                            <div className="relative aspect-video bg-gradient-to-br from-[#0a0a12] to-[#050508] overflow-hidden">
                                <div
                                    className="absolute inset-0 opacity-[0.35]"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                                        backgroundSize: "32px 32px",
                                    }}
                                />

                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.14), transparent 55%), radial-gradient(circle at 70% 70%, rgba(255,110,200,0.10), transparent 55%)",
                                    }}
                                />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full
                                        glass-strong flex items-center justify-center
                                        transition-transform duration-300 group-hover:scale-105">
                                        <span className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-20" />
                                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white translate-x-0.5" fill="white" />
                                    </button>
                                </div>

                                <div
                                    className="absolute transition-all duration-700 ease-out"
                                    style={{
                                        left: `${42 + (pinActive ? 0.5 : 0)}%`,
                                        top: '48%',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <div className="relative">
                                        <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
                                        <div className="relative w-8 h-8 rounded-full bg-red-500 border-2 border-white
                                            flex items-center justify-center shadow-lg shadow-red-500/50">
                                            <MapPin className="w-3.5 h-3.5 text-white" fill="white" />
                                        </div>
                                        <div className="absolute left-1/2 -translate-x-1/2 -top-12 whitespace-nowrap
                                            px-3 py-1.5 rounded-lg glass-strong
                                            text-[10px] font-semibold text-white
                                            shadow-xl">
                                            <span className="text-red-400">●</span> 00:42
                                            <span className="ml-1.5 text-[var(--fg-subtle)]">Cut here</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                    <div className="glass-soft px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-medium text-[var(--fg-muted)] tracking-wide">
                                            LIVE REVIEW
                                        </span>
                                    </div>
                                    <div className="glass-soft px-2.5 py-1 rounded-full">
                                        <span className="text-[10px] font-medium text-[var(--fg-subtle)]">
                                            4K
                                        </span>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8
                                    bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="relative h-1 bg-white/15 rounded-full overflow-hidden mb-3">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-white rounded-full transition-[width] duration-100 ease-linear"
                                            style={{ width: `${progress}%` }}
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 border border-white transition-[left] duration-100 ease-linear"
                                            style={{ left: `calc(${progress}% - 5px)` }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Pause className="w-3.5 h-3.5 text-white" fill="white" />
                                        <Volume2 className="w-3.5 h-3.5 text-white/70" />
                                        <span className="text-[10px] font-mono text-white/60 tracking-tight">
                                            1:23 / 4:56
                                        </span>
                                        <div className="flex-1" />
                                        <Maximize className="w-3.5 h-3.5 text-white/70" />
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-3 flex items-center justify-between border-t border-[var(--glass-border-soft)]">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)]
                                        flex items-center justify-center">
                                        <span className="text-white text-[8px] font-bold">✓</span>
                                    </div>
                                    <span className="text-[11px] text-[var(--fg-subtle)]">
                                        Client Review Room • Live Feedback
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-[var(--fg-subtle)] hidden sm:block">
                                    mk-edit.com
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
                <button
                    onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="glass-soft w-9 h-9 rounded-full flex items-center justify-center
                        text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}