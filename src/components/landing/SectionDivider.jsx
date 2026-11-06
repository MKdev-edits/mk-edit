// src/components/landing/SectionDivider.jsx
export default function SectionDivider() {
    return (
        <div className="relative w-full flex justify-center py-6">
            {/* The hairline */}
            <div
                className="h-px w-3/4 sm:w-1/2 max-w-3xl"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)",
                }}
            />
            {/* Soft glow underneath */}
            <div
                className="absolute top-0 h-8 w-3/4 sm:w-1/2 max-w-3xl pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at top, rgba(255,255,255,0.04) 0%, transparent 70%)",
                }}
            />
        </div>
    );
}