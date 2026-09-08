// src/hooks/useAutoPlay.js
import { useState, useEffect, useRef } from 'react';

export function useAutoPlay(videos, isVisible) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);
    const currentVideoRef = useRef(null);

    useEffect(() => {
        if (!isVisible || videos.length === 0) {
            stopAutoPlay();
            return;
        }

        // Start auto-play when visible
        startAutoPlay();

        return () => {
            stopAutoPlay();
        };
    }, [isVisible, videos]);

    const startAutoPlay = () => {
        if (videos.length === 0) return;
        setIsPlaying(true);
        playNextVideo(0);
    };

    const stopAutoPlay = () => {
        setIsPlaying(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (currentVideoRef.current) {
            currentVideoRef.current.pause();
        }
    };

    const playNextVideo = (index) => {
        if (!isPlaying || index >= videos.length) {
            stopAutoPlay();
            return;
        }

        setCurrentIndex(index);
        const videoElement = document.querySelector(`[data-video-id="${videos[index]?.id}"]`);

        if (videoElement) {
            currentVideoRef.current = videoElement;
            videoElement.play();

            // Stop after 5 seconds
            timerRef.current = setTimeout(() => {
                videoElement.pause();
                videoElement.currentTime = 0;
                // Move to next video
                playNextVideo(index + 1);
            }, 5000);
        } else {
            // Skip if video not found
            playNextVideo(index + 1);
        }
    };

    const resumeFromVideo = (videoId) => {
        const index = videos.findIndex(v => v.id === videoId);
        if (index !== -1) {
            stopAutoPlay();
            setCurrentIndex(index);
            setIsPlaying(true);
            playNextVideo(index);
        }
    };

    return {
        currentIndex,
        isPlaying,
        resumeFromVideo,
        stopAutoPlay,
        startAutoPlay
    };
}