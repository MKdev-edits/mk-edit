// src/pages/ReviewDemo.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ReviewDemo() {
    // Fake video — a real YouTube URL so the player works
    const video = {
        id: 'demo',
        title: 'Brand Commercial — First Cut',
        description: 'Here is the first cut of the brand commercial. Please leave your feedback on specific timestamps.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube',
    };

    // Fake comments — this is what a client would see on a real review page
    const [comments, setComments] = useState([
        {
            id: 'c1',
            client_name: 'Sarah',
            timestamp_seconds: 3,
            comment: 'Love the opening shot, but can we slow this down a touch?',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
            id: 'c2',
            client_name: 'Michael',
            timestamp_seconds: 12,
            comment: 'Audio dips slightly around here — worth fixing in the mix.',
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
            id: 'c3',
            client_name: 'Clinton',
            timestamp_seconds: 24,
            comment: 'Perfect transition. Ship it.',
            created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
    ]);

    const [clientName, setClientName] = useState('');
    const [comment, setComment] = useState('');
    const [timestamp, setTimestamp] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const playerRef = { current: null };
    const [playerReady, setPlayerReady] = useState(false);

    // Load YouTube API
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            initPlayer();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
        window.onYouTubeIframeAPIReady = () => initPlayer();
    }, []);

    const initPlayer = () => {
        playerRef.current = new window.YT.Player('yt-demo-player', {
            videoId: 'dQw4w9WgXcQ',
            playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
            events: {
                onReady: () => setPlayerReady(true),
                onStateChange: (e) => {
                    if (e.data === 1) {
                        const tick = setInterval(() => {
                            if (playerRef.current?.getCurrentTime) {
                                setTimestamp(Math.floor(playerRef.current.getCurrentTime()));
                            }
                        }, 500);
                        playerRef.current._tick = tick;
                    }
                    if (e.data === 2 || e.data === 0) {
                        if (playerRef.current?._tick) clearInterval(playerRef.current._tick);
                    }
                },
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);

        // Simulate save + show a toast telling them it's a demo
        setTimeout(() => {
            const name = clientName.trim() || 'Anonymous';
            setComments([...comments, {
                id: `c${Date.now()}`,
                client_name: name,
                timestamp_seconds: timestamp,
                comment: comment.trim(),
                created_at: new Date().toISOString(),
            }].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds));

            setComment('');
            setSubmitting(false);

            // Little hint at the top of the comment area
            document.getElementById('demo-hint')?.classList.remove('hidden');
        }, 400);
    };

    const seekTo = (seconds) => {
        if (playerRef.current?.seekTo) {
            playerRef.current.seekTo(seconds, true);
            playerRef.current.playVideo();
        }
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#141419] text-white">
            {/* Header */}
            <header className="border-b border-white/10 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/images/Main-MK.JPG" alt="MK" className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-semibold text-sm">MK Edit</span>
                    </Link>
                    <span className="text-xs text-gray-500">Client Review Room · Demo</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Demo banner */}
                <div className="mb-6 p-3.5 rounded-xl bg-supabase-green/10 border border-supabase-green/30 flex items-start gap-3">
                    <i className="fas fa-info-circle text-supabase-green mt-0.5"></i>
                    <div className="text-sm">
                        <p className="text-white font-medium">This is a live demo.</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                            Try adding a comment below, and click any comment to jump the video to that moment. This is exactly what your client will see.
                        </p>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-xl md:text-2xl font-semibold mb-2">{video.title}</h1>
                <p className="text-gray-400 text-sm mb-6">{video.description}</p>

                {/* Player */}
                <div className="rounded-2xl overflow-hidden bg-zinc-950 aspect-video mb-6">
                    <div id="yt-demo-player" className="w-full h-full" />
                </div>

                {/* Current timestamp indicator */}
                <div className="text-xs text-gray-500 mb-4">
                    Current time: <span className="text-supabase-green font-mono">{formatTime(timestamp)}</span>
                    <span className="ml-2">— this is where your comment will be attached</span>
                </div>

                {/* Comment form */}
                <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-3">
                        <input
                            type="text"
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

                    <p id="demo-hint" className="hidden mt-3 text-xs text-supabase-green">
                        ✅ That's the flow. Your comments save to the database — in the demo they just stay on this page.
                    </p>
                </form>

                {/* Comments list */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Comments ({comments.length})
                    </h2>
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
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-supabase-green/10 to-emerald-500/5 border border-supabase-green/20 text-center">
                    <h3 className="text-white font-semibold mb-1">Want this for your own videos?</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Send clients a link. They comment. You see it on your dashboard.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-supabase-green rounded-full text-white text-sm font-medium hover:bg-supabase-green/80 transition-all"
                    >
                        Get started free
                        <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                </div>
            </main>
        </div>
    );
}