import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Hero({ onExplore }) {
    const [editorData, setEditorData] = useState({
        name: 'Video Editor',
        tagline: 'Curating the finest video content',
        profile_image: null,
        about: ''
    });
    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        youtubeCount: 0,
        tiktokCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEditorProfile();
        fetchVideoStats();
    }, []);

    const fetchEditorProfile = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .limit(1)
                .single();

            if (data) {
                setEditorData({
                    name: data.name || 'Video Editor',
                    tagline: data.tagline || 'Curating the finest video content',
                    profile_image: data.profile_image,
                    about: data.about || ''
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchVideoStats = async () => {
        try {
            const { data } = await supabase
                .from('videos')
                .select('*');

            if (data) {
                const totalVideos = data.length;
                const totalViews = data.reduce((sum, v) => sum + (v.views || 0), 0);
                const youtubeCount = data.filter(v => v.platform === 'youtube').length;
                const tiktokCount = data.filter(v => v.platform === 'tiktok').length;

                setStats({ totalVideos, totalViews, youtubeCount, tiktokCount });
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { name: 'YouTube', icon: 'fab fa-youtube', color: 'hover:text-red-500', filter: 'youtube' },
        { name: 'TikTok', icon: 'fab fa-tiktok', color: 'hover:text-pink-400', filter: 'tiktok' },
        { name: 'Top Rated', icon: 'fas fa-star', color: 'hover:text-yellow-400', filter: 'top-rated' },
        { name: 'VIP', icon: 'fas fa-crown', color: 'hover:text-purple-400', filter: 'vip' },
    ];

    const scrollToCategory = (filter) => {
        if (filter === 'youtube') {
            document.getElementById('youtube-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (filter === 'tiktok') {
            document.getElementById('tiktok-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (filter === 'top-rated') {
            document.getElementById('top-rated-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (filter === 'vip') {
            document.getElementById('vip-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-black pt-16">
                <div className="w-12 h-12 border-4 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-supabase-green/15 via-black to-purple-600/15 animate-pulse" />

            {/* Simple Grid Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(13,148,136,0.15)_1px,_transparent_1px)] bg-[length:40px_40px]" />
            </div>

            {/* Floating Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-supabase-green/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-supabase-green/5 to-purple-500/5 rounded-full blur-3xl" />

            {/* Main Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Profile Image - Centered */}
                {editorData.profile_image && (
                    <div className="flex justify-center mb-6 animate-bounce">
                        <img
                            src={editorData.profile_image}
                            alt={editorData.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-supabase-green/50 shadow-2xl shadow-supabase-green/25 cursor-pointer"
                            onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
                        />
                    </div>
                )}

                {/* Main Title */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-white via-supabase-green to-white bg-clip-text text-transparent">
                        {editorData.name}
                    </span>
                    <span className="block text-white mt-2">'s Portfolio</span>
                </h1>

                {/* Tagline */}
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                    {editorData.tagline}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                    <div className="backdrop-blur-2xl bg-white/5 rounded-2xl px-5 py-2 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                        <span className="text-2xl font-bold text-white">{stats.totalVideos}</span>
                        <span className="text-gray-400 text-sm ml-1">Videos</span>
                    </div>
                    <div className="backdrop-blur-2xl bg-white/5 rounded-2xl px-5 py-2 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                        <span className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm ml-1">Views</span>
                    </div>
                    {stats.youtubeCount > 0 && (
                        <div className="backdrop-blur-2xl bg-white/5 rounded-2xl px-5 py-2 border border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-all">
                            <i className="fab fa-youtube text-red-500"></i>
                            <span className="text-white font-medium">{stats.youtubeCount}</span>
                        </div>
                    )}
                    {stats.tiktokCount > 0 && (
                        <div className="backdrop-blur-2xl bg-white/5 rounded-2xl px-5 py-2 border border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-all">
                            <i className="fab fa-tiktok text-pink-400"></i>
                            <span className="text-white font-medium">{stats.tiktokCount}</span>
                        </div>
                    )}
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => scrollToCategory(cat.filter)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 backdrop-blur-2xl bg-white/5 hover:bg-white/10 border border-white/10 ${cat.color} cursor-pointer`}
                        >
                            <i className={`${cat.icon} text-sm`}></i>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="group px-8 py-3 bg-supabase-green hover:bg-supabase-green/80 rounded-full font-semibold text-white text-base transition-all transform hover:scale-105 shadow-lg shadow-supabase-green/25 flex items-center gap-2 justify-center cursor-pointer"
                    >
                        Browse Top Videos
                        <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <button
                        onClick={() => document.getElementById('vip-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="group px-8 py-3 backdrop-blur-2xl bg-white/10 hover:bg-white/20 rounded-full font-semibold text-white text-base transition-all transform hover:scale-105 border border-white/20 flex items-center gap-2 justify-center cursor-pointer"
                    >
                        <i className="fas fa-crown text-sm group-hover:scale-110 transition-transform"></i>
                        VIP Videos
                    </button>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => document.getElementById('top-rated-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1.5 h-2 bg-supabase-green rounded-full mt-2 animate-pulse" />
                    </div>
                    <p className="text-gray-500 text-xs mt-2">Scroll to explore</p>
                </div>
            </div>
        </div>
    );
}