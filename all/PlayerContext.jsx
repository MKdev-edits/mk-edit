// src/contexts/PlayerContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PlayerContext = createContext({});

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
    const [currentVideo, setCurrentVideo] = useState(null);
    const [timerId, setTimerId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Load saved state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('playerState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                if (state.currentVideo) {
                    setCurrentVideo(state.currentVideo);
                    setCurrentIndex(state.currentIndex || 0);
                    setQueue(state.queue || []);
                    setVolume(state.volume || 80);
                    setIsMuted(state.isMuted || false);
                }
            } catch (e) {
                console.error('Error loading player state:', e);
            }
        }
    }, []);

    // Save state to localStorage
    useEffect(() => {
        if (currentVideo) {
            localStorage.setItem('playerState', JSON.stringify({
                currentVideo,
                currentIndex,
                queue,
                volume,
                isMuted
            }));
        }
    }, [currentVideo, currentIndex, queue, volume, isMuted]);

    // ✅ ADD: Schedule next video
    const scheduleNext = useCallback((onPlayNext) => {
        if (timerId) clearTimeout(timerId);
        const id = setTimeout(() => {
            if (onPlayNext) onPlayNext();
        }, 5000); // 5 second delay
        setTimerId(id);
    }, [timerId]);

    // ✅ ADD: Clear timer on manual play
    const clearTimer = useCallback(() => {
        if (timerId) {
            clearTimeout(timerId);
            setTimerId(null);
        }
    }, [timerId]);


    const playVideo = (video, videoQueue = []) => {
        clearTimer();
        setCurrentVideo(video);
        setIsPlaying(true);
        setProgress(0);
        setDuration(0);

        if (videoQueue.length > 0) {
            setQueue(videoQueue);
            const index = videoQueue.findIndex(v => v.id === video.id);
            setCurrentIndex(index !== -1 ? index : 0);
        } else {
            setQueue([]);
            setCurrentIndex(0);
        }
    };

    const playNext = () => {
        if (queue.length === 0) return;
        const nextIndex = (currentIndex + 1) % queue.length;
        setCurrentIndex(nextIndex);
        setCurrentVideo(queue[nextIndex]);
        setProgress(0);
        setDuration(0);
        setIsPlaying(true);
    };

    const playPrevious = () => {
        if (queue.length === 0) return;
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        setCurrentIndex(prevIndex);
        setCurrentVideo(queue[prevIndex]);
        setProgress(0);
        setDuration(0);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const closePlayer = () => {
        setCurrentVideo(null);
        setIsPlaying(false);
        setQueue([]);
        setCurrentIndex(0);
        localStorage.removeItem('playerState');
    };

    const removeFromQueue = (videoId) => {
        setQueue(queue.filter(v => v.id !== videoId));
        if (currentVideo?.id === videoId) {
            playNext();
        }
    };

    const shuffleQueue = () => {
        const shuffled = [...queue];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setQueue(shuffled);
    };

    const setVideoProgress = (value) => {
        setProgress(value);
    };

    const setVideoDuration = (value) => {
        setDuration(value);
    };

    const value = {
        currentVideo,
        isPlaying,
        isExpanded,
        queue,
        currentIndex,
        volume,
        isMuted,
        progress,
        duration,
        playVideo,
        playNext,
        playPrevious,
        togglePlay,
        toggleMute,
        toggleExpand,
        closePlayer,
        removeFromQueue,
        shuffleQueue,
        setVolume,
        setVideoProgress,
        setVideoDuration,
        scheduleNext,
        clearTimer,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}