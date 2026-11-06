// src/components/landing/LandingPricing.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function LandingPricing() {
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

    const tiers = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            period: 'forever',
            tagline: 'Try it with one client.',
            features: [
                '2 review links per day',
                'Up to 5 comments per video',
                'Full review page experience',
            ],
            cta: 'Start free',
            to: '/signup',
            primary: false,
            badge: null,
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$5',
            period: 'per month',
            tagline: 'For editors working with clients.',
            features: [
                'Unlimited review links',
                'Unlimited comments',
                'No MK Edit branding',
                'Priority support',
            ],
            cta: 'Coming soon',
            to: null,
            primary: true,
            badge: 'Most popular',
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            price: '$15',
            period: 'one-time',
            tagline: 'Pay once. Use forever.',
            features: [
                'Everything in Pro',
                'Lifetime access',
                'All future updates',
            ],
            cta: 'Coming soon',
            to: null,
            primary: false,
            badge: null,
        },
    ];

    return (
        <section
            id="pricing-section"
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

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full glass-soft">
                        <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--fg-subtle)]">
                            Pricing
                        </span>
                    </div>

                    <h2 className="font-display font-extrabold tracking-tight
                        md:text-[clamp(1.8rem,3.2vw,2.5rem)] text-[clamp(1.6rem,3vw,2rem)] leading-[1.1] text-[var(--fg)]">
                        Start free.{' '}
                        <span className="text-gradient">Upgrade when you need more.</span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-[var(--fg-muted)] max-w-2xl mx-auto leading-relaxed">
                        No credit card to try. No client login. Ever.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                    {tiers.map((tier, index) => (
                        <div
                            key={tier.id}
                            className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out"
                            style={{ transitionDelay: `${index * 80}ms` }}
                        >
                            <div
                                className={`relative h-full flex flex-col rounded-[24px] p-6 sm:p-7 ${tier.primary
                                    ? 'glass-strong border-[var(--color-accent)]/40'
                                    : 'glass'
                                    }`}
                            >
                                {tier.badge && (
                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full
                                        bg-[var(--color-accent)] text-white text-[10px] font-semibold tracking-wide">
                                        {tier.badge}
                                    </div>
                                )}

                                <h3 className="font-display font-bold text-lg text-[var(--fg)]">
                                    {tier.name}
                                </h3>

                                <div className="mt-3 flex items-baseline gap-1.5">
                                    <span className="text-3xl sm:text-4xl font-bold text-[var(--fg)] tracking-tight">
                                        {tier.price}
                                    </span>
                                    <span className="text-xs text-[var(--fg-subtle)]">
                                        {tier.period}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-[var(--fg-muted)]">
                                    {tier.tagline}
                                </p>

                                <ul className="mt-6 space-y-3 flex-1">
                                    {tier.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5">
                                            <span className="w-4 h-4 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-2.5 h-2.5 text-[var(--color-accent)]" strokeWidth={3} />
                                            </span>
                                            <span className="text-sm text-[var(--fg-muted)] leading-snug">
                                                {f}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6">
                                    {tier.to ? (
                                        <Link
                                            to={tier.to}
                                            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all ${tier.primary
                                                ? 'bg-[var(--color-accent)] text-white hover:opacity-90'
                                                : 'glass-soft glass-hover text-[var(--fg)]'
                                                }`}
                                        >
                                            {tier.cta}
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold glass-soft text-[var(--fg-subtle)] cursor-not-allowed opacity-70"
                                        >
                                            {tier.cta}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-10 text-center text-xs text-[var(--fg-subtle)]">
                    Not sure yet?{' '}
                    <Link to="/review/demo" className="text-[var(--color-accent)] hover:underline font-medium">
                        Try the demo first →
                    </Link>
                </p>
            </div>
        </section>
    );
}