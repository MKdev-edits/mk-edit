// src/components/landing/LandingNavbar.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { id: 'home', label: 'Home', target: 'home' },
        { id: 'features', label: 'Features', target: 'features-section' },
        { id: 'demo', label: 'Demo', target: 'demo-section' },
        { id: 'purpose', label: 'Purpose', target: 'purpose-section' },
        { id: 'faq', label: 'FAQ', target: 'faq-section' },
    ];

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* ============ FULL-WIDTH NAVBAR ============ */}
            <header
                className={`fixed top-0 left-0 right-0 z-50
                    transition-all duration-300
                    ${isScrolled
                        ? 'bg-[#141419]/85 backdrop-blur-xl border-b border-[var(--glass-border-soft)]'
                        : 'bg-transparent border-b border-transparent'
                    }`}
            >
                <nav className="max-w-7xl mx-auto flex items-center justify-between
                    px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">

                    {/* LEFT — Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <span className="relative w-8 h-8 rounded-full overflow-hidden
    ring-1 ring-[var(--glass-border-soft)]">
                            <img
                                src="/images/Main-MK.JPG"
                                alt="MK"
                                className="w-full h-full object-cover"
                            />
                        </span>
                        <span className="font-display font-extrabold tracking-tight text-base leading-none text-[var(--fg)]">
                            MK<span className="text-[var(--color-accent)]">.</span>
                        </span>
                    </Link>

                    {/* MIDDLE — Desktop nav links */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <button
                                    onClick={() => scrollToSection(link.target)}
                                    className="relative px-3.5 py-2 text-sm font-medium
                                        text-[var(--fg-muted)] hover:text-[var(--fg)]
                                        transition-colors duration-200"
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* RIGHT — CTA + Mobile menu */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="hidden lg:inline-flex items-center gap-2
        glass-soft glass-hover
        px-4 py-2 rounded-full
        text-sm font-semibold text-[var(--fg)]"
                        >
                            Sign In
                        </Link>

                        <button
                            aria-label="Menu"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden glass-soft w-9 h-9 rounded-full flex items-center justify-center
                                text-[var(--fg)]"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* ============ MOBILE DRAWER — slides from right, full height, half width ============ */}
            <div
                aria-hidden={!isMobileMenuOpen}
                className={`fixed inset-0 z-[60] lg:hidden
                    transition-opacity duration-200
                    ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                {/* Backdrop */}
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute inset-0 bg-black/70"
                />

                {/* Panel — full height, half width, slides from right */}
                <aside
                    className={`absolute right-0 top-0 bottom-0
                        w-1/2 min-w-[240px] max-w-[320px]
                        bg-black/95 backdrop-blur-2xl
                        border-l border-[var(--glass-border-soft)]
                        p-6 flex flex-col
                        transition-transform duration-300 ease-out
                        will-change-transform
                        ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-display font-extrabold text-lg text-[var(--fg)]">
                            MK<span className="text-[var(--color-accent)]">.</span>
                        </span>
                        <button
                            aria-label="Close menu"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="glass-soft w-9 h-9 rounded-full flex items-center justify-center
                                text-[var(--fg)]"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <ul className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <button
                                    onClick={() => scrollToSection(link.target)}
                                    className="w-full text-left px-4 py-3 rounded-2xl
                                        text-[var(--fg)] font-medium
                                        hover:bg-[var(--glass-bg)]
                                        transition-colors duration-150"
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto pt-6 border-t border-[var(--glass-border-soft)]">
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full inline-flex items-center justify-center gap-2
        glass-soft glass-hover
        px-4 py-3 rounded-2xl
        text-sm font-semibold text-[var(--fg)]"
                        >
                            Sign In
                        </Link>
                    </div>
                </aside>
            </div>
        </>
    );
}