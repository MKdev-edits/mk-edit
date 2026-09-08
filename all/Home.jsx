// src/pages/Home.jsx - Updated grid sections
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
//import Hero from '../components/Hero';
import Footer from '../components/common/Footer';
import VideoCard from '../components/common/VideoCard';

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [vipVideos, setVipVideos] = useState([]);
    const [platformVideos, setPlatformVideos] = useState({});
    const [profile, setProfile] = useState({
        name: 'Editor',
        tagline: 'Video Editor | Content Creator',
        about: '',
        profile_image: null
    });
    const [allVideos, setAllVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [videoPage, setVideoPage] = useState(1);
    const VIDEOS_PER_PAGE = 10;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Listen for sidebar state changes
    useEffect(() => {
        const handleSidebarChange = (e) => {
            setIsSidebarOpen(e.detail?.isOpen ?? true);
        };
        window.addEventListener('sidebarChange', handleSidebarChange);
        return () => window.removeEventListener('sidebarChange', handleSidebarChange);
    }, []);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const { data: videosData } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (videosData) {
                const socialVideos = videosData.filter(v => !v.is_vip && !v.is_top_rated);

                setAllVideos(socialVideos);
                setVideos(videosData);
                setTopRated(videosData.filter(v => v.is_top_rated));
                setVipVideos(videosData.filter(v => v.is_vip));
                setVisibleVideos(socialVideos.slice(0, VIDEOS_PER_PAGE));

                const grouped = {};
                videosData.forEach(video => {
                    if (video.platform) {
                        const key = video.platform.toLowerCase();
                        if (!grouped[key]) grouped[key] = [];
                        grouped[key].push(video);
                    }
                });
                setPlatformVideos(grouped);
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (profileData) {
                setProfile(profileData);
            }
        } catch (err) {
            console.error('Error fetching homepage data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreVideos = () => {
        const nextPage = videoPage + 1;
        const end = nextPage * VIDEOS_PER_PAGE;
        const newVideos = allVideos.slice(0, end);
        setVisibleVideos(newVideos);
        setVideoPage(nextPage);
    };

    useEffect(() => {
        if (visibleVideos.length >= allVideos.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreVideos();
                }
            },
            { threshold: 0.1 }
        );

        const sentinel = document.getElementById('video-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [visibleVideos, allVideos]);

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p === 'youtube') return 'fab fa-youtube text-red-500';
        if (p === 'tiktok') return 'fab fa-tiktok text-pink-400';
        if (p === 'twitter' || p === 'x') return 'fab fa-twitter text-blue-400';
        if (p === 'instagram') return 'fab fa-instagram text-pink-500';
        if (p === 'discord') return 'fab fa-discord text-indigo-400';
        if (p === 'facebook') return 'fab fa-facebook text-blue-500';
        if (p === 'telegram') return 'fab fa-telegram text-blue-400';
        if (p === 'whatsapp') return 'fab fa-whatsapp text-green-400';
        if (p === 'linkedin') return 'fab fa-linkedin text-blue-600';
        if (p === 'github') return 'fab fa-github text-gray-400';
        return 'fas fa-link text-gray-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Mk's Hub Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans">
            {/* <Hero onExplore={() => document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' })} /> */}
            <div id="videos-section" className="max-w-7xl mx-auto px-4 py-12 space-y-16">

                {/* ✅ Platform Sections - Responsive Grid */}
                {Object.entries(platformVideos).map(([platform, platformVideosList]) => {
                    if (platformVideosList.length === 0) return null;
                    return (
                        <div id={`${platform}-section`} key={platform}>
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <i className={getPlatformIcon(platform)}></i>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)} Videos
                            </h2>
                            <div className={`video-grid ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                                {platformVideosList.map(video => (
                                    <VideoCard key={video.id} video={video} />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* ✅ Top Rated Section */}
                {topRated.length > 0 && (
                    <div id="top-rated-section">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <i className="fas fa-star text-teal-500"></i> Top Rated Vids
                        </h2>
                        <div className={`video-grid ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                            {topRated.map(video => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ✅ VIP Section */}
                {vipVideos.length > 0 && (
                    <div id="vip-section">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <i className="fas fa-crown text-yellow-500"></i> VIP Showcases
                        </h2>
                        <div className={`video-grid ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                            {vipVideos.map(video => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ✅ All Videos Section */}
                <div id="all-videos-section">
                    <h2 className="text-2xl font-bold mb-6">All Videos</h2>
                    <div className={`video-grid ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        {visibleVideos.map(video => (
                            <VideoCard key={video.id} video={video} small={true} />
                        ))}
                    </div>

                    {visibleVideos.length < allVideos.length && (
                        <div id="video-sentinel" className="h-10 flex items-center justify-center mt-4">
                            <div className="w-6 h-6 border-2 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin"></div>
                        </div>
                    )}

                    <p className="text-gray-500 text-xs mt-4 text-center">
                        Showing {visibleVideos.length} of {allVideos.length} videos
                    </p>
                </div>

                {/* ✅ About Section */}
                <div id="about-section" className="bg-white/5 rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto mt-12">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        {profile.profile_image && (
                            <img src={profile.profile_image} alt={profile.name} className="w-24 h-24 rounded-full object-cover border-2 border-supabase-green" />
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-white mb-1">{profile.name}</h3>
                            <p className="text-supabase-green text-sm mb-4">{profile.tagline}</p>
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                                {profile.about || "Welcome to my portfolio website! Use the dashboard to customize this bio."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}