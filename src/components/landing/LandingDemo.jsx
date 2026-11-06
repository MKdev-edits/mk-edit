// src/components/landing/LandingDemo.jsx
import { Link } from 'react-router-dom';
import { Play, MousePointerClick, MessageSquare, ArrowRight } from 'lucide-react';

export default function LandingDemo() {
    return (
        <section
            id="demo-section"
            className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#141419] overflow-hidden"
        >
            {/* Spotlight */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[500px] rounded-full opacity-50"
                    style={{
                        background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-10 fade-up">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full glass-soft">
                        <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--fg-subtle)]">
                            Try it now
                        </span>
                    </div>
                    <h2 className="font-display font-extrabold tracking-tight
                        text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.1] text-[var(--fg)]">
                        See what your client sees.{' '}
                        <span className="text-gradient">No signup needed.</span>
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-[var(--fg-muted)] max-w-2xl mx-auto">
                        Open the demo review room. Play the video, add a comment, click any comment to jump the video to that moment. This is exactly what your clients will use.
                    </p>
                </div>

                {/* Clickable preview card */}
                <Link
                    to="/review/demo"
                    className="group block glass rounded-[24px] overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                >
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                        {/* Gradient background mimicking a player */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] to-[#050508]" />
                        <div
                            className="absolute inset-0 opacity-40"
                            style={{
                                background:
                                    "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.2), transparent 55%), radial-gradient(circle at 70% 70%, rgba(255,110,200,0.12), transparent 55%)",
                            }}
                        />

                        {/* Faint grid */}
                        <div
                            className="absolute inset-0 opacity-[0.3]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                                backgroundSize: "32px 32px",
                            }}
                        />

                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full glass-strong flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                <Play className="w-7 h-7 text-white translate-x-0.5" fill="white" />
                            </div>
                            <p className="text-white font-semibold text-lg sm:text-xl mb-1">Open Live Demo</p>
                            <p className="text-[var(--fg-subtle)] text-xs sm:text-sm">
                                Interactive · 30 seconds · No account
                            </p>
                        </div>

                        {/* Fake timestamp pin */}
                        <div className="absolute left-[35%] top-[45%] hidden sm:block">
                            <div className="relative">
                                <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
                                <div className="relative w-7 h-7 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-lg shadow-red-500/50">
                                    <MousePointerClick className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Fake comment bubble */}
                        <div className="absolute right-6 bottom-6 hidden md:block glass-strong px-3 py-2 rounded-xl max-w-[240px]">
                            <div className="flex items-start gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-supabase-green mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] text-[var(--fg-subtle)]">Sarah · 0:12</p>
                                    <p className="text-xs text-white mt-0.5">Audio dips slightly here</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--glass-border-soft)]">
                        <span className="text-sm text-[var(--fg-muted)]">
                            Live interactive review room
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]">
                            Open demo
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </Link>
            </div>
        </section>
    );
}