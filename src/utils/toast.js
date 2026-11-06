// src/utils/toast.js

/**
 * Show a quick "Coming soon" style toast.
 * Self-contained — creates DOM, styles inline, auto-removes.
 * No library, no context, no state.
 */
export function showToast(message = 'Coming soon', duration = 1800) {
    // Remove any existing toast so they don't stack
    const existing = document.getElementById('mk-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'mk-toast';
    toast.textContent = message;

    Object.assign(toast.style, {
        position: 'fixed',
        left: '50%',
        bottom: '32px',
        transform: 'translateX(-50%) translateY(12px)',
        padding: '10px 18px',
        background: 'rgba(20, 20, 24, 0.95)',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '500',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
    });

    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto-remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(8px)';
        setTimeout(() => toast.remove(), 250);
    }, duration);
}