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
    const [showDropdown, setShowDropdown] = useState(false);
    const [timestampsExpanded, setTimestampsExpanded] = useState(false);
    const [timestampedVideos, setTimestampedVideos] = useState([]);
    const [loadingTimestamps, setLoadingTimestamps] = useState(false);

    // ✅ Fetch platforms
    useEffect(() => {
        fetchPlatforms();
    }, []);

    // ✅ Fetch timestamped videos if logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchTimestampedVideos();
        }
    }, [isLoggedIn]);

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

    const fetchTimestampedVideos = async () => {
        setLoadingTimestamps(true);
        try {
            // Get videos that have timestamps
            const { data } = await supabase
                .from('video_feedback')
                .select('video_id, videos(title, id)')
                .eq('client_id', viewer?.id || user?.id)
                .order('created_at', { ascending: false });

            if (data) {
                // Get unique videos
                const uniqueVideos = [];
                const seenIds = new Set();
                data.forEach(item => {
                    if (item.videos && !seenIds.has(item.videos.id)) {
                        seenIds.add(item.videos.id);
                        uniqueVideos.push(item.videos);
                    }
                });
                setTimestampedVideos(uniqueVideos);
            }
        } catch (err) {
            console.error('Error fetching timestamped videos:', err);
        } finally {
            setLoadingTimestamps(false);
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
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    // ✅ Build sidebar items
    const getSidebarItems = () => {
        const items = [];

        // ✅ Always show for everyone
        items.push(
            { id: 'home', icon: 'fas fa-home', label: 'Home', path: '/' },
            { id: 'library', icon: 'fas fa-book', label: 'Library', path: '/library' },
        );

        // ✅ Show timestamps for logged-in users
        if (isLoggedIn) {
            items.push({
                id: 'timestamps',
                icon: 'far fa-clock',
                label: 'Timestamps',
                path: '/timestamps',
                isDropdown: true,
            });
        }

        return items;
    };

    const sidebarItems = getSidebarItems();

    // ✅ Handle sign out
    const handleSignOut = async () => {
        setShowDropdown(false);
        if (isEditor) {
            await signOut();
        }
        navigate('/');
    };

    // ✅ Toggle timestamps dropdown
    const toggleTimestamps = () => {
        setTimestampsExpanded(!timestampsExpanded);
    };

    return (
        <>
            {/* Mobile overlay */}
            {!isDesktop && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full
                    bg-black border-r border-white/10
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
                {/* ✅ Sidebar Header */}
                <div className={`flex items-center h-14 px-4
                    ${isDesktop && !isOpen ? 'justify-center px-2' : 'justify-between'}
                `}>
                    {isDesktop && !isOpen ? (
                        // ✅ Collapsed: Show only toggle button
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
                        // ✅ Open: Show header with close button
                        <>
                            <div className="flex items-center gap-3">
                                {/* ✅ Golden Logo */}
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

                {/* ✅ Sidebar Content - Scrollable */}
                <div className={`h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide px-2 py-2
                    ${isDesktop && !isOpen ? 'px-1' : 'px-2'}
                `}>
                    {/* ✅ Main Items */}
                    <div className="space-y-0.5">
                        {sidebarItems.map((item) => (
                            <div key={item.id}>
                                {item.isDropdown ? (
                                    // ✅ Timestamps Dropdown
                                    <div>
                                        <button
                                            onClick={toggleTimestamps}
                                            className={`
                                                flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all group
                                                ${isDesktop && !isOpen ? 'justify-center px-2' : ''}
                                                text-gray-400 hover:text-white hover:bg-white/5
                                            `}
                                            title={isDesktop && !isOpen ? item.label : ''}
                                        >
                                            <i className={`${item.icon} text-lg w-5 text-center
                                                ${isDesktop && !isOpen ? 'text-xl' : ''}
                                            `}></i>

                                            {(!isDesktop || isOpen) && (
                                                <>
                                                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                                                    <i className={`fas fa-chevron-${timestampsExpanded ? 'down' : 'right'} text-gray-500 text-xs transition-transform`}></i>
                                                </>
                                            )}
                                        </button>

                                        {/* ✅ Timestamp Videos List */}
                                        {timestampsExpanded && (!isDesktop || isOpen) && (
                                            <div className="mt-1 space-y-0.5 ml-7">
                                                {loadingTimestamps ? (
                                                    <p className="text-gray-500 text-xs px-3 py-2">Loading...</p>
                                                ) : timestampedVideos.length === 0 ? (
                                                    <p className="text-gray-500 text-xs px-3 py-2">No timestamped videos</p>
                                                ) : (
                                                    <>
                                                        {timestampedVideos.map((video) => (
                                                            <Link
                                                                key={video.id}
                                                                to={`/video/${video.id}`}
                                                                onClick={() => {
                                                                    if (!isDesktop) onClose();
                                                                }}
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 text-gray-400 hover:text-white text-sm"
                                                            >
                                                                <i className="fas fa-play-circle text-xs text-supabase-green"></i>
                                                                <span className="truncate">{video.title}</span>
                                                            </Link>
                                                        ))}

                                                        {/* ✅ View All Button */}
                                                        {timestampedVideos.length > 1 && (
                                                            <Link
                                                                to="/timestamps"
                                                                onClick={() => {
                                                                    if (!isDesktop) onClose();
                                                                }}
                                                                className="flex items-center justify-center px-3 py-1.5 mt-1 rounded-lg bg-supabase-green/10 hover:bg-supabase-green/20 text-supabase-green text-xs font-medium transition-all"
                                                            >
                                                                View All ({timestampedVideos.length} videos)
                                                            </Link>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // ✅ Regular Item
                                    <Link
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
                                            <span className="flex-1 text-sm font-medium">{item.label}</span>
                                        )}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ✅ Divider */}
                    <div className="h-px bg-white/10 mx-3 my-4"></div>

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
                                        <span className="text-sm font-medium capitalize">{platform}</span>
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