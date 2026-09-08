// src/components/landing/LandingNavbar.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LandingNavbar({ onOpenModal }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // ✅ Track scroll for glass effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'Home', target: 'home' },
        { id: 'features', label: 'Features', target: 'features-section' },
        { id: 'purpose', label: 'Purpose', target: 'purpose-section' },
        { id: 'faq', label: 'FAQ', target: 'faq-section' },
    ];

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-black/95 backdrop-blur-xl border-b border-white/10'
                : 'bg-black/60 backdrop-blur-md border-b border-white/5'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* ✅ Logo - Left */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xl md:text-2xl font-bold text-white">MK</span>
                        </Link>

                        {/* ✅ Desktop Nav Links - Center */}
                        <div className="hidden md:flex items-center gap-1 lg:gap-2 absolute left-1/2 -translate-x-1/2">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.target)}
                                    className="px-3 py-2 text-sm font-medium rounded-lg transition-all text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        {/* ✅ Desktop Right: CTA Button */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={onOpenModal}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2"
                            >
                                <span>🚀</span>
                                Claim Your Free Subdomain
                            </button>
                        </div>

                        {/* ✅ Mobile: Music Player + Hamburger */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                            >
                                <i className={`fas fa-${isMobileMenuOpen ? 'times' : 'bars'} text-xl text-white`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ✅ Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed top-16 left-0 right-0 z-40 md:hidden animate-slide-down">
                    <div className="bg-black/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
                        <div className="px-4 py-6 space-y-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.target)}
                                    className="block w-full text-left text-base font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <div className="pt-4 mt-2 border-t border-white/10">
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        onOpenModal();
                                    }}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2"
                                >
                                    <span>🚀</span>
                                    Claim Your Free Subdomain
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}