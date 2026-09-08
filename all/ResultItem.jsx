// src/components/search/ResultItem.jsx
export default function ResultItem({
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

    const isFav = isFavorite(video.id);

    return (
        <div
            className="result-item"
            onTouchStart={(e) => onTouchStart(e, video)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="result-thumbnail" onClick={() => onPlay(video)}>
                <img
                    src={getThumbnail(video)}
                    alt={video.title}
                    className="result-thumbnail-img"
                    loading="lazy"
                />
            </div>
            <div className="result-info" onClick={() => onPlay(video)}>
                <h4 className="result-title">{video.title}</h4>
                <p className="result-description">{video.description || 'No description'}</p>
            </div>
            <div className="result-actions">
                <span className="result-badge">VIDEO</span>
                <button
                    onClick={(e) => onFavorite(video.id, e)}
                    className="result-add-btn"
                >
                    <i className={`${isFav ? 'fas' : 'far'} fa-plus-circle`}></i>
                </button>
            </div>
        </div>
    );
}