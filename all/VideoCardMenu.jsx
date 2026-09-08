// src/components/common/VideoCardMenu.jsx
import { useState, useRef, useEffect } from 'react';
import { useQueue } from '../../contexts/QueueContext';

export default function VideoCardMenu({ video }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const {
        addToQueue,
        removeFromQueue,
        setPlayNext,
        clearPlayNext,
        toggleRepeat,
        toggleLoop,
        repeat,
        loop,
        playNext,
        queue
    } = useQueue();

    const isPlayNext = playNext?.id === video.id;
    //const inQueue = isInQueue || queue.some(v => v.id === video.id);

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ✅ Toggle dropdown - with proper positioning
    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleMenuItemClick = (action) => {
        setIsOpen(false);
        action();
    };

    // ✅ Menu Item component
    const MenuItem = ({ icon, label, onClick, disabled = false, isActive = false }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled) handleMenuItemClick(onClick);
            }}
            disabled={disabled}
            className={`
                flex items-center gap-3 w-full px-3 py-2 text-left text-sm
                transition-colors duration-150
                ${disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : isActive
                        ? 'text-supabase-green hover:bg-white/10'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
                first:rounded-t-lg last:rounded-b-lg
            `}
        >
            <i className={`${icon} w-4 text-center ${isActive ? 'text-supabase-green' : ''}`}></i>
            <span>{label}</span>
            {isActive && <i className="fas fa-check ml-auto text-supabase-green text-xs"></i>}
        </button>
    );

    return (
        <div ref={menuRef} className="relative inline-block">
            {/* ✅ 3-Dot Trigger - White background, black dots */}
            <button
                onClick={toggleMenu}
                className="w-7 h-7 rounded-full bg-white hover:bg-gray-100 transition-all flex items-center justify-center shadow-sm"
                aria-label="More options"
            >
                <i className="fas fa-ellipsis-v text-black text-sm"></i>
            </button>

            {/* ✅ Dropdown Menu */}
            {isOpen && (
                <div className={`
                    absolute z-50 w-56 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl py-1 animate-scale-in
                    ${window.innerWidth < 768
                        ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'  // ✅ Mobile: pop up from bottom
                        : 'right-0 top-full mt-1'                       // ✅ Desktop: dropdown from right
                    }
                `}>
                    {/* Repeat */}
                    <MenuItem
                        icon="fas fa-repeat"
                        label={repeat ? 'Repeat On' : 'Repeat'}
                        onClick={toggleRepeat}
                        isActive={repeat}
                    />

                    <div className="h-px bg-white/10 mx-2"></div>

                    {/* Add to Queue / Remove from Queue */}
                    {inQueue ? (
                        <MenuItem
                            icon="fas fa-minus-circle"
                            label="Remove from Queue"
                            onClick={() => removeFromQueue(video.id)}
                        />
                    ) : (
                        <MenuItem
                            icon="fas fa-plus-circle"
                            label="Add to Queue"
                            onClick={() => addToQueue(video)}
                        />
                    )}

                    <div className="h-px bg-white/10 mx-2"></div>

                    {/* Loop */}
                    <MenuItem
                        icon="fas fa-infinity"
                        label={loop ? 'Loop On' : 'Loop'}
                        onClick={toggleLoop}
                        isActive={loop}
                    />
                </div>
            )}
        </div>
    );
}