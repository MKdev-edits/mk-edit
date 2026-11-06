// src/components/editor/EditorTabs.jsx
export default function EditorTabs({ tabs, activeTab, onTabChange }) {
    if (!tabs || tabs.length === 0) {
        return (
            <div className="flex flex-nowrap gap-2 mb-6 pb-3 overflow-x-auto scrollbar-hide border-b border-white/10">
                <div className="text-gray-400 text-sm">No tabs available</div>
            </div>
        );
    }

    return (
        <div className="flex flex-nowrap gap-2 mb-6 pb-3 overflow-x-auto scrollbar-hide border-b border-white/10">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all md:text-sm text-[12px] whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-supabase-green text-white shadow-lg shadow-supabase-green/25'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <i className={`${tab.icon} text-xs`}></i>
                    {tab.label}
                </button>
            ))}
        </div>
    );
}