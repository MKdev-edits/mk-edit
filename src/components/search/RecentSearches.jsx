// src/components/search/RecentSearches.jsx
export default function RecentSearches({ searches, onSelect, onClear }) {
    if (searches.length === 0) return null;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wide">Recent Searches</h3>
                <button onClick={onClear} className="text-gray-500 hover:text-red-400 text-xs font-medium">
                    Clear All
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {searches.map((search, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(search)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-sm text-gray-200 transition-colors"
                    >
                        <i className="fas fa-history text-gray-500 text-xs"></i>
                        {search}
                    </button>
                ))}
            </div>
        </div>
    );
}