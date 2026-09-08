// src/components/search/SearchBar.jsx
export default function SearchBar({ query, setQuery, onSearch, onClear }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) onSearch();
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos, descriptions, artists..."
                    className="w-full bg-zinc-900 text-white placeholder-gray-500 pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-supabase-green focus:ring-2 focus:ring-supabase-green/20 transition-all"
                />
                {query && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </form>
    );
}