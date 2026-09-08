// src/pages/Dashboard/index.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Components
import DashboardHeader from '../../components/editor/DashboardHeader';
import EditorTabs from '../../components/editor/EditorTabs';
import EditorPlatformContent from '../../components/editor/EditorPlatformContent';
import EditorAddVideoModal from '../../components/editor/EditorAddVideoModal';

// Existing tabs
import PrivateTab from './PrivateTab';
import SocialTab from './SocialTab';

export default function Dashboard() {
    const { user, loading, profile, initialized, signOut } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('videos');
    const [allVideos, setAllVideos] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loadingVideos, setLoadingVideos] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [isPlatformSpecific, setIsPlatformSpecific] = useState(false);
    // src/pages/Dashboard/index.jsx
    // ✅ Add this state

    const [heroVideo, setHeroVideo] = useState(null);
    const [heroVideoUrl, setHeroVideoUrl] = useState('');

    // ✅ Add this function for MOV support
    const handleHeroVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Please select a video file');
            return;
        }

        if (file.size > 100 * 1024 * 1024) {  // 100MB limit
            alert('Video must be less than 100MB');
            return;
        }

        // ✅ Get file extension
        const fileExt = file.name.split('.').pop().toLowerCase();
        const allowedExts = ['mov', 'mp4', 'webm', 'avi', 'mkv'];
        if (!allowedExts.includes(fileExt)) {
            alert('Please upload a valid video file (MOV, MP4, WEBM, AVI, MKV)');
            return;
        }

        try {
            const fileName = `hero-video.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('hero-video')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('hero-video')
                .getPublicUrl(fileName);

            setHeroVideoUrl(publicUrl);
            alert(`✅ Hero video (${fileExt.toUpperCase()}) uploaded successfully!`);

        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload video');
        }
    };

    useEffect(() => {
        if (!loading && initialized && !user) {
            navigate('/login');
        }
    }, [user, loading, initialized, navigate]);

    useEffect(() => {
        if (user?.id) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoadingVideos(true);
        try {
            const { data: videosData } = await supabase
                .from('videos')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setAllVideos(videosData || []);

            if (videosData) {
                const uniquePlatforms = [...new Set(
                    videosData.map(v => v.platform).filter(p => p && p !== 'other')
                )];
                setPlatforms(uniquePlatforms);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoadingVideos(false);
        }
    };

    const handleAddVideo = async (form) => {
        try {
            const platform = form.platform === 'auto' ? detectPlatform(form.video_url) : form.platform;
            const { error } = await supabase.from('videos').insert([{
                user_id: user.id,
                title: form.title,
                description: form.description,
                video_url: form.video_url,
                platform: platform,
                is_vip: form.is_vip,
                is_top_rated: form.is_top_rated,
            }]);

            if (!error) {
                setShowAddModal(false);
                fetchAllData();
            }
        } catch (err) {
            console.error('Error adding video:', err);
        }
    };

    const handlePlayVideo = (video) => {
        navigate(`/video/${video.id}`);
    };

    const handleEditVideo = (video) => {
        setEditingVideo(video);
        setSelectedPlatform(video.platform);
        setIsPlatformSpecific(true);
        setShowAddModal(true);
    };

    const handleDeleteVideo = async (videoId) => {
        if (confirm('Delete this video permanently?')) {
            await supabase.from('videos').delete().eq('id', videoId);
            fetchAllData();
        }
    };

    const detectPlatform = (url) => {
        if (!url) return 'other';
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
        if (lowerUrl.includes('tiktok.com')) return 'tiktok';
        if (lowerUrl.includes('instagram.com')) return 'instagram';
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
        if (lowerUrl.includes('facebook.com')) return 'facebook';
        if (lowerUrl.includes('discord.com')) return 'discord';
        return 'other';
    };

    // ✅ Tabs - Profile Tab REMOVED
    const getTabs = () => {
        const baseTabs = [
            { id: 'videos', label: 'Videos', icon: 'fas fa-video' },
            { id: 'private', label: 'Private Storage', icon: 'fas fa-lock' },
            { id: 'social', label: 'Social Links', icon: 'fas fa-share-alt' },
        ];

        const platformTabs = platforms.map(p => ({
            id: p,
            label: p.charAt(0).toUpperCase() + p.slice(1),
            icon: getPlatformIcon(p),
        }));

        return [...baseTabs, ...platformTabs];
    };

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p === 'youtube') return 'fab fa-youtube';
        if (p === 'tiktok') return 'fab fa-tiktok';
        if (p === 'instagram') return 'fab fa-instagram';
        if (p === 'twitter' || p === 'x') return 'fab fa-twitter';
        if (p === 'facebook') return 'fab fa-facebook';
        if (p === 'discord') return 'fab fa-discord';
        return 'fas fa-video';
    };

    const renderContent = () => {
        if (platforms.includes(activeTab)) {
            return (
                <EditorPlatformContent
                    videos={allVideos}
                    platform={activeTab}
                    onPlayVideo={handlePlayVideo}
                    onAddVideo={() => {
                        setSelectedPlatform(activeTab);
                        setIsPlatformSpecific(true);
                        setShowAddModal(true);
                    }}
                    onEditVideo={handleEditVideo}
                    onDeleteVideo={handleDeleteVideo}
                />
            );
        }

        switch (activeTab) {
            case 'videos':
                return (
                    <EditorPlatformContent
                        videos={allVideos}
                        platform="all"
                        onPlayVideo={handlePlayVideo}
                        onAddVideo={() => {
                            setSelectedPlatform(null);
                            setIsPlatformSpecific(false);
                            setShowAddModal(true);
                        }}
                        onEditVideo={handleEditVideo}
                        onDeleteVideo={handleDeleteVideo}
                    />
                );
            case 'private':
                return <PrivateTab />;
            case 'social':
                return <SocialTab />;
            default:
                return null;
        }
    };

    if (loading || !initialized) {
        return (
            <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const tabs = getTabs();

    return (
        <div>

            {/* ✅ Hero Video Upload */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-8">
                <h3 className="text-white font-semibold text-lg mb-2">Hero Video</h3>
                <p className="text-gray-400 text-sm mb-4">Upload a video for the landing page hero section.</p>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-all">
                        <i className="fas fa-upload mr-2"></i>
                        Upload Video
                        <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleHeroVideoUpload}
                        />
                    </label>
                    {heroVideoUrl && (
                        <span className="text-supabase-green text-sm">✅ Video uploaded</span>
                    )}
                </div>
                {heroVideoUrl && (
                    <div className="mt-4">
                        <video src={heroVideoUrl} controls className="w-full max-w-md rounded-lg border border-white/10" />
                    </div>
                )}
            </div>
            {/* ✅ New Dashboard Header */}
            <DashboardHeader onSignOut={signOut} />

            {/* ✅ Tabs - Profile Tab Removed */}
            <EditorTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Content */}
            {loadingVideos ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white/5 rounded-lg aspect-video animate-pulse"></div>
                    ))}
                </div>
            ) : (
                renderContent()
            )}

            {/* Add Video Modal */}
            <EditorAddVideoModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setSelectedPlatform(null);
                    setIsPlatformSpecific(false);
                    setEditingVideo(null);
                }}
                onSubmit={handleAddVideo}
                platform={selectedPlatform}
                isPlatformSpecific={isPlatformSpecific}
                editingVideo={editingVideo}
            />
        </div>
    );
}