// src/components/search/FeaturedResult.jsx
import { getThumbnail } from "../../utils/thumbnail";

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