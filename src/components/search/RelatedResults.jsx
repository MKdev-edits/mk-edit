// src/components/search/RelatedResults.jsx
import ResultItem from './ResultItem';

export default function RelatedResults({
    videos,
    isFavorite,
    onPlay,
    onFavorite,
    onTouchStart,
    onTouchMove,
    onTouchEnd
}) {
    if (!videos || videos.length === 0) return null;

    return (
        <div className="related-results">
            <h3 className="related-title">Related Videos</h3>
            {videos.map((video) => (
                <ResultItem
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