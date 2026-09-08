// src/components/landing/LandingPurpose.jsx
import { useEffect, useRef } from 'react';

export default function LandingPurpose() {
    const sectionRef = useRef(null);

    // ✅ IntersectionObserver for scroll animation
    useEffect(() => {
        const checkInitialVisibility = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('animate-in');
                }
            });
        };

        const timer = setTimeout(() => {
            checkInitialVisibility();
        }, 200);

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

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

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

    return (
        <section
            id="purpose-section"
            ref={sectionRef}
            className="py-16 sm:py-20 px-4 bg-[#0F0F0F] border-t border-white/5"
        >
            <div className="max-w-4xl mx-auto">
                <div className="backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border transition-all duration-500 bg-white/5 border-white/10">
                    <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            Why I'm building this
                        </h2>
                    </div>

                    <div className="space-y-4 mt-4 mb-6 sm:mt-6">
                        <p className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 text-sm sm:text-base md:text-lg leading-relaxed text-gray-300">
                            As a video editor myself, I've struggled with sharing my work professionally and getting clear feedback from clients. I built this platform to solve those exact problems—for myself and for other editors.
                        </p>
                        <p className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 text-sm sm:text-base md:text-lg leading-relaxed text-gray-300">
                            I wanted a place where editors could have their own portfolio website, clients could leave timestamp-based feedback, and everything would be in one simple, beautiful interface.
                        </p>
                        <p className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 text-sm sm:text-base md:text-lg leading-relaxed text-gray-300">
                            Whether you're just starting out or you're a seasoned pro, this platform is designed to help you look professional, get better feedback, and grow your freelance business.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}