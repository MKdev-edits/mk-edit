// src/pages/Dashboard/index.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../utils/toast';

// Components
import DashboardHeader from '../../components/editor/DashboardHeader';
import EditorTabs from '../../components/editor/EditorTabs';
import EditorPlatformContent from '../../components/editor/EditorPlatformContent';
import EditorAddVideoModal from '../../components/editor/EditorAddVideoModal';
import ReviewLinkModal from '../../components/editor/ReviewLinkModal';

// Tabs
import PrivateTab from './PrivateTab';
import SocialTab from './SocialTab';
import FeedbackTab from './FeedbackTab';
import TimestampsTab from './TimestampsTab';

export default function Dashboard() {
    const { user, loading, profile, initialized, signOut } = useAuth();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'videos';
    const [allVideos, setAllVideos] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loadingVideos, setLoadingVideos] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [isPlatformSpecific, setIsPlatformSpecific] = useState(false);
    const [justAddedVideo, setJustAddedVideo] = useState(null);

    useEffect(() => {
        if (!loading && initialized && !user) {
            navigate('/login');
        }
    }, [user, loading, initialized, navigate]);

    useEffect(() => {
        if (user?.id) {
            fetchAllData();
        }
    }, [user?.id]);

    const setActiveTab = (tabId) => {
        setSearchParams({ tab: tabId });
    };

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

    const handleAddVideo = async (form, createdVideo) => {
        if (editingVideo) {
            setShowAddModal(false);
            setEditingVideo(null);
            setSelectedPlatform(null);
            setIsPlatformSpecific(false);
            fetchAllData();
            return;
        }

        setShowAddModal(false);
        if (createdVideo) {
            setJustAddedVideo(createdVideo);
            setAllVideos(prev => [createdVideo, ...prev]);
        }
    };

    const handlePlayVideo = (video) => {
        showToast('Coming later');
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

    // ✅ Tabs
    const getTabs = () => {
        const baseTabs = [
            { id: 'videos', label: 'Videos', icon: 'fas fa-video' },
            { id: 'feedback', label: 'Feedback', icon: 'fas fa-comments' },
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
            case 'feedback':
                return <FeedbackTab />;
            case 'timestamps':
                return <TimestampsTab />;
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
            <div className="min-h-screen bg-[#0F0F14] pt-20 flex items-center justify-center">
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
        <div className="px-3 md:px-6 md:py-5">
            <DashboardHeader onSignOut={signOut} />

            <EditorTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {loadingVideos ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white/5 rounded-lg aspect-video animate-pulse"></div>
                    ))}
                </div>
            ) : (
                renderContent()
            )}

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

            {justAddedVideo && (
                <ReviewLinkModal
                    video={justAddedVideo}
                    onClose={() => setJustAddedVideo(null)}
                />
            )}
        </div>
    );
}