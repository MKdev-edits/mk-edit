// src/pages/viewer/LikedVideos.jsx
import { useState, useEffect } from 'react';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { supabase } from '../../lib/supabase';
import VideoCard from '../../components/common/VideoCard';
import { Link } from 'react-router-dom';

export default function LikedVideos() {
    const { viewer } = useViewerAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikedVideos();
    }, [viewer]);

    const fetchLikedVideos = async () => {
        if (!viewer) return;
        setLoading(true);

        const { data } = await supabase
            .from('video_likes')
            .select('video_id, videos(*)')
            .eq('viewer_id', viewer.id)
            .order('created_at', { ascending: false });

        if (data) {
            const videoList = data.map(item => item.videos).filter(v => v);
            setVideos(videoList);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-900 rounded-2xl aspect-square animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">❤️ Liked Videos</h1>
            <p className="text-gray-400 text-sm mb-6">{videos.length} videos you've liked</p>

            {videos.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <i className="fas fa-heart text-5xl text-gray-500 mb-3"></i>
                    <p className="text-gray-400">You haven't liked any videos yet</p>
                    <Link to="/" className="text-supabase-green text-sm hover:underline inline-block mt-2">
                        Browse videos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {videos.map(video => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}