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
            <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-video text-2xl text-gray-500"></i>
                </div>
                <p className="text-gray-400 text-sm">No videos here yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-6">
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