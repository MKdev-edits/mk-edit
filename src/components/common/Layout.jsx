// src/components/common/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import { PlayerProvider } from '../../contexts/PlayerContext';

export default function Layout() {
    const { user, profile } = useAuth(); // Editor
    const { viewer } = useViewerAuth(); // Viewer
    const location = useLocation();

    const isEditor = !!user && !!profile;
    const isViewer = !!viewer;
    const isSearchPage = location.pathname === '/search';
    const isAuthPage = ['/login', '/viewer-login', '/viewer-signup', '/update-password'].includes(location.pathname);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const isDashboard = location.pathname.startsWith('/dashboard');

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 768;
            setIsDesktop(desktop);
            if (desktop) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const showSidebar = !isSearchPage && !isAuthPage;

    // ✅ Calculate margin for content
    const getMainStyles = () => {
        if (!showSidebar) return 'ml-0';
        if (!isDesktop) return 'ml-0';
        if (isSidebarOpen) return 'ml-[240px]';
        return 'ml-[72px]';
    };

    return (
        <PlayerProvider>
            <div className={`min-h-screen bg-black ${isDashboard ? 'pt-0 md:pt-0' : ''} pt-0 pb-24 md:pt-2 md:pb-4`}>
                {/* Navbar */}
                <Navbar
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    isDesktop={isDesktop}
                    isEditor={isEditor}
                    isViewer={isViewer}
                />

                {/* Sidebar */}
                {showSidebar && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        isDesktop={isDesktop}
                        onToggle={toggleSidebar}
                    />
                )}

                {/* ✅ Main Content - Now includes Line2Nav */}
                <main className={`pt-2 transition-all duration-300 ${getMainStyles()}`}>
                    {/* Page Content */}
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav */}
                {!isDesktop && <MobileBottomNav />}
            </div>
        </PlayerProvider>
    );
}