// src/components/search/FeaturedResult.jsx
export default function FeaturedResult({
    video,
    isFavorite,
    onPlay,
    onFavorite,
    onTouchStart,
    onTouchMove,
    onTouchEnd
}) {
    if (!video) return null;

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
            className="featured-result"
            onTouchStart={(e) => onTouchStart(e, video)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="featured-result-inner">
                <div className="featured-thumbnail">
                    <img src={getThumbnail(video)} alt={video.title} className="featured-thumbnail-img" />
                    <button onClick={() => onPlay(video)} className="featured-play-btn">
                        <i className="fas fa-play"></i>
                    </button>
                </div>
                <div className="featured-info">
                    <h2 className="featured-title">{video.title}</h2>
                    <p className="featured-description">{video.description || 'No description available'}</p>
                    <div className="featured-actions">
                        <button onClick={() => onPlay(video)} className="featured-action-btn play">
                            <i className="fas fa-play"></i> Play
                        </button>
                        <button
                            onClick={(e) => onFavorite(video.id, e)}
                            className={`featured-action-btn ${isFav ? 'liked' : ''}`}
                        >
                            <i className={`${isFav ? 'fas' : 'far'} fa-heart`}></i>
                            {isFav ? 'Liked' : 'Like'}
                        </button>
                        <button className="featured-action-btn share">
                            <i className="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}