import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';

export default function MobileBottomNav() {
    const location = useLocation();
    const { user, profile } = useAuth(); // Editor auth
    const { viewer } = useViewerAuth(); // Viewer auth

    // Determine if user is an editor or viewer
    const isEditor = !!user && !!profile;
    const isViewer = !!viewer;

    // Determine the profile path based on role
    let profilePath = '/viewer-login'; // Default
    if (isEditor) {
        profilePath = '/dashboard';
    } else if (isViewer) {
        profilePath = '/viewer-dashboard';
    }

    // Determine profile label based on role
    let profileLabel = 'Login';
    if (isEditor) {
        profileLabel = 'Dashboard';
    } else if (isViewer) {
        profileLabel = 'Me';
    }

    const tabs = [
        { id: 'home', icon: 'fas fa-home', label: 'Home', path: '/' },
        { id: 'recent', icon: 'fas fa-clock', label: 'Recent', path: '/recent' },
        { id: 'search', icon: 'fas fa-search', label: 'Search', path: '/search' },
        { id: 'profile', icon: 'fas fa-user', label: profileLabel, path: profilePath }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        // ✅ FIXED: Fixed to bottom, no gap, rounded top only
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* ✅ Glass/blur background */}
            <div className="bg-black/70 backdrop-blur-2xl border-t border-white/20 rounded-t-2xl shadow-2xl shadow-black/50">
                <div className="flex justify-around items-center py-2 px-2">
                    {tabs.map(tab => (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full transition-all duration-200
                                ${isActive(tab.path)
                                    ? 'bg-supabase-green/20 text-supabase-green shadow-lg shadow-supabase-green/25'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                        >
                            <i className={`${tab.icon} text-lg`}></i>
                            <span className="text-[9px] font-medium">{tab.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}