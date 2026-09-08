// src/components/landing/LandingFooter.jsx
export default function LandingFooter() {
    return (
        <footer className="py-8 px-4 border-t transition-colors duration-500 border-white/10 bg-[#0F0F0F]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                    © 2026 MK Timeless. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm transition-colors text-gray-500 hover:text-white">Privacy</a>
                    <a href="#" className="text-sm transition-colors text-gray-500 hover:text-white">Terms</a>
                    <a href="#" className="text-sm transition-colors text-gray-500 hover:text-white">Contact</a>
                </div>
            </div>
        </footer>
    );
}
