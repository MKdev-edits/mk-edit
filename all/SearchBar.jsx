import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Load recent searches on mount
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Live search query logic (Debounced)
    useEffect(() => {
        const searchVideos = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            const { data } = await supabase
                .from('videos')
                .select('*')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(5);

            setResults(data || []);
        };

        const debounce = setTimeout(searchVideos, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleFocus = () => {
        // Spotify style: On mobile, clicking the search bar redirects straight to the dedicated page
        if (window.innerWidth < 768) {
            navigate('/search');
        } else {
            setShowDropdown(true);
        }
    };

    const saveToRecent = (searchQuery) => {
        if (!searchQuery.trim()) return;
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const handleSelectSearch = (searchItem) => {
        saveToRecent(searchItem);
        setShowDropdown(false);
        setQuery('');
        navigate(`/search?q=${encodeURIComponent(searchItem)}`);
    };

    const clearRecent = (e) => {
        e.stopPropagation();
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl z-50">
            {/* Search Input */}
            <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    placeholder="Search videos, descriptions..."
                    className="w-full bg-white/10 text-white placeholder-gray-400 text-sm pl-11 pr-4 py-2 rounded-full border border-white/10 focus:outline-none focus:border-supabase-green focus:ring-1 focus:ring-supabase-green transition-all"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <i className="fas fa-times text-xs"></i>
                    </button>
                )}
            </div>

            {/* Desktop Only Dropdown Menu */}
            {showDropdown && (window.innerWidth >= 768) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto scrollbar-hide animate-scale-in">

                    {/* Live Results Mode */}
                    {query.trim().length >= 2 ? (
                        <div className="p-2">
                            <p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5">Search Results</p>
                            {results.length > 0 ? (
                                results.map((video) => (
                                    <button
                                        key={video.id}
                                        onClick={() => handleSelectSearch(video.title)}
                                        className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center gap-3 rounded-xl transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                                            <img
                                                src={video.thumbnail_url || `https://img.youtube.com/vi/${extractYouTubeId(video.video_url)}/hqdefault.jpg`}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white text-sm font-medium truncate group-hover:text-supabase-green transition-colors">{video.title}</div>
                                            <div className="text-gray-400 text-xs truncate">{video.description}</div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-gray-500 text-xs">
                                    No videos found matching "{query}"
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Default / Recent Searches Mode */
                        <div className="p-2">
                            {recentSearches.length > 0 ? (
                                <>
                                    <div className="flex justify-between items-center px-3 py-1.5">
                                        <p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase">Recent Searches</p>
                                        <button onClick={clearRecent} className="text-gray-500 hover:text-red-400 text-xs font-medium transition-colors">Clear all</button>
                                    </div>
                                    {recentSearches.map((search, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectSearch(search)}
                                            className="w-full px-3 py-2 text-left hover:bg-white/5 text-gray-300 hover:text-white text-sm flex items-center gap-3 rounded-xl transition-colors"
                                        >
                                            <i className="fas fa-history text-gray-500 text-xs"></i>
                                            <span className="truncate">{search}</span>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <div className="px-4 py-6 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                                    <i className="fas fa-search text-gray-600 text-lg"></i>
                                    <span>Search for titles, topics, tags or criteria.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}