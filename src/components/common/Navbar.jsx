// src/components/common/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { supabase } from '../../lib/supabase';
import SearchBar from './SearchBar';
import Line2Nav from './Line2Nav';  // ✅ IMPORT Line2Nav

export default function Navbar({ onToggleSidebar, isSidebarOpen, isDesktop, isEditor, isViewer }) {
    const { user, profile, signOut } = useAuth();
    const { viewer, signOut: viewerSignOut } = useViewerAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [editorData, setEditorData] = useState({ name: 'Editor', profile_image: null });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        fetchEditorData();
    }, []);

    const fetchEditorData = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('name, profile_image')
                .limit(1)
                .maybeSingle();
            if (data) setEditorData({ name: data.name || 'Editor', profile_image: data.profile_image || null });
        } catch (err) {
            console.error('Error fetching editor data:', err);
        }
    };

    const getNavMargin = () => {
        return 'ml-0';
    };

    const getNavMarginLine = () => {
        if (!isDesktop) return 'ml-0';
        if (isSidebarOpen) return 'ml-[240px]';
        return 'ml-[72px]';
    };

    const displayName = profile?.name || editorData.name || 'Editor';
    const profileImage = profile?.profile_image || editorData.profile_image;
    const isLoggedIn = !!user && !!profile;
    const isDashboard = location.pathname.startsWith('/dashboard');

    const getInitial = (name) => name?.charAt(0)?.toUpperCase() || 'E';

    const handleSignOut = async () => {
        if (isEditor) {
            await signOut();
        } else if (isViewer) {
            await viewerSignOut();
        }
        navigate('/');
    };

    return (
        <>
            {/* ✅ LINE 1: Navbar */}
            <nav
                className={`
                    fixed top-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl
                    transition-all duration-300 ease-in-out
                    ${getNavMargin()}
                `}
            >
                <div className="mx-auto md:px-4 px-2 h-14 flex items-center justify-between gap-3">
                    {/* Left: Hamburger + Golden Logo + "Kelvin" */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-0 p-0.5">
                        {!isSearchMode && (
                            <button onClick={onToggleSidebar} className="p-2 hover:bg-white/10 z-[60] rounded-full transition-colors">
                                <i className="fas fa-bars text-white text-xl"></i>
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1.5 group cursor-pointer"
                        >
                            <img
                                src="/images/MK.JPG"
                                alt="Kelvin"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-white/10"
                            />
                            <span className="text-white font-medium text-lg md:text-xl tracking-wide">
                                Kelvin
                            </span>
                        </button>
                    </div>

                    {/* Center: Search Bar - Desktop Only */}
                    <div className="flex-1 max-w-2xl hidden md:block">
                        <SearchBar />
                    </div>

                    {/* Right Side: Search + Bell + Profile */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Mobile Search Icon */}
                        <div className="flex items-center gap-2 md:hidden">
                            {!isSearchMode && (
                                <button
                                    onClick={() => setIsSearchMode(true)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <i className="fas fa-search text-lg"></i>
                                </button>
                            )}
                        </div>

                        {/* Bell Icon */}
                        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                            <i className="fas fa-bell text-lg"></i>
                        </button>

                        {/* Profile - Desktop */}
                        <div className="hidden lg:block relative group">
                            {isLoggedIn ? (
                                <>
                                    <button className="flex items-center gap-2 cursor-pointer">
                                        <img
                                            src={profile.profile_image || `https://ui-avatars.com/api/?name=${profile.name || 'User'}&background=0D9488&color=fff&bold=true&size=32`}
                                            className="w-7 h-7 rounded-full object-cover border border-supabase-green/50 group-hover:border-supabase-green transition-all cursor-pointer"
                                            alt="Avatar"
                                        />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-2xl rounded-xl border border-white/10 shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="text-white text-sm font-medium">{profile.name}</p>
                                            <p className="text-gray-400 text-xs truncate">{user.email}</p>
                                        </div>
                                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm">
                                            <i className="fas fa-tachometer-alt w-4"></i> Dashboard
                                        </Link>
                                        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors text-sm">
                                            <i className="fas fa-sign-out-alt w-4"></i> Sign Out
                                        </button>
                                    </div>
                                </>
                            ) : isViewer ? (
                                <Link to="/viewer-dashboard">
                                    {viewer?.avatar_url ? (
                                        <img src={viewer.avatar_url} className="w-7 h-7 rounded-full object-cover border border-supabase-green/50" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{viewer?.full_name?.charAt(0) || 'V'}</span>
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <Link to="/viewer-login" className="text-gray-400 hover:text-white transition-colors">
                                    <i className="fas fa-user-circle text-2xl"></i>
                                </Link>
                            )}
                        </div>

                        {/* Profile - Mobile */}
                        <div className="lg:hidden">
                            {isLoggedIn ? (
                                <Link to="/dashboard">
                                    <img
                                        src={profile.profile_image || `https://ui-avatars.com/api/?name=${profile.name || 'User'}&background=0D9488&color=fff&bold=true&size=32`}
                                        className="w-7 h-7 rounded-full object-cover border border-supabase-green/50"
                                        alt="Profile"
                                    />
                                </Link>
                            ) : isViewer ? (
                                <Link to="/viewer-dashboard">
                                    {viewer?.avatar_url ? (
                                        <img src={viewer.avatar_url} className="w-7 h-7 rounded-full object-cover border border-supabase-green/50" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{viewer?.full_name?.charAt(0) || 'V'}</span>
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <Link to="/viewer-login" className="text-gray-400 hover:text-white transition-colors">
                                    <i className="fas fa-user-circle text-2xl"></i>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* ✅ Mobile Full Width Search */}
                    {isSearchMode && (
                        <div className="absolute inset-0 flex items-center bg-black px-3 z-50 md:hidden border-b border-white/20">
                            <button
                                onClick={() => {
                                    setIsSearchMode(false);
                                    setSearchQuery('');
                                }}
                                className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                            >
                                <i className="fas fa-arrow-left text-lg"></i>
                            </button>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search videos..."
                                className="flex-1 bg-white/10 text-white placeholder-gray-400 px-4 py-2 text-sm rounded-full border border-white/20 focus:outline-none focus:border-supabase-green focus:ring-1 focus:ring-supabase-green transition-all"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                        setIsSearchMode(false);
                                        setSearchQuery('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                        setIsSearchMode(false);
                                        setSearchQuery('');
                                    }
                                }}
                                className="p-2 text-supabase-green hover:text-white transition-colors flex-shrink-0 ml-2"
                            >
                                <i className="fas fa-search text-lg"></i>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* ✅ LINE 2: Scrollable Nav Buttons - NOW USING IMPORTED COMPONENT */}
            {!isDashboard && (
                <div
                    className={`
                        fixed top-14 left-0 right-0 z-40 bg-black/80 backdrop-blur-md
                        transition-all duration-300 ease-in-out
                        ${getNavMarginLine()}
                    `}
                    style={{ width: isDesktop ? `calc(100% - ${isSidebarOpen ? '240px' : '72px'})` : '100%' }}
                >
                    <div className="max-w-7xl mx-auto px-4">
                        <Line2Nav />  {/* ✅ IMPORTED LINE2 NAV */}
                    </div>
                </div>
            )}

            {/* Spacer */}
            <div className="h-28" />

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                {profileImage ? (
                                    <img src={profileImage} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-supabase-green/50" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">{getInitial(displayName)}</span>
                                    </div>
                                )}
                                <span className="text-white font-medium">{displayName}'s Hub</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                                <i className="fas fa-times text-white text-lg"></i>
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {/* We need to pass nav links to mobile menu */}
                            {/* For now, keep the existing mobile menu logic */}
                            <div className="pt-4 mt-4 border-t border-white/10">
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                            <i className="fas fa-tachometer-alt text-lg w-5"></i><span>Dashboard</span>
                                        </Link>
                                        <button onClick={handleSignOut} className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-xl transition-all">
                                            <i className="fas fa-sign-out-alt text-lg w-5"></i><span>Sign Out</span>
                                        </button>
                                    </>
                                ) : isViewer ? (
                                    <>
                                        <Link to="/viewer-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                            <i className="fas fa-user text-lg w-5"></i><span>Dashboard</span>
                                        </Link>
                                        <button onClick={handleSignOut} className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-xl transition-all">
                                            <i className="fas fa-sign-out-alt text-lg w-5"></i><span>Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/viewer-login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 w-full px-4 py-3 text-supabase-green hover:text-white hover:bg-supabase-green/20 rounded-xl transition-all">
                                        <i className="fas fa-user text-lg w-5"></i><span>Sign In</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}