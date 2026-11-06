// src/components/common/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { supabase } from '../../lib/supabase';

export default function Sidebar({ isOpen, onClose, isDesktop, onToggle }) {
    const { user, profile, signOut } = useAuth();
    const { viewer } = useViewerAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isEditor = !!user && !!profile;
    const isViewer = !!viewer;
    const isLoggedIn = isEditor || isViewer;

    const [platforms, setPlatforms] = useState([]);

    // ✅ Fetch platforms
    useEffect(() => {
        fetchPlatforms();
    }, []);

    const fetchPlatforms = async () => {
        try {
            const { data } = await supabase
                .from('videos')
                .select('platform')
                .not('platform', 'is', null)
                .not('platform', 'eq', 'other');

            if (data) {
                const unique = [...new Set(data.map(v => v.platform).filter(p => p))];
                setPlatforms(unique);
            }
        } catch (err) {
            console.error('Error fetching platforms:', err);
        }
    };

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p === 'youtube') return 'fab fa-youtube text-red-500';
        if (p === 'tiktok') return 'fab fa-tiktok text-pink-400';
        if (p === 'instagram') return 'fab fa-instagram text-pink-500';
        if (p === 'twitter' || p === 'x') return 'fab fa-twitter text-blue-400';
        if (p === 'discord') return 'fab fa-discord text-indigo-400';
        if (p === 'facebook') return 'fab fa-facebook text-blue-500';
        if (p === 'telegram') return 'fab fa-telegram text-blue-400';
        if (p === 'whatsapp') return 'fab fa-whatsapp text-green-400';
        if (p === 'linkedin') return 'fab fa-linkedin text-blue-600';
        return 'fas fa-link text-gray-400';
    };

    const handlePlatformClick = (platform) => {
        const element = document.getElementById(`${platform}-section`);
        if (element) {
            const offset = 120;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        if (!isDesktop) onClose();
    };

    const isActive = (path) => {
        const [targetPath, targetQuery] = path.split('?');
        const currentPath = location.pathname;
        const currentQuery = location.search.replace('?', '');

        // Home: highlight when on /dashboard without a tab, or with tab=videos
        if (targetPath === '/dashboard' && !targetQuery) {
            return currentPath === '/dashboard' && (currentQuery === '' || currentQuery === 'tab=videos');
        }

        // Other links with a tab query
        if (targetQuery) {
            return currentPath === targetPath && currentQuery === targetQuery;
        }

        // Plain paths
        return currentPath === targetPath;
    };

    // ✅ Sidebar items
    const getSidebarItems = () => {
        const items = [];

        items.push(
            { id: 'home', icon: 'fas fa-home', label: 'Home', path: '/dashboard' },
            { id: 'library', icon: 'fas fa-book', label: 'Library', path: '/library' },
        );

        if (isLoggedIn) {
            items.push({
                id: 'timestamps',
                icon: 'far fa-clock',
                label: 'Timestamps',
                path: '/dashboard?tab=timestamps',
            });
        }

        return items;
    };

    const sidebarItems = getSidebarItems();

    const handleSignOut = async () => {
        if (isEditor) {
            await signOut();
        }
        navigate('/');
    };

    return (
        <>
            {/* Mobile overlay */}
            {!isDesktop && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full
                    bg-[#0F0F14] 
                    shadow-2xl flex-shrink-0
                    transition-all duration-300 ease-in-out
                    ${isDesktop ? 'translate-x-0' : ''}
                    ${!isDesktop && isOpen ? 'translate-x-0' : ''}
                    ${!isDesktop && !isOpen ? '-translate-x-full' : ''}
                    ${isDesktop && isOpen ? 'w-[240px]' : ''}
                    ${isDesktop && !isOpen ? 'w-[72px]' : ''}
                    ${!isDesktop ? 'w-[280px]' : ''}
                `}
            >
                {/* Sidebar header */}
                <div className={`flex items-center h-14 px-4
                    ${isDesktop && !isOpen ? 'justify-center px-2' : 'justify-between'}
                `}>
                    {isDesktop && !isOpen ? (
                        <div className="flex items-center justify-center w-full gap-2">
                            <button
                                onClick={onToggle}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                title="Expand sidebar"
                            >
                                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-5 overflow-hidden rounded-sm">
                                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-md shadow-yellow-500/30">
                                        <i className="fas fa-play text-white text-[8px] ml-0.5"></i>
                                    </div>
                                </div>
                                <span className="text-white font-medium text-sm truncate">
                                    Kelvin
                                </span>
                            </div>
                            <button
                                onClick={onToggle}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                title="Collapse sidebar"
                            >
                                <i className="fas fa-chevron-left text-gray-400 text-sm"></i>
                            </button>
                        </>
                    )}
                </div>

                {/* Sidebar content */}
                <div className={`h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide py-2
                    ${isDesktop && !isOpen ? 'px-1' : 'px-2'}
                `}>
                    {/* Main items */}
                    <div className="space-y-0.5">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => { if (!isDesktop) onClose(); }}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                                    ${isActive(item.path)
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                                    ${isDesktop && !isOpen ? 'justify-center px-2' : ''}
                                `}
                                title={isDesktop && !isOpen ? item.label : ''}
                            >
                                <i className={`${item.icon} text-lg w-5 text-center
                                    ${isActive(item.path) ? 'text-supabase-green' : 'group-hover:text-supabase-green'}
                                    ${isDesktop && !isOpen ? 'text-xl' : ''}
                                `}></i>

                                {(!isDesktop || isOpen) && (
                                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/10 mx-3 my-4"></div>

                    {/* Platforms */}
                    {platforms.length > 0 && (
                        <div className="space-y-0.5">
                            {(!isDesktop || isOpen) && (
                                <p className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                    Platforms
                                </p>
                            )}
                            {platforms.map((platform) => (
                                <button
                                    key={platform}
                                    onClick={() => handlePlatformClick(platform)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2 rounded-xl transition-all w-full text-left group
                                        text-gray-400 hover:text-white hover:bg-white/5
                                        ${isDesktop && !isOpen ? 'justify-center px-2' : ''}
                                    `}
                                    title={isDesktop && !isOpen ? platform : ''}
                                >
                                    <i className={`${getPlatformIcon(platform)} text-lg w-5 text-center
                                        ${isDesktop && !isOpen ? 'text-xl' : ''}
                                    `}></i>
                                    {(!isDesktop || isOpen) && (
                                        <span className="text-sm font-medium capitalize">{platform}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="h-4"></div>
                </div>
            </aside>
        </>
    );
}