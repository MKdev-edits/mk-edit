// src/components/landing/LandingFeatures.jsx
import { useState, useEffect, useRef } from 'react';

export default function LandingFeatures() {
    const [expandedFeature, setExpandedFeature] = useState(null);
    const sectionRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    const features = [
        {
            id: 'subdomain',
            icon: 'fa-globe',
            title: 'Your Own Subdomain',
            color: 'from-blue-500 to-cyan-400',
            description: 'Get a professional portfolio at yourname.yourapp.pages.dev. No coding. No hosting. Just your work.',
            fullDescription: 'Every editor gets a unique subdomain (e.g., yourname.yourapp.pages.dev). Customize it with your branding, showcase your best work, and share it with clients. No coding required—just upload and go. Your portfolio is live in seconds.'
        },
        {
            id: 'timestamp',
            icon: 'fa-clock',
            title: 'Timestamped Client Feedback',
            color: 'from-purple-500 to-pink-400',
            description: 'Clients click on your video, drop a pin, and leave comments exactly where they want changes. No more vague feedback.',
            fullDescription: 'With timestamp feedback, clients click on a video at the exact time they want to comment. Editors see exactly what needs to be fixed, reducing back-and-forth and making revisions faster than ever. Clear, precise, and professional.'
        },
        {
            id: 'review-room',
            icon: 'fa-video',
            title: 'Client Review Room',
            color: 'from-emerald-500 to-teal-400',
            description: 'Send clients a clean, branded page where they can watch, comment, and approve your work. Looks like a high-end agency.',
            fullDescription: 'Your Client Review Room is a branded, private page where clients can watch your videos, leave timestamped feedback, and approve your work. It looks professional, builds trust, and makes you stand out from other editors.'
        },
        {
            id: 'portfolio',
            icon: 'fa-play-circle',
            title: 'Portfolio',
            color: 'from-emerald-500 to-teal-400',
            description: 'Create a stunning portfolio with your best work. Organize videos by platform, showcase your editing style, and attract new clients with a professional gallery.',
            fullDescription: 'Your portfolio is fully customizable—showcase YouTube edits, TikTok transitions, corporate projects, and more. Clients can browse your work in a clean, modern layout that highlights your skills.'
        },
        {
            id: 'dashboard',
            icon: 'fa-chart-pie',
            title: 'Dashboard',
            color: 'from-orange-500 to-amber-400',
            description: 'Get full control of your content with a powerful dashboard. Manage videos, track performance, and see client feedback all in one place.',
            fullDescription: 'Your dashboard gives you a complete overview of your portfolio. Track video views, see which projects clients are engaging with, and manage all your content from a single, intuitive interface.'
        },
        {
            id: 'library',
            icon: 'fa-folder-open',
            title: 'Library',
            color: 'from-rose-500 to-pink-400',
            description: 'Organize your videos in a beautiful library. Sort by platform, client, or project type. Find exactly what you need in seconds.',
            fullDescription: 'Your library is the central hub for all your videos. Organize by platform (YouTube, TikTok, Instagram), client projects, or custom collections. Search, filter, and find your best work instantly.'
        }
    ];

    // ✅ IntersectionObserver for scroll animation
    useEffect(() => {
        // First, check if elements are already in view on load
        const checkInitialVisibility = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('animate-in');
                }
            });
        };

        // Run after a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            checkInitialVisibility();
            setHasAnimated(true);
        }, 200);

        // Setup IntersectionObserver for scroll
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe all elements with animate-on-scroll
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

        // Also observe on resize
        const handleResize = () => {
            const el = document.querySelectorAll('.animate-on-scroll:not(.animate-in)');
            el.forEach((elem) => {
                const rect = elem.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    elem.classList.add('animate-in');
                }
            });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleExpand = (id) => {
        setExpandedFeature(expandedFeature === id ? null : id);
    };

    return (
        <section
            id="features-section"
            ref={sectionRef}
            className="py-16 sm:py-20 px-4 bg-[#0F0F0F] border-t border-white/5"
        >
            <div className="max-w-7xl mx-auto">
                {/* ✅ Heading - Always visible */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                        Everything you need to{' '}
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            stand out
                        </span>
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                        Built specifically for video editors who want to grow their freelance business.
                    </p>
                </div>

                {/* ✅ Features Grid - With animation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out"
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 border transition-all duration-300 hover:scale-[1.02] bg-white/5 border-white/10 hover:bg-white/10 h-full flex flex-col">
                                {/* Icon */}
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0`}>
                                    <i className={`fas ${feature.icon} text-white text-lg sm:text-2xl`}></i>
                                </div>

                                <h3 className="text-lg sm:text-xl font-bold text-white">
                                    {feature.title}
                                </h3>

                                <p className="mt-1 sm:mt-2 text-sm leading-relaxed text-gray-400 flex-1">
                                    {feature.description}
                                </p>

                                <button
                                    onClick={() => toggleExpand(feature.id)}
                                    className="mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors text-blue-400 hover:text-blue-300"
                                >
                                    {expandedFeature === feature.id ? 'Show less' : 'Show more'}
                                    <i className={`fas fa-chevron-${expandedFeature === feature.id ? 'up' : 'down'} text-[10px] transition-transform`}></i>
                                </button>

                                <div className={`overflow-hidden transition-all duration-500 ${expandedFeature === feature.id ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="p-3 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed bg-white/5 text-gray-300">
                                        {feature.fullDescription}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}