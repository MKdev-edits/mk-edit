// src/pages/Dashboard/TimestampsTab.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../utils/toast';

export default function TimestampsTab() {
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | has-comments | no-comments

    useEffect(() => {
        if (user?.id) fetchFeedback();
    }, [user?.id]);

    const fetchFeedback = async () => {
        setLoading(true);

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

        const videoIds = videos.map(v => v.id);
        const { data: comments } = await supabase
            .from('video_feedback')
            .select('*')
            .in('video_id', videoIds)
            .order('created_at', { ascending: false });

        const byVideo = {};
        (comments || []).forEach(c => {
            if (!byVideo[c.video_id]) byVideo[c.video_id] = [];
            byVideo[c.video_id].push(c);
        });

        const grouped = videos.map(v => ({
            video: v,
            comments: byVideo[v.id] || [],
        }));

        setGroups(grouped);
        setLoading(false);
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

    const timeAgo = (iso) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const filteredGroups = groups.filter(g => {
        if (filter === 'has-comments') return g.comments.length > 0;
        if (filter === 'no-comments') return g.comments.length === 0;
        return true;
    });

    const totalComments = groups.reduce((sum, g) => sum + g.comments.length, 0);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <i className="far fa-clock text-2xl text-gray-500"></i>
                </div>
                <p className="text-gray-400 text-sm">No videos yet. Add one to start collecting timestamps.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-supabase-green/15 border border-supabase-green/30">
                    <i className="far fa-clock text-supabase-green text-xs"></i>
                    <span className="text-supabase-green text-xs font-medium">{totalComments} total</span>
                </div>
                <span className="text-gray-500 text-xs">across {groups.length} videos</span>

                <div className="ml-auto flex items-center gap-1.5">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'has-comments', label: 'With comments' },
                        { id: 'no-comments', label: 'Silent' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === f.id
                                    ? 'bg-white/15 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Groups */}
            <div className="space-y-4">
                {filteredGroups.map(({ video, comments }) => (
                    <div
                        key={video.id}
                        className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
                    >
                        {/* Video header */}
                        <div className="flex items-center gap-4 p-4">
                            <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                                <img
                                    src={video.thumbnail_url || `https://img.youtube.com/vi/${extractYouTubeId(video.video_url)}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/192x128/1a1a2e/8b5cf6?text=🎬'}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-white text-sm font-semibold line-clamp-1">
                                    {video.title}
                                </h3>
                                <p className="text-gray-500 text-xs mt-1">
                                    {comments.length > 0
                                        ? `${comments.length} timestamp${comments.length === 1 ? '' : 's'} · latest ${timeAgo(comments[0].created_at)}`
                                        : 'No comments yet'
                                    }
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={(e) => copyLink(e, video.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-all"
                                    title="Copy review link"
                                >
                                    <i className="fas fa-link text-[10px]"></i>
                                    <span className="hidden sm:inline">Copy link</span>
                                </button>
                                <button
                                    onClick={() => openReview(video.id, 0)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-supabase-green/15 hover:bg-supabase-green/25 text-xs text-supabase-green transition-all"
                                >
                                    <i className="fas fa-external-link-alt text-[10px]"></i>
                                    <span className="hidden sm:inline">Open</span>
                                </button>
                            </div>
                        </div>

                        {/* Comments list */}
                        {comments.length > 0 && (
                            <div className="border-t border-white/5 p-3 space-y-2">
                                {comments.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => openReview(video.id, c.timestamp_seconds)}
                                        className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all flex gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs font-bold">
                                                {(c.client_name || 'A')[0].toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-white text-xs font-medium">
                                                    {c.client_name}
                                                </span>
                                                <span className="text-gray-500 text-[10px]">
                                                    {timeAgo(c.created_at)}
                                                </span>
                                                <span className="ml-auto font-mono text-xs px-2 py-0.5 rounded-md bg-supabase-green/20 text-supabase-green">
                                                    {formatTime(c.timestamp_seconds)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-200 line-clamp-2">
                                                {c.comment}
                                            </p>
                                        </div>

                                        <i className="fas fa-play-circle text-gray-500 group-hover:text-supabase-green text-lg self-center opacity-0 group-hover:opacity-100 transition-all"></i>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredGroups.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                    No videos match this filter.
                </div>
            )}
        </div>
    );
}

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