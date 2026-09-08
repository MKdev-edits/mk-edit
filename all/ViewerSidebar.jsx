// src/components/viewer/ViewerSidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { supabase } from '../../lib/supabase';

export default function ViewerSidebar({ isOpen, onClose, isDesktop, onToggle }) {
    const { viewer } = useViewerAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [likedCount, setLikedCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [followedCount, setFollowedCount] = useState(0);
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        if (viewer) {
            fetchViewerData();
            fetchPlatforms();
        }
    }, [viewer]);

    // ✅ Dispatch sidebar state changes
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('sidebarChange', {
            detail: { isOpen }
        }));
    }, [isOpen]);

    const fetchViewerData = async () => {
        if (!viewer) return;

        try {
            const { count: liked } = await supabase
                .from('video_likes')
                .select('*', { count: 'exact', head: true })
                .eq('viewer_id', viewer.id);
            setLikedCount(liked || 0);

            const { count: comments } = await supabase
                .from('video_comments')
                .select('*', { count: 'exact', head: true })
                .eq('viewer_id', viewer.id)
                .maybeSingle();
            setCommentsCount(comments || 0);

            const { count: followed } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('viewer_id', viewer.id);
            setFollowedCount(followed || 0);

        } catch (err) {
            console.error('Error fetching viewer data:', err);
        }
    };

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
        if (!isDesktop) {
            onClose();
        }
    };

    const sidebarItems = {
        hardcoded: [
            { id: 'home', icon: 'fas fa-home', label: 'Home', path: '/' },
            { id: 'library', icon: 'fas fa-book', label: 'Library', path: '/library' }
        ],
        dynamic: [
            {
                id: 'liked',
                icon: 'fas fa-heart',
                label: 'Liked Videos',
                path: '/liked',
                count: likedCount,
                show: !!viewer
            },
            {
                id: 'comments',
                icon: 'fas fa-comment',
                label: 'My Comments',
                path: '/comments',
                count: commentsCount,
                show: !!viewer
            },
            {
                id: 'followed',
                icon: 'fas fa-users',
                label: 'Followed Editors',
                path: '/followed',
                count: followedCount,
                show: !!viewer
            }
        ]
    };

    const allItems = [
        ...sidebarItems.hardcoded,
        ...(viewer ? sidebarItems.dynamic.filter(item => item.show) : [])
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile overlay */}
            {!isDesktop && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black md:hidden"
                    onClick={onClose}
                />
            )}

            {/* ✅ Sidebar with YouTube-style collapse */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full 
                    bg-black 
                    shadow-2xl 
                    transition-all duration-300 ease-in-out
                    ${isDesktop ? 'translate-x-0' : ''}
                    ${!isDesktop && isOpen ? 'translate-x-0' : ''}
                    ${!isDesktop && !isOpen ? '-translate-x-full' : ''}
                    ${isDesktop && isOpen ? 'w-[240px]' : ''}
                    ${isDesktop && !isOpen ? 'w-[72px]' : ''}
                    ${!isDesktop ? 'w-[280px]' : ''}
                `}
            >
                {/* ✅ Sidebar Header with TOGGLE BUTTON */}
                <div className={`flex items-center h-14 px-4 border-b border-white/10
                    ${isDesktop && !isOpen ? 'justify-center px-2' : 'justify-between'}
                `}>
                    {isDesktop && !isOpen ? (
                        // ✅ Collapsed: Show only icon + toggle button
                        <div className="flex items-center justify-center w-full gap-2">
                            {viewer?.avatar_url ? (
                                <img
                                    src={viewer.avatar_url}
                                    alt={viewer.full_name}
                                    className="w-8 h-8 rounded-full object-cover border border-supabase-green/50"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {viewer?.full_name?.charAt(0) || 'V'}
                                    </span>
                                </div>
                            )}
                            {/* ✅ Toggle button when collapsed */}
                            <button
                                onClick={onToggle}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                title="Expand sidebar"
                            >
                                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                            </button>
                        </div>
                    ) : (
                        // ✅ Open: Show full header with close button
                        <>
                            <div className="flex items-center gap-3">
                                {viewer?.avatar_url ? (
                                    <img
                                        src={viewer.avatar_url}
                                        alt={viewer.full_name}
                                        className="w-8 h-8 rounded-full object-cover border border-supabase-green/50"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {viewer?.full_name?.charAt(0) || 'V'}
                                        </span>
                                    </div>
                                )}
                                <span className="text-white font-medium text-sm truncate">
                                    {viewer?.full_name || 'Viewer'}
                                </span>
                            </div>

                            {/* ✅ Toggle button when open */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={onToggle}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                    title="Collapse sidebar"
                                >
                                    <i className="fas fa-chevron-left text-gray-400 text-sm"></i>
                                </button>
                                {/* Close button (mobile only) */}
                                {!isDesktop && (
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <i className="fas fa-times text-gray-400 text-lg"></i>
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar Content */}
                <div className={`h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide px-2 py-2
                    ${isDesktop && !isOpen ? 'px-1' : 'px-2'}
                `}>
                    {/* Hardcoded + Dynamic Items */}
                    <div className="space-y-0.5 mb-4">
                        {allItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => {
                                    if (!isDesktop) onClose();
                                }}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                                    ${isActive(item.path)
                                        ? 'bg-white/15 text-white'
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

                                {/* Hide label when collapsed */}
                                {(!isDesktop || isOpen) && (
                                    <>
                                        <span className="flex-1 text-sm font-medium">{item.label}</span>
                                        {item.count !== undefined && item.count > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full
                                                ${isActive(item.path)
                                                    ? 'bg-supabase-green/30 text-supabase-green'
                                                    : 'bg-white/10 text-gray-400'
                                                }
                                            `}>
                                                {item.count}
                                            </span>
                                        )}
                                    </>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/10 mx-3 my-4"></div>

                    {/* New Playlist Button */}
                    <Link
                        to="/playlist/new"
                        onClick={() => {
                            if (!isDesktop) onClose();
                        }}
                        className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all 
                            text-gray-400 hover:text-white hover:bg-white/5 group mb-4
                            ${isDesktop && !isOpen ? 'justify-center px-2' : ''}
                        `}
                        title={isDesktop && !isOpen ? 'New Playlist' : ''}
                    >
                        <i className="fas fa-plus-circle text-lg w-5 text-center text-supabase-green group-hover:scale-110 transition-transform"></i>
                        {(!isDesktop || isOpen) && (
                            <span className="text-sm font-medium">New Playlist</span>
                        )}
                    </Link>

                    {/* Divider */}
                    <div className="h-px bg-white/10 mx-3 my-4"></div>

                    {/* Dynamic Platform List */}
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
                                        <span className="text-sm font-medium capitalize">
                                            {platform}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Bottom Spacer */}
                    <div className="h-4"></div>
                </div>
            </aside>
        </>
    );
}