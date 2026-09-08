import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import VideoCard from '../components/common/VideoCard';
import Footer from '../components/common/Footer';
import { ArrowLeft } from 'lucide-react';

export default function VideosPage() {
    const [searchParams] = useSearchParams();
    const platformFilter = searchParams.get('platform');
    const searchQuery = searchParams.get('search');

    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [platforms, setPlatforms] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showScrollDown, setShowScrollDown] = useState(true);
    const [showScrollUp, setShowScrollUp] = useState(false);

    const scrollContainerRef = useRef(null);
    const videosContainerRef = useRef(null);

    useEffect(() => {
        fetchVideos();
        fetchPlatforms();
    }, [platformFilter, searchQuery]);

    // ✅ Filter videos when search input changes
    useEffect(() => {
        if (videos.length > 0) {
            const query = searchInput.toLowerCase().trim();
            if (query) {
                const filtered = videos.filter(video =>
                    video.title?.toLowerCase().includes(query) ||
                    video.description?.toLowerCase().includes(query) ||
                    video.platform?.toLowerCase().includes(query)
                );
                setFilteredVideos(filtered);
            } else {
                setFilteredVideos(videos);
            }
        }
    }, [searchInput, videos]);

    // ✅ Scroll to bottom or top with smooth animation
    const scrollToBottom = () => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // ✅ Track scroll position to show/hide buttons
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            // At top: show down button, hide up button
            if (scrollTop < 50) {
                setShowScrollDown(true);
                setShowScrollUp(false);
            }
            // At bottom: show up button, hide down button
            else if (scrollTop + clientHeight >= scrollHeight - 50) {
                setShowScrollDown(false);
                setShowScrollUp(true);
            }
            // In middle: show down button, hide up button
            else {
                setShowScrollDown(true);
                setShowScrollUp(false);
            }
        };

        container.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [filteredVideos]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            let query = supabase.from('videos').select('*');

            if (platformFilter && platformFilter !== 'all') {
                query = query.eq('platform', platformFilter);
            }

            if (searchQuery) {
                query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
            }

            const { data } = await query.order('created_at', { ascending: false });
            setVideos(data || []);
            setFilteredVideos(data || []);
        } catch (err) {
            console.error('Error fetching videos:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlatforms = async () => {
        const { data } = await supabase.from('videos').select('platform');
        if (data) {
            const unique = [...new Set(data.map(v => v.platform).filter(p => p && p !== 'other'))];
            setPlatforms(unique);
        }
    };

    const getPageTitle = () => {
        if (searchQuery) return `Search: "${searchQuery}"`;
        if (platformFilter === 'youtube') return 'YouTube Videos';
        if (platformFilter === 'tiktok') return 'TikTok Videos';
        if (platformFilter === 'instagram') return 'Instagram Reels';
        if (platformFilter) return `${platformFilter} Videos`;
        return 'All Videos';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-20">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="bg-gray-900 rounded-2xl aspect-square animate-pulse"></div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Back Button & Title */}
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
                        <p className="text-gray-400 text-sm mt-1">{filteredVideos.length} videos found</p>
                    </div>
                </div>

                {/* ✅ Search Input */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Search videos by title, description, or platform..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white/10 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-supabase-green border border-white/20"
                            style={{ fontSize: '16px' }} // Prevents iOS zoom
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <i className="fas fa-times text-xs"></i>
                            </button>
                        )}
                    </div>
                    {searchInput && (
                        <p className="text-gray-400 text-xs mt-2">
                            Showing {filteredVideos.length} of {videos.length} videos
                        </p>
                    )}
                </div>

                {/* Platform Filter Pills */}
                {platforms.length > 0 && !searchQuery && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        <Link
                            to="/videos"
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${!platformFilter ? 'bg-supabase-green text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                                }`}
                        >
                            All
                        </Link>
                        {platforms.map(platform => (
                            <Link
                                key={platform}
                                to={`/videos?platform=${platform}`}
                                className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${platformFilter === platform ? 'bg-supabase-green text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {platform === 'youtube' && '▶️ '}
                                {platform === 'tiktok' && '🎵 '}
                                {platform}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Videos Grid Container with scroll ref */}
                <div
                    ref={scrollContainerRef}
                    className="relative max-h-[70vh] overflow-y-auto scrollbar-hide"
                >
                    <div ref={videosContainerRef}>
                        {filteredVideos.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-gray-400">
                                    {searchInput ? 'No videos match your search' : 'No videos found in this category.'}
                                </p>
                                <Link to="/" className="text-supabase-green hover:underline text-sm mt-2 inline-block">
                                    Back to Home
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
                                {filteredVideos.map(video => (
                                    <VideoCard key={video.id} video={video} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ✅ Scroll Buttons */}
                {showScrollDown && filteredVideos.length > 0 && (
                    <button
                        onClick={scrollToBottom}
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-supabase-green hover:bg-supabase-green/80 rounded-full flex items-center justify-center shadow-lg shadow-supabase-green/50 transition-all hover:scale-110 animate-bounce"
                        aria-label="Scroll to bottom"
                    >
                        <i className="fas fa-arrow-down text-white text-lg"></i>
                    </button>
                )}

                {showScrollUp && filteredVideos.length > 0 && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-supabase-green hover:bg-supabase-green/80 rounded-full flex items-center justify-center shadow-lg shadow-supabase-green/50 transition-all hover:scale-110 animate-bounce"
                        aria-label="Scroll to top"
                    >
                        <i className="fas fa-arrow-up text-white text-lg"></i>
                    </button>
                )}
            </div>
            <Footer />
        </div>
    );
}