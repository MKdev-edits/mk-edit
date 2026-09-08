// src/components/landing/LandingLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

export default function LandingLayout() {
    // ✅ FORCE DARK MODE - Always true
    const [isDark] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className={`min-h-screen dark`}>
            <div className={`min-h-screen transition-colors duration-500 bg-[#0F0F0F]`}>
                <LandingNavbar
                    isDark={true}
                    toggleTheme={() => { }} // No toggle needed
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <main>
                    <Outlet />
                </main>
                <LandingFooter isDark={true} />
            </div>
        </div>
    );
}