// src/components/search/TrendingGrid.jsx
import TrendingCard from './TrendingCard';

export default function TrendingGrid({
    videos,
    isFavorite,
    onPlay,
    onFavorite,
    onTouchStart,
    onTouchMove,
    onTouchEnd
}) {
    if (!videos || videos.length === 0) {
        return (
            <div className="text-center py-12 bg-zinc-950 rounded-2xl border border-white/5">
                <i className="fas fa-video text-4xl text-gray-600 mb-3 block"></i>
                <p className="text-gray-400 text-sm">No videos available</p>
            </div>
        );
    }

    return (
        <div className="spotify-grid">
            {videos.slice(0, 6).map((video) => (
                <TrendingCard
                    key={video.id}
                    video={video}
                    isFavorite={isFavorite}
                    onPlay={onPlay}
                    onFavorite={onFavorite}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                />
            ))}
        </div>
    );
}