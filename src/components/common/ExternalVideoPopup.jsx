// src/components/common/ExternalVideoPopup.jsx

/**
 * ExternalVideoPopup - Popup for non-playable videos
 * 
 * Why this exists:
 * - Some platforms (TikTok, Twitter, Instagram) don't allow embedding
 * - Users need a clear way to watch these videos
 * - This popup gives them two options: Continue (to platform) or Cancel
 * 
 * When it appears:
 * - When user clicks a non-playable video
 * - When an embedded video fails to load
 */

import { useEffect } from 'react';

export default function ExternalVideoPopup({
    platform,
    platformDisplayName,
    videoUrl,
    onContinue,
    onCancel
}) {
    // ✅ Prevent background scroll when popup is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // ✅ Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleContinue = () => {
        // Open platform in new tab
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
        onContinue();
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in"
            onClick={onCancel}
        >
            <div
                className="relative w-full max-w-md bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ⚠️ Icon */}
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-yellow-500 text-3xl"></i>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                    Video Not Available on This Site
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6">
                    This video can't be played directly on our platform.
                    Would you like to continue watching on{' '}
                    <span className="text-supabase-green font-medium">
                        {platformDisplayName}
                    </span>
                    ?
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    {/* ✅ Continue Button (White) */}
                    <button
                        onClick={handleContinue}
                        className="flex-1 py-3 bg-white hover:bg-gray-100 rounded-xl font-medium text-black transition-all"
                    >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        Continue
                    </button>

                    {/* ❌ Cancel Button (Red) */}
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-red-600/20 hover:bg-red-600 rounded-xl font-medium text-red-400 hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                </div>

                {/* Platform icon hint */}
                <p className="text-gray-500 text-xs mt-4">
                    You'll be redirected to {platformDisplayName}
                </p>
            </div>
        </div>
    );
}