// src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
    const elementRef = useRef(null);

    useEffect(() => {
        // ✅ CHECK INITIAL VISIBILITY ON LOAD
        const checkInitialVisibility = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('animate-in');
                }
            });
        };

        // ✅ Run after a small delay to ensure DOM is ready
        const timer = setTimeout(checkInitialVisibility, 150);

        // ✅ Setup IntersectionObserver for scroll
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // ✅ Observe all elements with animate-on-scroll
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

        // ✅ Also check on resize (for responsive changes)
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
            elements.forEach((el) => observer.unobserve(el));
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return elementRef;
}