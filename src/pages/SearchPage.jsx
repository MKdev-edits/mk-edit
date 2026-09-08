// src/pages/SearchPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useViewerAuth } from '../contexts/ViewerAuthContext';
import SearchBar from '../components/search/SearchBar';
import RecentSearches from '../components/search/RecentSearches';
import TrendingGrid from '../components/search/TrendingGrid';
import FeaturedResult from '../components/search/FeaturedResult';
import RelatedResults from '../components/search/RelatedResults';
import VideoPlayer from '../components/common/VideoPlayer';
import Footer from '../components/common/Footer';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlQuery = searchParams.get('q') || '';

    const { viewer } = useViewerAuth();
    const [query, setQuery] = useState(urlQuery);
    const [allVideos, setAllVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [featuredVideo, setFeaturedVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false); // ← ADD THIS
    const [activeFilter, setActiveFilter] = useState('all');
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Swipe state
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    const [swipedItem, setSwipedItem] = useState(null);
    const [isSwiping, setIsSwiping] = useState(false);

    const searchTimeout = useRef(null);

    // ============================================
    // LOAD DATA
    // ============================================

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (e) {
                setRecentSearches([]);
            }
        }
        fetchAllVideos();
        if (viewer) fetchFavorites();
    }, []);

    useEffect(() => {
        if (urlQuery) {
            setQuery(urlQuery);
            performSearch(urlQuery);
        }
    }, [urlQuery]);

    const fetchAllVideos = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });
            setAllVideos(data || []);
            setFilteredVideos(data || []);
            setRelatedVideos(data || []);
        } catch (err) {
            console.error('Error fetching videos:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        if (!viewer) return;
        const { data } = await supabase
            .from('video_likes')
            .select('video_id')
            .eq('viewer_id', viewer.id);
        setFavorites(data?.map(item => item.video_id) || []);
    };

    // ============================================
    // SEARCH FUNCTIONS
    // ============================================

    const performSearch = (searchTerm) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        // ✅ Show searching state
        setIsSearching(true);

        searchTimeout.current = setTimeout(() => {
            let results = [...allVideos];
            const cleanQuery = searchTerm.toLowerCase().trim();

            if (cleanQuery) {
                results = results.filter(v =>
                    v.title?.toLowerCase().includes(cleanQuery) ||
                    v.description?.toLowerCase().includes(cleanQuery)
                );
            }

            if (activeFilter === 'top_rated') {
                results = results.filter(v => v.is_top_rated);
            }
            if (activeFilter === 'vip') {
                results = results.filter(v => v.is_vip);
            }

            console.log('🔍 Search results:', results.length);
            console.log('📌 Featured:', results.length > 0 ? results[0]?.title : 'None');

            setFilteredVideos(results);
            setFeaturedVideo(results.length > 0 ? results[0] : null);
            setRelatedVideos(results.length > 0 ? results.slice(1) : []);

            // ✅ Hide searching state
            setIsSearching(false);
        }, 300);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            performSearch(value);
            setSearchParams({ q: value });
        } else {
            setIsSearching(false);
            setFeaturedVideo(null);
            setRelatedVideos(allVideos);
            setFilteredVideos(allVideos);
            setSearchParams({});
        }
    };

    const handleSearchSubmit = () => {
        if (!query.trim()) return;

        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 6);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        performSearch(query);
        setSearchParams({ q: query });
    };

    const handleClearSearch = () => {
        setQuery('');
        setIsSearching(false);
        setFeaturedVideo(null);
        setRelatedVideos(allVideos);
        setFilteredVideos(allVideos);
        setSearchParams({});
    };

    const handleRecentSelect = (searchTerm) => {
        setQuery(searchTerm);
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 6);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        performSearch(searchTerm);
        setSearchParams({ q: searchTerm });
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (query.trim()) {
            performSearch(query);
        } else {
            let results = [...allVideos];
            if (filter === 'top_rated') {
                results = results.filter(v => v.is_top_rated);
            }
            if (filter === 'vip') {
                results = results.filter(v => v.is_vip);
            }
            setFilteredVideos(results);
            setFeaturedVideo(results.length > 0 ? results[0] : null);
            setRelatedVideos(results.length > 0 ? results.slice(1) : []);
        }
    };

    // ============================================
    // FAVORITE FUNCTIONS
    // ============================================

    const handleAddToFavorites = async (videoId, e) => {
        e?.stopPropagation();
        if (!viewer) {
            alert('Please login to add to favorites');
            return;
        }

        if (favorites.includes(videoId)) {
            await supabase
                .from('video_likes')
                .delete()
                .eq('video_id', videoId)
                .eq('viewer_id', viewer.id);
            setFavorites(favorites.filter(id => id !== videoId));
        } else {
            await supabase
                .from('video_likes')
                .insert([{ video_id: videoId, viewer_id: viewer.id }]);
            setFavorites([...favorites, videoId]);
        }
    };

    const isFavorite = (videoId) => {
        return favorites.includes(videoId);
    };

    const handlePlayVideo = (video) => {
        setSelectedVideo(video);
        setShowPlayer(true);
    };

    // ============================================
    // SWIPE HANDLERS
    // ============================================

    const handleTouchStart = (e, video) => {
        const touch = e.touches[0];
        setTouchStartX(touch.clientX);
        setTouchStartY(touch.clientY);
        setSwipedItem(video);
        setIsSwiping(false);
    };

    const handleTouchMove = (e) => {
        if (!swipedItem) return;

        const touch = e.touches[0];
        const diffX = touchStartX - touch.clientX;
        const diffY = touchStartY - touch.clientY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 20) {
            setIsSwiping(true);
            e.preventDefault();
        }
    };

    const handleTouchEnd = (e) => {
        if (!swipedItem || !isSwiping) {
            setTouchStartX(0);
            setSwipedItem(null);
            setIsSwiping(false);
            return;
        }

        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;

        if (Math.abs(diffX) < 50) {
            setTouchStartX(0);
            setSwipedItem(null);
            setIsSwiping(false);
            return;
        }

        if (diffX > 0) {
            alert(`🎵 "${swipedItem.title}" added to queue!`);
        } else {
            handleAddToFavorites(swipedItem.id);
        }

        setTouchStartX(0);
        setSwipedItem(null);
        setIsSwiping(false);
    };

    // ============================================
    // RENDER
    // ============================================

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin"></div>
            </div>
        );
    }

    const hasQuery = query.trim().length > 0;

    return (
        <div className="min-h-screen bg-black pt-20">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search Bar */}
                <SearchBar
                    query={query}
                    setQuery={setQuery}
                    onSearch={handleSearchSubmit}
                    onClear={handleClearSearch}
                />

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide py-1">
                    {['all', 'top_rated', 'vip'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeFilter === filter
                                ? 'bg-supabase-green text-white'
                                : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                        >
                            {filter === 'all' && 'All Content'}
                            {filter === 'top_rated' && <><i className="fas fa-star text-xs"></i> Top Rated</>}
                            {filter === 'vip' && <><i className="fas fa-crown text-xs"></i> VIP</>}
                        </button>
                    ))}
                </div>

                {/* STATE 1: No Search */}
                {!hasQuery && (
                    <>
                        <RecentSearches
                            searches={recentSearches}
                            onSelect={handleRecentSelect}
                            onClear={clearRecent}
                        />
                        <h2 className="text-xl font-bold text-white mb-4">Trending Videos</h2>
                        <TrendingGrid
                            videos={filteredVideos}
                            isFavorite={isFavorite}
                            onPlay={handlePlayVideo}
                            onFavorite={handleAddToFavorites}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        />
                    </>
                )}

                {/* STATE 2: Search Results */}
                {hasQuery && (
                    <div className="search-results">
                        {/* ✅ Show loading spinner while searching */}
                        {isSearching ? (
                            <div className="text-center py-12">
                                <div className="w-10 h-10 border-4 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-gray-400 text-sm">Searching...</p>
                            </div>
                        ) : (
                            <>
                                {/* ✅ Featured Result - Only show if video exists */}
                                {featuredVideo && (
                                    <FeaturedResult
                                        video={featuredVideo}
                                        isFavorite={isFavorite}
                                        onPlay={handlePlayVideo}
                                        onFavorite={handleAddToFavorites}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    />
                                )}

                                {/* ✅ Related Results */}
                                {relatedVideos.length > 0 && (
                                    <RelatedResults
                                        videos={relatedVideos}
                                        isFavorite={isFavorite}
                                        onPlay={handlePlayVideo}
                                        onFavorite={handleAddToFavorites}
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    />
                                )}

                                {/* ✅ No Results */}
                                {filteredVideos.length === 0 && (
                                    <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-white/5">
                                        <i className="fas fa-search-minus text-4xl text-gray-600 mb-3 block"></i>
                                        <p className="text-gray-400 text-sm">No videos found matching "{query}"</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {showPlayer && selectedVideo && (
                <VideoPlayer video={selectedVideo} onClose={() => setShowPlayer(false)} />
            )}

            <Footer />
        </div>
    );
}