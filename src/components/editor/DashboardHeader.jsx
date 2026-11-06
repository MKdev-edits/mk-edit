// src/components/editor/DashboardHeader.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import EditProfileModal from './EditProfileModal';
import ProfileImageUpload from './ProfileImageUpload';
import { useDominantColor } from '../../hooks/useDominantColor';

export default function DashboardHeader({ onSignOut }) {
    const { profile, user } = useAuth();
    const { palette } = useDominantColor(profile?.profile_image || null);
    const [stats, setStats] = useState({
        videos: 0,
        likes: 0,
        followers: 0,
    });
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);

    // ✅ Fetch stats
    useEffect(() => {
        if (user?.id) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Get videos count
            const { count: videosCount } = await supabase
                .from('videos')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            // Get total likes from all videos
            const { data: videosData } = await supabase
                .from('videos')
                .select('likes')
                .eq('user_id', user.id);

            const totalLikes = videosData?.reduce((sum, v) => sum + (v.likes || 0), 0) || 0;

            // Get followers count
            const { count: followersCount } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('editor_id', user.id);

            setStats({
                videos: videosCount || 0,
                likes: totalLikes,
                followers: followersCount || 0,
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Format numbers
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    // ✅ Get initials
    const getInitials = (name) => {
        if (!name) return 'E';
        return name.charAt(0).toUpperCase();
    };

    // ✅ Profile image click handler
    const handleProfileImageClick = () => {
        setShowImageUpload(true);
    };

    return (
        <>
            <div className="flex items-start gap-4 bg-[#0F0F14] mb-8 pb-2 flex-wrap">
                {/* ✅ Profile Icon - Left */}
                <div className="flex-shrink-0">
                    <ProfileImageUpload
                        isOpen={showImageUpload}
                        onClose={() => setShowImageUpload(false)}
                        onSuccess={() => {
                            setShowImageUpload(false);
                            // Refresh page to show new image
                            window.location.reload();
                        }}
                    />

                    <div
                        className="relative w-20 h-20 md:w-30 md:h-30 rounded-full overflow-hidden cursor-pointer group border-2 border-supabase-green/50 hover:border-supabase-green transition-all"
                        style={palette ? {
                            boxShadow: `0 0 10px ${palette.main}, 0 0 30px ${palette.dark}`,
                        } : {}}
                        onClick={handleProfileImageClick}
                    >
                        {profile?.profile_image ? (
                            <img
                                src={profile.profile_image}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                <span className="text-white text-2xl md:text-3xl font-bold">
                                    {getInitials(profile?.name)}
                                </span>
                            </div>
                        )}

                        {/* ✅ Camera Overlay - Desktop hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <i className="fas fa-camera text-white text-lg md:text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* ✅ Info - Right */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white">
                                {profile?.name || 'Editor'}
                            </h1>
                        </div>

                        {/* ✅ Sign Out - Top Right */}
                        <button
                            onClick={onSignOut}
                            className="flex items-center md:gap-2 px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all text-xs flex-shrink-0"
                        >
                            <i className="fas fa-sign-out-alt"></i> Sign Out
                        </button>
                    </div>

                    {/* ✅ Buttons Row */}
                    <div className="flex flex-wrap mt-3">
                        {/* Edit Profile */}
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center md:gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg text-xs transition-all"
                        >
                            <i className="fas fa-user-edit text-supabase-green text-xs"></i>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ Edit Profile Modal */}
            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={() => {
                    setShowEditModal(false);
                    window.location.reload();
                }}
            />
        </>
    );
}