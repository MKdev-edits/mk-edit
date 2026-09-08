// src/components/editor/EditorVideoCard.jsx
import { useState } from 'react';
import { getThumbnail } from '../../utils/thumbnail';

export default function EditorVideoCard({ video, onPlay, onEdit, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    if (!video) return null;

    const getPlatformIcon = () => {
        const p = video.platform?.toLowerCase() || '';
        if (p === 'youtube') return 'fab fa-youtube text-red-500';
        if (p === 'tiktok') return 'fab fa-tiktok text-pink-400';
        if (p === 'instagram') return 'fab fa-instagram text-pink-500';
        if (p === 'twitter' || p === 'x') return 'fab fa-twitter text-blue-400';
        return 'fas fa-video text-gray-400';
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setShowMenu(false);
        if (onEdit) onEdit(video);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowMenu(false);
        if (onDelete) onDelete(video.id);
    };

    return (
        <div
            className="group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onPlay}
        >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                <img
                    src={getThumbnail(video)}
                    alt={video.title || 'Untitled'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />

                {/* ✅ 3-Dot Menu - Top Right */}
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={toggleMenu}
                        className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all flex items-center justify-center"
                    >
                        <i className="fas fa-ellipsis-v text-white text-sm"></i>
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                            >
                                <i className="fas fa-edit text-xs"></i>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/10 transition-colors"
                            >
                                <i className="fas fa-trash-alt text-xs"></i>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <div className="w-10 h-10 bg-supabase-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-100 scale-75">
                        <i className="fas fa-play text-white text-sm ml-0.5"></i>
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                    {video.is_vip && (
                        <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-yellow-500/20 text-yellow-400 backdrop-blur-sm">
                            <i className="fas fa-crown text-[8px] mr-0.5"></i>VIP
                        </span>
                    )}
                    {video.is_top_rated && (
                        <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-supabase-green/20 text-supabase-green backdrop-blur-sm">
                            <i className="fas fa-star text-[8px] mr-0.5"></i>Top
                        </span>
                    )}
                </div>

                {/* Platform icon */}
                <div className="absolute bottom-2 left-2">
                    <i className={`${getPlatformIcon()} text-sm drop-shadow-lg`}></i>
                </div>
            </div>

            <div className="mt-2">
                <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-supabase-green transition-colors">
                    {video.title || 'Untitled'}
                </h3>
                <p className="text-gray-400 text-xs">{video.views || 0} views</p>
            </div>
        </div>
    );
}