// src/components/editor/EditorVideoGrid.jsx
import EditorVideoCard from './EditorVideoCard';

export default function EditorVideoGrid({
    videos,
    onPlayVideo,
    onEditVideo,
    onDeleteVideo
}) {
    const videoList = videos || [];

    if (videoList.length === 0) {
        return (
            <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
                <i className="fas fa-video text-4xl text-gray-500 mb-3 block"></i>
                <p className="text-gray-400 text-sm">No videos here yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {videoList.map((video) => (
                <EditorVideoCard
                    key={video.id}
                    video={video}
                    onPlay={() => onPlayVideo(video)}
                    onEdit={onEditVideo}
                    onDelete={onDeleteVideo}
                />
            ))}
        </div>
    );
}