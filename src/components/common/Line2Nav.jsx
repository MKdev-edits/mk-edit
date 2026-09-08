// src/components/common/Line2Nav.jsx - SIMPLIFIED
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Line2Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [availablePlatforms, setAvailablePlatforms] = useState([]);

    useEffect(() => {
        fetchAvailablePlatforms();
    }, []);

    const fetchAvailablePlatforms = async () => {
        try {
            const { data } = await supabase
                .from('videos')
                .select('platform')
                .not('platform', 'is', null)
                .not('platform', 'eq', 'other');
            if (data) {
                const unique = [...new Set(data.map(v => v.platform).filter(p => p))];
                setAvailablePlatforms(unique);
            }
        } catch (err) {
            console.error('Error fetching platforms:', err);
        }
    };

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p === 'youtube') return 'fab fa-youtube';
        if (p === 'tiktok') return 'fab fa-tiktok';
        if (p === 'twitter' || p === 'x') return 'fab fa-twitter';
        if (p === 'instagram') return 'fab fa-instagram';
        if (p === 'discord') return 'fab fa-discord';
        if (p === 'facebook') return 'fab fa-facebook';
        if (p === 'telegram') return 'fab fa-telegram';
        return 'fas fa-link';
    };

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const offset = 120;
                    const elPos = element.getBoundingClientRect().top;
                    window.scrollTo({ top: elPos + window.pageYOffset - offset, behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                const offset = 120;
                const elPos = element.getBoundingClientRect().top;
                window.scrollTo({ top: elPos + window.pageYOffset - offset, behavior: 'smooth' });
            }
        }
    };

    const navigateToPlatform = (platform) => {
        if (location.pathname !== '/') {
            navigate(`/?platform=${platform}`);
        } else {
            const element = document.getElementById(`${platform}-section`);
            if (element) {
                const offset = 120;
                const elPos = element.getBoundingClientRect().top;
                window.scrollTo({ top: elPos + window.pageYOffset - offset, behavior: 'smooth' });
            }
        }
    };

    const staticNavLinks = [
        { id: 'hero-section', icon: 'fas fa-home', label: 'Home' },
        { id: 'top-rated-section', icon: 'fas fa-star', label: 'Top Rated' },
        { id: 'vip-section', icon: 'fas fa-crown', label: 'VIP' },
        { id: 'all-videos-section', icon: 'fas fa-video', label: 'All Videos' },
        { id: 'about-section', icon: 'fas fa-user', label: 'About' },
    ];

    const platformNavLinks = availablePlatforms.map(platform => ({
        id: `${platform}-section`,
        icon: getPlatformIcon(platform),
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
        platform: platform
    }));

    const allNavLinks = [...staticNavLinks, ...platformNavLinks];
    const isDashboard = location.pathname.startsWith('/dashboard');

    if (isDashboard) return null;

    return (
        <div className="flex overflow-x-auto scrollbar-hide pt-1 py-1 md:pt-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex md:gap-3 gap-2 min-w-max">
                {allNavLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => {
                            if (link.platform) navigateToPlatform(link.platform);
                            else scrollToSection(link.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all whitespace-nowrap text-lg"
                    >
                        {/*<i className={`${link.icon} text-xs sm:text-sm`}></i>*/}
                        <span className="text-[12px] md:text-[13px] font-medium">{link.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}