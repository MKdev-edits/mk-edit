// src/components/editor/EditorVideoCard.jsx
import { useState } from 'react';
import { getThumbnail } from '../../utils/thumbnail';
import { showToast } from '../../utils/toast';

export default function EditorVideoCard({ video, onPlay, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    if (!video) return null;

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
        <div className="group cursor-pointer" onClick={onPlay}>

            {/* ✅ IMAGE — the only thing with rounded corners */}
            <div className="relative aspect-video rounded-lg bg-gray-900">
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <img
                        src={getThumbnail(video)}
                        alt={video.title || 'Untitled'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>

                {/* VIP badge — top left */}
                {video.is_vip && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/90 text-black">
                        <i className="fas fa-crown text-[9px]"></i>
                        VIP
                    </span>
                )}

                {/* Top Rated badge — top left, next to VIP */}
                {video.is_top_rated && (
                    <span className={`absolute top-2 ${video.is_vip ? 'left-16' : 'left-2'} flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-supabase-green/90 text-white`}>
                        <i className="fas fa-star text-[9px]"></i>
                        Top
                    </span>
                )}

                {/* 3-dot menu — top right, appears on hover */}
                <div className="absolute top-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={toggleMenu}
                        className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    >
                        <i className="fas fa-ellipsis-v text-white text-xs"></i>
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-36 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl py-1 overflow-hidden">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    const url = `${window.location.origin}/review/${video.id}`;
                                    navigator.clipboard.writeText(url);
                                    showToast('Review link copied!');
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-colors"
                            >
                                <i className="fas fa-link text-[10px] text-supabase-green"></i>
                                Copy review link
                            </button>
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-colors"
                            >
                                <i className="fas fa-edit text-[10px] text-supabase-green"></i>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-white/10 transition-colors"
                            >
                                <i className="fas fa-trash-alt text-[10px]"></i>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Play overlay — appears on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-supabase-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg shadow-supabase-green/50">
                        <i className="fas fa-play text-white text-sm ml-0.5"></i>
                    </div>
                </div>
            </div>

            {/* ✅ TEXT — plain, no wrapper, no background */}
            <div className="mt-2">
                <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-supabase-green transition-colors">
                    {video.title || 'Untitled'}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mt-0.5">
                    {video.description || 'No description added yet'}
                </p>
            </div>
        </div>
    );
}