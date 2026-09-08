import { useEffect } from 'react';

export default function MobileMenu({ isOpen, onClose, onNavigate, navLinks }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />

            <div className="fixed right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-2xl border-l border-white/10 z-50 animate-slide-in-right shadow-2xl">
                <div className="flex justify-between items-center p-5 border-b border-white/10">
                    <span className="text-white font-semibold text-lg">Menu</span>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                    >
                        <i className="fas fa-times text-white text-lg"></i>
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => {
                                onNavigate(link.id);
                                onClose();
                            }}
                            className="flex items-center gap-4 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all group text-left"
                        >
                            <i className={`${link.icon} text-lg group-hover:scale-110 transition-transform w-5`}></i>
                            <span className="text-base">{link.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}