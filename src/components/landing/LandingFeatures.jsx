// src/components/landing/LandingFeatures.jsx
import { useEffect } from 'react';
import { Clock, Video, BarChart3 } from 'lucide-react';

export default function LandingFeatures() {
    const features = [
        {
            id: 'timestamp',
            Icon: Clock,
            title: 'Timestamped Feedback',
            accent: 'oklch(0.72 0.20 330)',
            description: "Clients comment on the exact second they want changed. No more 'fix the audio around 1:23.'",
        },
        {
            id: 'review-room',
            Icon: Video,
            title: 'Client Review Room',
            accent: 'oklch(0.72 0.19 150)',
            description: 'Send a link. Client opens it. No signup, no login, no app download. They watch, they comment, they\'re done.',
        },
        {
            id: 'dashboard',
            Icon: BarChart3,
            title: 'Editor Dashboard',
            accent: 'oklch(0.68 0.21 275)',
            description: 'Every comment, every project, one place. Click a comment, jump to that moment in the video.',
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('animate-in');
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="features-section"
            className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#141419] overflow-hidden"
        >
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[500px] rounded-full opacity-50"
                    style={{
                        background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 65%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-14 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full glass-soft">
                        <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--fg-subtle)]">
                            Features
                        </span>
                    </div>

                    <h2 className="font-display font-extrabold tracking-tight
                        md:text-[clamp(1.8rem,3.2vw,2.5rem)] text-[clamp(1.6rem,3vw,2rem)] leading-[1.1] text-[var(--fg)]">
                        Everything you need to{' '}
                        <span className="text-gradient">get feedback fast</span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-[var(--fg-muted)] max-w-2xl mx-auto leading-relaxed">
                        Built for solo editors who are tired of chasing clients for clear feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                    {features.map((feature, index) => {
                        const { Icon } = feature;
                        return (
                            <div
                                key={feature.id}
                                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out"
                                style={{ transitionDelay: `${index * 80}ms` }}
                            >
                                <div className="glass glass-hover rounded-[24px] p-6 sm:p-7 h-full flex flex-col group">
                                    <div
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                                        style={{
                                            background: `color-mix(in oklab, ${feature.accent} 18%, transparent)`,
                                            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${feature.accent} 35%, transparent)`,
                                        }}
                                    >
                                        <Icon
                                            className="w-5 h-5 sm:w-6 sm:h-6"
                                            style={{ color: feature.accent }}
                                        />
                                    </div>

                                    <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--fg)] leading-tight">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)] flex-1">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}