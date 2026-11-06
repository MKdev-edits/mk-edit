import { useState } from 'react';

export default function ReviewLinkModal({ video, onClose }) {
    const [copied, setCopied] = useState(false);
    const link = `${window.location.origin}/review/${video.id}`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-14 h-14 rounded-full bg-supabase-green/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check text-supabase-green text-2xl"></i>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">Video added</h3>
                <p className="text-gray-400 text-sm mb-5">
                    Send this link to your client. They'll be able to watch and leave timestamped comments — no login needed.
                </p>

                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2 mb-4">
                    <input
                        type="text"
                        readOnly
                        value={link}
                        className="flex-1 bg-transparent text-white text-xs px-2 outline-none truncate"
                    />
                    <button
                        onClick={copy}
                        className="px-3 py-1.5 bg-supabase-green rounded-lg text-white text-xs font-medium hover:bg-supabase-green/80 transition-colors whitespace-nowrap"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
                >
                    Done
                </button>
            </div>
        </div>
    );
}