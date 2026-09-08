// src/components/common/HeroSection.jsx
import { useState, useEffect, useRef } from 'react';

export default function HeroSection() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [playerReady, setPlayerReady] = useState(false);
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Load YouTube IFrame API
    useEffect(() => {
        // Check if API is already loaded
        if (window.YT && window.YT.Player) {
            createPlayer();
            return;
        }

        // Load the API script
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);

        // Define the callback
        window.onYouTubeIframeAPIReady = () => {
            createPlayer();
        };

        return () => {
            // Cleanup
            if (playerRef.current) {
                playerRef.current.destroy();
            }
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    const createPlayer = () => {
        if (!containerRef.current) return;

        playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: '2_1zqMwQECE',
            playerVars: {
                autoplay: 1,
                loop: 1,
                playlist: '2_1zqMwQECE',
                controls: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
            },
            events: {
                onReady: () => {
                    setPlayerReady(true);
                    // ✅ Hide play button after 5 seconds
                    hideTimeoutRef.current = setTimeout(() => {
                        setShowPlayButton(false);
                    }, 5000);
                },
                onStateChange: (event) => {
                    // 1 = playing, 2 = paused
                    setIsPlaying(event.data === 1);
                },
            },
        });
    };

    const togglePlay = () => {
        if (!playerRef.current || !playerReady) return;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
        setIsPlaying(!isPlaying);

        // ✅ Show button, hide after 5 seconds
        setShowPlayButton(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
            setShowPlayButton(false);
        }, 5000);
    };

    const handleMouseEnter = () => {
        setShowPlayButton(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
    };

    const handleMouseLeave = () => {
        // ✅ Hide after 5 seconds if video is playing
        if (isPlaying) {
            hideTimeoutRef.current = setTimeout(() => {
                setShowPlayButton(false);
            }, 5000);
        }
    };

    const handleWaitlistClick = () => {
        const waitlistSection = document.getElementById('waitlist-section');
        if (waitlistSection) {
            waitlistSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            className="relative w-full overflow-hidden mx-auto"
            style={{
                height: isMobile ? '50vh' : '60vh',
                paddingLeft: '2px',
                paddingRight: '2px',
                marginTop: '2px',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ✅ YouTube Player Container */}
            <div ref={containerRef} className="absolute inset-0 w-full h-full" />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>

            {/* ✅ Content Overlay */}
            <div className="relative z-10 flex flex-col items-start justify-end h-full p-6 md:p-10 pb-8">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                        Showcase Your <br className="sm:hidden" />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Editing Skills
                        </span>
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base max-w-xl">
                        Get your own portfolio subdomain. Clients leave timestamp feedback directly on your videos.
                    </p>
                </div>

                {/* ✅ Play/Pause Button - Center */}
                {showPlayButton && (
                    <button
                        onClick={togglePlay}
                        className={`
                            absolute z-20 
                            w-14 h-14 md:w-20 md:h-20 
                            bg-black/60 backdrop-blur-sm 
                            rounded-full flex items-center justify-center 
                            hover:bg-black/80 transition-all 
                            border border-white/30
                            ${isMobile
                                ? 'bottom-24 right-6'
                                : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            }
                        `}
                    >
                        <i className={`fas fa-${isPlaying ? 'pause' : 'play'} text-white text-xl md:text-3xl`}></i>
                    </button>
                )}

                {/* ✅ Join Waitlist Button - Bottom Right */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10">
                    <button
                        onClick={handleWaitlistClick}
                        className="px-6 py-3 md:px-8 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm md:text-base rounded-lg shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 animate-pulse-glow flex items-center gap-2"
                    >
                        <span>✨</span>
                        Join the Waitlist
                    </button>
                </div>
            </div>
        </section>
    );
}