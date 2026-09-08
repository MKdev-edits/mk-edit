// src/components/search/TrendingCard.jsx
import { useDominantColor } from '../../hooks/useDominantColor';

export default function TrendingCard({
    video,
    isFavorite,
    onPlay,
    onFavorite,
    onTouchStart,
    onTouchMove,
    onTouchEnd
}) {
    const getThumbnail = (video) => {
        if (video.thumbnail_url) return video.thumbnail_url;
        if (video.video_url?.includes('youtube.com')) {
            const id = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
            return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
        }
        return 'https://via.placeholder.com/400x225/1a1a2e/10B981?text=🎬';
    };

    const thumb = getThumbnail(video);
    const { color } = useDominantColor(thumb);
    const isFav = isFavorite(video.id);

    return (
        <div
            className="spotify-card group cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => onPlay(video)}
            onTouchStart={(e) => onTouchStart(e, video)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="spotify-card-image">
                <img src={thumb} alt={video.title} className="spotify-card-img" loading="lazy" />
                <div className="spotify-card-overlay">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPlay(video); }}
                        className="spotify-play-btn"
                    >
                        <i className="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div className="spotify-card-info">
                <h3 className="spotify-card-title">{video.title}</h3>
                <div className="spotify-card-meta">
                    <span>{video.views || 0} views</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onFavorite(video.id, e); }}
                        className="spotify-like-btn"
                    >
                        <i className={`${isFav ? 'fas' : 'far'} fa-heart`}></i>
                    </button>
                </div>
            </div>
        </div>
    );
}