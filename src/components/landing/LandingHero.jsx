// src/components/landing/LandingHero.jsx
import { useState, useEffect } from 'react';

export default function LandingHero({ onOpenModal }) {
    // ✅ HARD-CODED NUMBERS
    const waitlistCount = 20;      // ← "20 editors joined"
    const spotsLeft = "Spots Available";           // ← "30 spots left"
    const editorsAhead = 20;        // ← "20 editors ahead"

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-[#0F0F0F]"
        >
            {/* Background glow - subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-transparent"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* ✅ LEFT: Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* ✅ Badge */}
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
                            <span className="text-blue-400 text-[10px] sm:text-xs font-medium">🚀 Early Access</span>
                            <span className="w-1 h-1 bg-blue-400/50 rounded-full"></span>
                        </div>

                        {/* ✅ Headline */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                            Stop Sending MP4s.
                            <br />
                            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                                Start Sending a Client Review Room.
                            </span>
                        </h1>

                        {/* ✅ Sub-headline */}
                        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0">
                            One click. Your own subdomain. Clients leave timestamped feedback directly on your videos. Look like a pro agency from day one.
                        </p>

                        {/* ✅ CTA Button */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={onOpenModal}
                                className="px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/40 flex items-center gap-2"
                            >
                                <span>🚀</span>
                                Claim Your Free Subdomain
                                <i className="fas fa-arrow-right text-xs sm:text-sm"></i>
                            </button>

                            {/* Social proof */}
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                <div className="flex -space-x-2">
                                    {['A', 'B', 'C'].map((letter, i) => (
                                        <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0F0F0F] bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-gray-300 font-medium">{waitlistCount}+</span>
                                <span className="text-gray-500">editors joined</span>
                            </div>
                        </div>

                        {/* ✅ Trust indicators - HARD-CODED */}
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                {spotsLeft}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="flex items-center gap-1.5">
                                🚀 {editorsAhead} editors ahead
                            </span>
                        </div>
                    </div>

                    {/* ✅ RIGHT: Video Player Screenshot */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10 bg-gradient-to-b from-gray-900 to-gray-950">
                            {/* Video Player UI */}
                            <div className="aspect-video relative bg-gradient-to-br from-gray-800 to-gray-900">
                                {/* Video placeholder content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                    {/* Video timeline */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
                                        <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                                    </div>

                                    {/* Video content */}
                                    <div className="text-center">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                                            <i className="fas fa-play text-2xl sm:text-3xl text-blue-400"></i>
                                        </div>
                                        <p className="text-gray-400 text-xs sm:text-sm">Sample Video Preview</p>
                                    </div>

                                    {/* ✅ Red "Add Timestamp" Button */}
                                    <div className="absolute bottom-3 right-3">
                                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-lg shadow-red-500/30 transition-all transform hover:scale-105">
                                            <i className="fas fa-map-pin text-xs"></i>
                                            Add Timestamp
                                        </button>
                                    </div>
                                </div>

                                {/* Video controls overlay */}
                                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent px-3 flex items-center gap-2">
                                    <i className="fas fa-play text-white/60 text-xs"></i>
                                    <div className="flex-1 h-1 bg-white/20 rounded-full">
                                        <div className="h-full w-1/3 bg-white/40 rounded-full"></div>
                                    </div>
                                    <span className="text-white/40 text-[10px]">1:23 / 4:56</span>
                                    <i className="fas fa-expand text-white/40 text-xs"></i>
                                </div>
                            </div>

                            {/* ✅ Bottom label */}
                            <div className="px-3 py-2 border-t border-white/5 flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <i className="fas fa-check text-white text-[8px]"></i>
                                </div>
                                <span className="text-gray-400 text-[10px]">Client Review Room • Live Feedback</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
                <button
                    onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                    <i className="fas fa-chevron-down text-lg"></i>
                </button>
            </div>
        </section>
    );
}