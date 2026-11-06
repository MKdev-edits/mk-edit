// src/components/landing/LandingFooter.jsx
export default function LandingFooter() {
    return (
        <footer className="relative pt-8 pb-8 px-4 sm:px-6 lg:px-8 bg-[#141419]">

            {/* Half-width border line at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px
                bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-2.5">
                    <p className="text-xs text-[var(--fg-subtle)]">
                        © 2026 MK. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-5">
                    <a
                        href="#"
                        className="text-xs text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                    >
                        Privacy
                    </a>
                    <a
                        href="#"
                        className="text-xs text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                    >
                        Terms
                    </a>
                    <a
                        href="https://wa.me/2349037528459"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                    >
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
}