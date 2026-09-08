// src/components/editor/EditorSidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function EditorSidebar({ isOpen, onClose, isDesktop, onToggle }) {
    const { user, profile, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [editorsCount, setEditorsCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [likedCount, setLikedCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [platforms, setPlatforms] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // ✅ Fetch counts and platforms
    useEffect(() => {
        if (user) {
            fetchCounts();
            fetchPlatforms();
        }
    }, [user]);

    const fetchCounts = async () => {
        try {
            // Get editors count
            const { count: editors } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });
            setEditorsCount(editors || 0);

            // Get users/viewers count
            const { count: users } = await supabase
                .from('viewers')
                .select('*', { count: 'exact', head: true });
            setUsersCount(users || 0);

            // Get liked videos count (for editor's own likes)
            const { count: liked } = await supabase
                .from('video_likes')
                .select('*', { count: 'exact', head: true })
                .eq('viewer_id', user.id);
            setLikedCount(liked || 0);

            // Get comments count
            const { count: comments } = await supabase
                .from('video_comments')
                .select('*', { count: 'exact', head: true })
                .eq('viewer_id', user.id)
                .maybeSingle();
            setCommentsCount(comments || 0);

        } catch (err) {
            console.error('Error fetching counts:', err);
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

    const getPlatformColor = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p === 'youtube') return 'hover:text-red-500';
        if (p === 'tiktok') return 'hover:text-pink-400';
        if (p === 'instagram') return 'hover:text-pink-500';
        if (p === 'twitter' || p === 'x') return 'hover:text-blue-400';
        if (p === 'discord') return 'hover:text-indigo-400';
        if (p === 'facebook') return 'hover:text-blue-500';
        if (p === 'telegram') return 'hover:text-blue-400';
        if (p === 'whatsapp') return 'hover:text-green-400';
        if (p === 'linkedin') return 'hover:text-blue-600';
        return 'hover:text-supabase-green';
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
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    // ✅ Build sidebar items - DYNAMIC
    const getSidebarItems = () => {
        const items = [];

        // ✅ Always show (for everyone)
        items.push(
            { id: 'home', icon: 'fas fa-home', label: 'Home', path: '/' },
            { id: 'library', icon: 'fas fa-book', label: 'Library', path: '/library' },
        );

        // ✅ Only if logged in (Editor is logged in here)
        if (user) {
            items.push(
                { id: 'liked', icon: 'fas fa-heart', label: 'Liked Videos', path: '/liked', count: likedCount },
                { id: 'comments', icon: 'fas fa-comment', label: 'My Comments', path: '/comments', count: commentsCount },
                { id: 'new-playlist', icon: 'fas fa-plus-circle', label: 'New Playlist', path: '/playlist/new' },
            );
        }

        // ✅ EDITOR ONLY - Only show if there are editors
        if (editorsCount > 0) {
            items.push({
                id: 'editors',
                icon: 'fa-user-tie',
                label: `Editors (${editorsCount})`,
                path: '/dashboard/editors',
                isEditorSection: true
            });
        }

        // ✅ EDITOR ONLY - Only show if there are users/viewers
        if (usersCount > 0) {
            items.push({
                id: 'users',
                icon: 'fa-users',
                label: `Users (${usersCount})`,
                path: '/dashboard/users',
                isEditorSection: true
            });
        }

        return items;
    };

    const sidebarItems = getSidebarItems();

    // ✅ Check if we should show the editor divider
    const hasEditorSections = sidebarItems.some(item => item.isEditorSection);

    // ✅ Handle sign out
    const handleSignOut = async () => {
        setShowDropdown(false);
        await signOut();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile overlay */}
            {!isDesktop && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`sidebar
                    fixed top-14 left-0 z-50 h-[calc(100vh-56px)]
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
                {/* ✅ Sidebar Header */}
                <div className={`flex items-center h-14 px-4 border-b border-white/10
                    ${isDesktop && !isOpen ? 'justify-center px-2' : 'justify-between'}
                `}>
                    {isDesktop && !isOpen ? (
                        // ✅ Collapsed: Show only icon + toggle button
                        <div className="flex items-center justify-center w-full gap-2">
                            {profile?.profile_image ? (
                                <img
                                    src={profile.profile_image}
                                    alt={profile.name}
                                    className="w-8 h-8 rounded-full object-cover border border-supabase-green/50"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {profile?.name?.charAt(0) || 'E'}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={onToggle}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                title="Expand sidebar"
                            >
                                <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                            </button>
                        </div>
                    ) : ''}
                </div>

                {/* ✅ Sidebar Content - Scrollable */}
                <div className={`h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide px-2 py-2
                    ${isDesktop && !isOpen ? 'px-1' : 'px-2'}
                `}>
                    {/* ✅ Main Items */}
                    <div className="space-y-0.5 mb-4">
                        {sidebarItems.map((item) => (
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

                    {/* ✅ Editor Divider - Only show if there are editor sections */}
                    {hasEditorSections && (!isDesktop || isOpen) && (
                        <div className="h-px bg-white/10 mx-3 my-4"></div>
                    )}

                    {/* ✅ Platforms List */}
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

                    {/* ✅ Bottom Spacer */}
                    <div className="h-4"></div>
                </div>

                {/* ✅ Bottom Section - Email + 3 dots */}
                <div className={`absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0F0F0F]
                    ${isDesktop && !isOpen ? 'px-2 py-3' : 'px-4 py-3'}
                `}>
                    {isDesktop && !isOpen ? (
                        // ✅ Collapsed: Show only avatar
                        <div className="flex justify-center">
                            {profile?.profile_image ? (
                                <img
                                    src={profile.profile_image}
                                    alt={profile.name}
                                    className="w-8 h-8 rounded-full object-cover border border-supabase-green/50"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {profile?.name?.charAt(0) || 'E'}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        // ✅ Open: Show email + dropdown
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                {profile?.profile_image ? (
                                    <img
                                        src={profile.profile_image}
                                        alt={profile.name}
                                        className="w-8 h-8 rounded-full object-cover border border-supabase-green/50 flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">
                                            {profile?.name?.charAt(0) || 'E'}
                                        </span>
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                        {profile?.name || 'Editor'}
                                    </p>
                                    <p className="text-gray-400 text-xs truncate">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>

                            {/* ✅ 3 Dots Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <i className="fas fa-ellipsis-v text-gray-400 text-sm"></i>
                                </button>

                                {showDropdown && (
                                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-scale-in">
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setShowDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
                                        >
                                            <i className="fas fa-cog w-4"></i> Settings
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors text-sm"
                                        >
                                            <i className="fas fa-sign-out-alt w-4"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}