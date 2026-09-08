// src/contexts/QueueContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const QueueContext = createContext({});

export const useQueue = () => useContext(QueueContext);

export function QueueProvider({ children }) {
    // ============================================
    // STATE DEFINITIONS
    // ============================================

    // ✅ Main queue array - stores all videos in queue
    const [queue, setQueue] = useState([]);

    // ✅ Play Next - single video that plays next (overrides queue order)
    // IMPORTANT: Only ONE video can be set as "Play Next" at a time
    const [playNext, setPlayNext] = useState(null);

    // ✅ Repeat - repeats the CURRENT video
    // When true, the same video keeps playing after it ends
    const [repeat, setRepeat] = useState(false);

    // ✅ Loop - loops the ENTIRE queue
    // When true, after the last video, it goes back to the first
    const [loop, setLoop] = useState(false);

    // ✅ Queue Sidebar - controls right sidebar visibility (desktop only)
    // IMPORTANT: This is different from the left sidebar state
    const [isQueueSidebarOpen, setIsQueueSidebarOpen] = useState(false);

    // ✅ Current video - the video currently playing
    // This syncs with PlayerContext's currentVideo
    const [currentVideo, setCurrentVideo] = useState(null);

    // ============================================
    // LOCAL STORAGE PERSISTENCE
    // ============================================

    // ✅ Save queue state to localStorage when it changes
    // This ensures queue persists across page refreshes
    useEffect(() => {
        if (queue.length > 0 || playNext || repeat || loop) {
            localStorage.setItem('queueState', JSON.stringify({
                queue,
                playNext,
                repeat,
                loop
            }));
        }
    }, [queue, playNext, repeat, loop]);

    // ✅ Load queue state from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('queueState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                setQueue(state.queue || []);
                setPlayNext(state.playNext || null);
                setRepeat(state.repeat || false);
                setLoop(state.loop || false);
            } catch (e) {
                console.error('Error loading queue state:', e);
            }
        }
    }, []);

    // ============================================
    // CORE QUEUE FUNCTIONS
    // ============================================

    // ✅ Add video to queue
    // IMPORTANT: Prevents duplicate entries
    const addToQueue = useCallback((video) => {
        if (!video) return;

        // Check if video already in queue
        const exists = queue.some(v => v.id === video.id);
        if (exists) {
            // If video exists, move it to the end of the queue
            const filtered = queue.filter(v => v.id !== video.id);
            setQueue([...filtered, video]);
            return;
        }

        // Add to end of queue
        setQueue(prev => [...prev, video]);

        // ✅ AUTO-OPEN QUEUE SIDEBAR on desktop
        // This is the "surprise" effect - sidebar appears when video is added
        if (window.innerWidth >= 768) {
            setIsQueueSidebarOpen(true);
        }
    }, [queue]);

    // ✅ Remove video from queue
    // IMPORTANT: If removing the current video, it will skip to next
    const removeFromQueue = useCallback((videoId) => {
        setQueue(prev => prev.filter(v => v.id !== videoId));

        // If playNext was removed, clear it
        if (playNext?.id === videoId) {
            setPlayNext(null);
        }
    }, [playNext]);

    // ✅ Set a video as "Play Next"
    // IMPORTANT: Only ONE video can be playNext at a time
    // If you set a new playNext, the old one is removed
    const setPlayNextVideo = useCallback((video) => {
        if (!video) return;

        // If video is already in queue, remove it first
        const filtered = queue.filter(v => v.id !== video.id);
        setQueue(filtered);

        // Set as play next
        setPlayNext(video);

        // Auto-open sidebar
        if (window.innerWidth >= 768) {
            setIsQueueSidebarOpen(true);
        }
    }, [queue]);

    // ✅ Clear play next
    const clearPlayNext = useCallback(() => {
        setPlayNext(null);
    }, []);

    // ✅ Clear entire queue
    const clearQueue = useCallback(() => {
        setQueue([]);
        setPlayNext(null);
        setIsQueueSidebarOpen(false);
    }, []);

    // ✅ Toggle repeat (current video)
    const toggleRepeat = useCallback(() => {
        setRepeat(prev => !prev);
    }, []);

    // ✅ Toggle loop (entire queue)
    const toggleLoop = useCallback(() => {
        setLoop(prev => !prev);
    }, []);

    // ✅ Toggle queue sidebar
    const toggleQueueSidebar = useCallback(() => {
        setIsQueueSidebarOpen(prev => !prev);
    }, []);

    // ✅ Close queue sidebar
    const closeQueueSidebar = useCallback(() => {
        setIsQueueSidebarOpen(false);
    }, []);
    // auto play queue
    const autoQueueAllVideos = useCallback((videos, currentVideoId) => {
        // Filter out current video
        const filtered = videos.filter(v => v.id !== currentVideoId);
        // Randomize the rest
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setQueue(shuffled);
    }, []);

    // ✅ ADD: Reorder queue (drag & drop)
    const reorderQueue = useCallback((startIndex, endIndex) => {
        setQueue(prev => {
            const result = Array.from(prev);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        });
    }, []);

    // ✅ ADD: Move to next with 5-second delay
    const scheduleNextVideo = useCallback((onPlayNext) => {
        if (repeat && currentVideo) {
            // Repeat current video
            setTimeout(() => {
                if (onPlayNext) onPlayNext(currentVideo);
            }, 5000);
            return;
        }

        if (playNext) {
            const next = playNext;
            setPlayNext(null);
            setTimeout(() => {
                if (onPlayNext) onPlayNext(next);
            }, 5000);
            return;
        }

        if (queue.length > 0) {
            const [first, ...rest] = queue;
            setQueue(rest);
            setTimeout(() => {
                if (onPlayNext) onPlayNext(first);
            }, 5000);
            return;
        }

        if (loop && currentVideo) {
            setTimeout(() => {
                if (onPlayNext) onPlayNext(currentVideo);
            }, 5000);
        }
    }, [repeat, currentVideo, playNext, queue, loop]);

    const getNextVideo = useCallback(() => {
        // 1. If repeat is on, return current video
        if (repeat && currentVideo) {
            return currentVideo;
        }

        // 2. If playNext exists, return it and clear it
        if (playNext) {
            const next = playNext;
            setPlayNext(null);
            return next;
        }

        // 3. If queue has videos, return the first one
        if (queue.length > 0) {
            const [first, ...rest] = queue;
            setQueue(rest);
            return first;
        }

        // 4. If loop is on and we have a current video, restart
        if (loop && currentVideo) {
            return currentVideo;
        }

        // 5. No more videos
        return null;
    }, [repeat, currentVideo, playNext, queue, loop]);

    // ============================================
    // PLAYER SYNC - Syncs with PlayerContext
    // ============================================

    // ✅ This function is called when a video finishes playing
    // It gets the next video and triggers playback
    const onVideoEnd = useCallback((onPlayNext) => {
        const nextVideo = getNextVideo();
        if (nextVideo) {
            // Set as current video and play
            setCurrentVideo(nextVideo);
            if (onPlayNext) {
                onPlayNext(nextVideo);
            }
        } else {
            // No more videos - close everything
            setCurrentVideo(null);
            setIsQueueSidebarOpen(false);
        }
    }, [getNextVideo]);

    // ============================================
    // CONTEXT VALUE
    // ============================================

    const value = {
        // State
        queue,
        playNext,
        repeat,
        loop,
        isQueueSidebarOpen,
        currentVideo,

        // Functions
        addToQueue,
        removeFromQueue,
        setPlayNext: setPlayNextVideo,
        clearPlayNext,
        clearQueue,
        toggleRepeat,
        toggleLoop,
        toggleQueueSidebar,
        closeQueueSidebar,
        getNextVideo,
        onVideoEnd,
        setCurrentVideo,
        autoQueueAllVideos,
        reorderQueue,
        scheduleNextVideo,

        // Helpers
        hasQueue: queue.length > 0,
        hasPlayNext: !!playNext,
        isQueueEmpty: queue.length === 0 && !playNext,
    };

    return (
        <QueueContext.Provider value={value}>
            {children}
        </QueueContext.Provider>
    );
}