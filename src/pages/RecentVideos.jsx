import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import VideoCard from '../components/common/VideoCard';
import Footer from '../components/common/Footer';

export default function RecentVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentVideos();
    }, []);

    const fetchRecentVideos = async () => {
        setLoading(true);
        // Get videos from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data } = await supabase
            .from('videos')
            .select('*')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: false });

        setVideos(data || []);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-20 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-900 rounded-2xl aspect-square animate-pulse"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-white mb-2">Recent Videos</h1>
                <p className="text-gray-400 mb-6">Added in the last 7 days ({videos.length} videos)</p>

                {videos.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl">
                        <i className="fas fa-clock text-5xl text-gray-500 mb-3"></i>
                        <p className="text-gray-400">No videos added in the last 7 days</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {videos.map(video => <VideoCard key={video.id} video={video} />)}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}