// src/pages/Dashboard/FeedbackTab.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../utils/toast';

export default function FeedbackTab() {
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);       // [{ video, comments: [] }]
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});   // { [videoId]: true }

    useEffect(() => {
        if (user?.id) fetchFeedback();
    }, [user?.id]);

    const fetchFeedback = async () => {
        setLoading(true);

        // 1. Get all videos owned by this editor
        const { data: videos } = await supabase
            .from('videos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!videos || videos.length === 0) {
            setGroups([]);
            setLoading(false);
            return;
        }

        // 2. Get all feedback for those videos
        const videoIds = videos.map(v => v.id);
        const { data: comments } = await supabase
            .from('video_feedback')
            .select('*')
            .in('video_id', videoIds)
            .order('timestamp_seconds', { ascending: true });

        // 3. Group comments by video
        const commentsByVideo = {};
        (comments || []).forEach(c => {
            if (!commentsByVideo[c.video_id]) commentsByVideo[c.video_id] = [];
            commentsByVideo[c.video_id].push(c);
        });

        const grouped = videos.map(v => ({
            video: v,
            comments: commentsByVideo[v.id] || [],
        }));

        setGroups(grouped);
        setLoading(false);
    };

    const toggleExpand = (videoId) => {
        setExpanded(prev => ({ ...prev, [videoId]: !prev[videoId] }));
    };

    const openReview = (videoId, seconds) => {
        const url = `${window.location.origin}/review/${videoId}?t=${Math.floor(seconds)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const copyLink = (e, videoId) => {
        e.stopPropagation();
        const url = `${window.location.origin}/review/${videoId}`;
        navigator.clipboard.writeText(url);
        showToast('Review link copied!');
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                <i className="fas fa-comments text-5xl text-gray-600 mb-4"></i>
                <p className="text-gray-400 text-sm">No videos yet. Add one to start collecting feedback.</p>
            </div>
        );
    }

    const totalComments = groups.reduce((sum, g) => sum + g.comments.length, 0);

    return (
        <div>
            {/* Summary bar */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/[0.03] rounded-2xl border border-white/10">
                <div className="flex items-center gap-2">
                    <i className="fas fa-comments text-supabase-green"></i>
                    <span className="text-white text-sm font-medium">{totalComments} total comments</span>
                </div>
                <span className="text-gray-500 text-xs">across {groups.length} videos</span>
            </div>

            {/* Video groups */}
            <div className="space-y-3">
                {groups.map(({ video, comments }) => {
                    const isOpen = expanded[video.id];
                    const hasComments = comments.length > 0;

                    return (
                        <div
                            key={video.id}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
                        >
                            {/* Header row */}
                            <button
                                onClick={() => hasComments && toggleExpand(video.id)}
                                className={`w-full flex items-center gap-4 p-4 text-left ${hasComments ? 'hover:bg-white/[0.02] cursor-pointer' : 'cursor-default'}`}
                            >
                                {/* Thumbnail */}
                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                                    <img
                                        src={video.thumbnail_url || `https://img.youtube.com/vi/${extractYouTubeId(video.video_url)}/mqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/160x90/1a1a2e/8b5cf6?text=🎬'}
                                    />
                                </div>

                                {/* Title + meta */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white text-sm font-medium line-clamp-1">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {hasComments
                                            ? `${comments.length} comment${comments.length === 1 ? '' : 's'} · last ${new Date(comments[comments.length - 1].created_at).toLocaleDateString()}`
                                            : 'No comments yet'}
                                    </p>
                                </div>

                                {/* Badge + chevron */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {hasComments && (
                                        <span className="px-2.5 py-1 rounded-full bg-supabase-green/20 text-supabase-green text-xs font-medium">
                                            {comments.length}
                                        </span>
                                    )}
                                    <button
                                        onClick={(e) => copyLink(e, video.id)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                        title="Copy review link"
                                    >
                                        <i className="fas fa-link text-xs text-gray-400"></i>
                                    </button>
                                    {hasComments && (
                                        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-xs text-gray-500 transition-transform`}></i>
                                    )}
                                </div>
                            </button>

                            {/* Comments list */}
                            {isOpen && hasComments && (
                                <div className="border-t border-white/5 p-3 space-y-1.5">
                                    {comments.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => openReview(video.id, c.timestamp_seconds)}
                                            className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all flex gap-3 group"
                                        >
                                            <div className="flex-shrink-0 font-mono text-xs px-2 py-1 rounded-md bg-supabase-green/20 text-supabase-green h-fit">
                                                {formatTime(c.timestamp_seconds)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 mb-1">
                                                    <span className="text-white font-medium">{c.client_name}</span>
                                                    <span className="ml-2 text-gray-500">
                                                        {new Date(c.created_at).toLocaleDateString()}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-200">{c.comment}</p>
                                            </div>
                                            <i className="fas fa-external-link-alt text-xs text-gray-500 group-hover:text-supabase-green opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-1"></i>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Extract YouTube ID for fallback thumbnail
function extractYouTubeId(url) {
    if (!url) return '';
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const p of patterns) {
        const match = url.match(p);
        if (match?.[1]) return match[1];
    }
    return '';
}