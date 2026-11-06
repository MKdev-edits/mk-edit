// src/components/landing/LandingPurpose.jsx
export default function LandingPurpose() {
    return (
        <section
            id="purpose-section"
            className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#141419] overflow-hidden"
        >
            {/* Spotlight behind the text — centered, white, soft */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[900px] h-[700px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 30%, transparent 65%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>

            <div className="max-w-3xl mx-auto relative z-10 text-center">

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full glass-soft fade-up">
                    <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--fg-subtle)]">
                        Purpose
                    </span>
                </div>

                {/* Heading */}
                <h2 className="font-display font-extrabold tracking-tight
                    md:text-[clamp(1.8rem,3.2vw,2.5rem)] text-[clamp(1.6rem,3vw,2rem)] leading-[1.1] text-[var(--fg)] fade-up">
                    Why I'm building this
                </h2>

                {/* Divider */}
                <div className="my-8 flex justify-center fade-up">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>

                {/* Paragraphs — text on page background */}
                <div className="space-y-5 fade-up">
                    <p className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-[var(--fg-muted)]">
                        As a video editor myself, I've struggled with sharing my work professionally
                        and getting clear feedback from clients. I built this platform to solve those
                        exact problems—for myself and for other editors.
                    </p>
                    <p className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-[var(--fg-muted)]">
                        I wanted a place where editors could have their own portfolio website,
                        clients could leave timestamp-based feedback, and everything would be
                        in one simple, beautiful interface.
                    </p>
                    <p className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-[var(--fg-muted)]">
                        Whether you're just starting out or you're a seasoned pro, this platform
                        is designed to help you look professional, get better feedback, and grow
                        your editing business.
                    </p>
                </div>

                {/* Signature */}
                <div className="mt-12 flex items-center justify-center gap-3 fade-up">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-[var(--glass-border-soft)]">
                        <img
                            src="/images/Main-MK.JPG"
                            alt="MK"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-[var(--fg)]">Michael</p>
                        <p className="text-xs text-[var(--fg-subtle)]">Founder, MK</p>
                    </div>
                </div>
            </div>
        </section>
    );
}