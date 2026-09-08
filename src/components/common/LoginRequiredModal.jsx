import { Link } from 'react-router-dom';

export default function LoginRequiredModal({ onClose, action = 'like this video' }) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg" onClick={onClose}>
            <div className="relative w-full max-w-sm bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 text-center" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <i className="fas fa-times text-xl"></i>
                </button>

                <div className="w-16 h-16 rounded-full bg-supabase-green/20 flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-lock text-3xl text-supabase-green"></i>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
                <p className="text-gray-400 text-sm mb-6">
                    You need to be logged in to {action}.
                </p>

                <div className="flex gap-3">
                    <Link
                        to="/viewer-login"
                        className="flex-1 py-2 bg-supabase-green rounded-xl text-white font-medium hover:bg-supabase-green/80 transition-colors"
                        onClick={onClose}
                    >
                        Login
                    </Link>
                    <Link
                        to="/viewer-signup"
                        className="flex-1 py-2 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
                        onClick={onClose}
                    >
                        Sign Up
                    </Link>
                </div>

                <p className="text-gray-500 text-xs mt-4">
                    Join to like, comment, download, and access VIP content!
                </p>
            </div>
        </div>
    );
}