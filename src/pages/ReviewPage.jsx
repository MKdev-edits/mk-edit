// src/pages/ReviewPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { detectPlatform, canPlayOnSite, getPlatformDisplayName } from '../utils/oembed';

export default function ReviewPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const initialTime = Number(searchParams.get('t')) || 0;

    const [video, setVideo] = useState(null);
    const [editor, setEditor] = useState(null);   // ✅ NEW
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Comment form state
    const [clientName, setClientName] = useState('');
    const [comment, setComment] = useState('');
    const [timestamp, setTimestamp] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Player ref (YouTube API object)
    const playerRef = useRef(null);
    const playerReadyRef = useRef(false);

    // ---------------------------
    // Fetch video + editor + comments
    // ---------------------------
    useEffect(() => {
        const load = async () => {
            setLoading(true);

            // 1. Load video
            const { data: videoData } = await supabase
                .from('videos')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (!videoData) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setVideo(videoData);

            // 2. Load editor profile (for dynamic branding)
            if (videoData.user_id) {
                const { data: editorData } = await supabase
                    .from('profiles')
                    .select('name, profile_image')
                    .eq('id', videoData.user_id)
                    .maybeSingle();

                if (editorData) setEditor(editorData);
            }

            // 3. Load comments
            const { data: commentsData } = await supabase
                .from('video_feedback')
                .select('*')
                .eq('video_id', id)
                .order('timestamp_seconds', { ascending: true });

            setComments(commentsData || []);
            setLoading(false);
        };

        load();

    }, [id]);

    // ---------------------------
    // Dynamic browser tab title
    // ---------------------------
    useEffect(() => {
        if (editor?.name) {
            document.title = `${editor.name} — Review Room`;
        } else if (video?.title) {
            document.title = `${video.title} — Review Room`;
        }
        return () => { document.title = 'MK Edit'; };
    }, [editor, video]);

    // ---------------------------
    // Load YouTube IFrame API
    // ---------------------------
    useEffect(() => {
        if (!video) return;
        const platform = detectPlatform(video.video_url);
        if (platform !== 'youtube') return;

        if (window.YT && window.YT.Player) {
            initPlayer();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);

        window.onYouTubeIframeAPIReady = () => initPlayer();
    }, [video]);

    const initPlayer = () => {
        const ytId = extractYouTubeId(video?.video_url);
        if (!ytId) return;

        if (playerRef.current) {
            playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(`yt-player-${id}`, {
            videoId: ytId,
            playerVars: {
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
            },
            events: {
                onReady: () => {
                    playerReadyRef.current = true;
                    // Jump to timestamp if provided in URL
                    if (initialTime > 0 && playerRef.current?.seekTo) {
                        playerRef.current.seekTo(initialTime, true);
                    }
                },
                onStateChange: (event) => {
                    if (event.data === 1) {
                        const tick = setInterval(() => {
                            if (playerRef.current?.getCurrentTime) {
                                const t = playerRef.current.getCurrentTime();
                                setTimestamp(Math.floor(t));
                            }
                        }, 500);
                        playerRef.current._tick = tick;
                    }
                    if (event.data === 2 || event.data === 0) {
                        if (playerRef.current?._tick) {
                            clearInterval(playerRef.current._tick);
                        }
                    }
                },
            },
        });
    };

    // ---------------------------
    // Submit a comment
    // ---------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);

        const name = clientName.trim() || 'Anonymous';

        const { data, error } = await supabase
            .from('video_feedback')
            .insert([{
                video_id: id,
                client_name: name,
                timestamp_seconds: timestamp,
                comment: comment.trim(),
            }])
            .select()
            .single();

        if (!error && data) {
            setComments([...comments, data].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds));
            setComment('');
            setClientName('');
        }

        setSubmitting(false);
    };

    // ---------------------------
    // Jump player to a comment's timestamp
    // ---------------------------
    const seekTo = (seconds) => {
        if (playerRef.current?.seekTo) {
            playerRef.current.seekTo(seconds, true);
            playerRef.current.playVideo();
        }
    };

    // ---------------------------
    // Format seconds → M:SS
    // ---------------------------
    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // ---------------------------
    // RENDER
    // ---------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#141419] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen bg-[#141419] flex items-center justify-center px-4">
                <div className="text-center">
                    <i className="fas fa-video-slash text-5xl text-gray-600 mb-4"></i>
                    <h1 className="text-white text-xl font-semibold mb-2">Video not found</h1>
                    <p className="text-gray-400 text-sm mb-4">This review link is invalid or has been removed.</p>
                    <Link to="/" className="text-supabase-green hover:underline text-sm">Back to home</Link>
                </div>
            </div>
        );
    }

    const platform = detectPlatform(video.video_url);
    const playable = canPlayOnSite(platform);
    const platformName = getPlatformDisplayName(platform);

    return (
        <div className="min-h-screen bg-[#141419] text-white">
            {/* Header — dynamic editor branding */}
            <header className="border-b border-white/10 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        {editor?.profile_image ? (
                            <img
                                src={editor.profile_image}
                                alt={editor.name}
                                className="w-8 h-8 rounded-full object-cover border border-white/10"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                    {(editor?.name || 'M')[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                        <span className="font-semibold text-sm">
                            {editor?.name || 'MK Edit'}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">Client Review Room</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Title */}
                <h1 className="text-xl md:text-2xl font-semibold mb-2">{video.title}</h1>
                {video.description && (
                    <p className="text-gray-400 text-sm mb-6">{video.description}</p>
                )}

                {/* Player */}
                <div className="rounded-2xl overflow-hidden bg-zinc-950 aspect-video mb-6">
                    {playable && platform === 'youtube' ? (
                        <div id={`yt-player-${id}`} className="w-full h-full" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <i className="fas fa-external-link-alt text-4xl text-gray-600 mb-4"></i>
                            <p className="text-white font-medium mb-2">
                                This video plays on {platformName}
                            </p>
                            <p className="text-gray-400 text-sm mb-4 max-w-md">
                                Watch it there, then come back to this tab and leave a comment.
                                Write the timestamp you want in the field below.
                            </p>
                            <a
                                href={video.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-supabase-green rounded-full text-white text-sm font-medium hover:bg-supabase-green/80 transition-all"
                            >
                                Watch on {platformName}
                                <i className="fas fa-external-link-alt ml-2 text-xs"></i>
                            </a>
                        </div>
                    )}
                </div>

                {/* Current timestamp indicator */}
                {playable && platform === 'youtube' && (
                    <div className="text-xs text-gray-500 mb-4">
                        Current time: <span className="text-supabase-green font-mono">{formatTime(timestamp)}</span>
                        <span className="ml-2">— your comment will be attached here</span>
                    </div>
                )}

                {/* Comment form */}
                <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-3">
                        <input
                            type="text"
                            name={`client-name-${id}`}
                            autoComplete="off"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Your name"
                            className="px-4 py-2.5 bg-white/5 rounded-xl text-sm border border-white/10 focus:outline-none focus:border-supabase-green"
                        />
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10">
                            <i className="fas fa-clock text-xs text-gray-500"></i>
                            <input
                                type="number"
                                value={timestamp}
                                onChange={(e) => setTimestamp(Number(e.target.value))}
                                className="w-16 bg-transparent text-sm font-mono text-supabase-green focus:outline-none"
                                min="0"
                            />
                            <span className="text-xs text-gray-500">seconds</span>
                        </div>
                    </div>
                    <textarea
                        autoComplete="off"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What would you like changed at this timestamp?"
                        rows="3"
                        className="w-full px-4 py-2.5 bg-white/5 rounded-xl text-sm border border-white/10 focus:outline-none focus:border-supabase-green resize-none mb-3"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !comment.trim()}
                        className="w-full md:w-auto px-6 py-2.5 bg-supabase-green rounded-xl text-sm font-medium hover:bg-supabase-green/80 disabled:opacity-40 transition-all"
                    >
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>

                {/* Comments list */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Comments ({comments.length})
                    </h2>
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-sm py-6 text-center">No comments yet. Be the first.</p>
                    ) : (
                        <div className="space-y-2">
                            {comments.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => seekTo(c.timestamp_seconds)}
                                    className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex gap-3"
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
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Helper — extract YouTube ID from various URL forms
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