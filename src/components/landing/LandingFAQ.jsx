// src/components/landing/LandingFAQ.jsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LandingFAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How does clients leave timestamp on our videos",
            answer: "They leave a timestamp by clicking the exact location on where the video needs improvement and it will indicate a red mark"
        },
        {
            question: "What if I already have a portfolio website?",
            answer: "Great! You can use your yourname.mk-edit.com subdomain as your client review room. Send clients here for feedback, and keep your main website for showcasing."
        },
        {
            question: "Is this really free?",
            answer: "Yes! You get a 1-month free trial when we launch. No credit card required. After that, $15/month starting the upper month for only users who joined early. $25 for others that didn't join the waitlist"
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            id="faq-section"
            className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#141419] overflow-hidden"
        >
            {/* Faint spotlight */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[400px] rounded-full opacity-40"
                    style={{
                        background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 65%)",
                        filter: "blur(80px)",
                    }}
                />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">

                {/* Heading */}
                <div className="text-center mb-12 sm:mb-16 fade-up">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full glass-soft">
                        <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[var(--fg-subtle)]">
                            FAQ
                        </span>
                    </div>

                    <h2 className="font-display font-extrabold tracking-tight
                        md:text-[clamp(1.8rem,3.2vw,2.5rem)] text-[clamp(1.6rem,3vw,2rem)] leading-[1.1] text-[var(--fg)]">
                        Frequently Asked{' '}
                        <span className="text-gradient">Questions</span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-[var(--fg-muted)]">
                        Everything you need to know about MK.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="glass rounded-2xl overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-5 sm:px-6 py-5 flex items-center justify-between text-left gap-4
                                        hover:bg-white/[0.02] transition-colors"
                                >
                                    <span className="text-sm sm:text-base font-semibold text-[var(--fg)] leading-snug">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`flex-shrink-0 w-7 h-7 rounded-full
                                            flex items-center justify-center
                                            bg-white/[0.04] border border-[var(--glass-border-soft)]
                                            transition-transform duration-300
                                            ${isOpen ? 'rotate-180' : ''}`}
                                    >
                                        <ChevronDown className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
                                    </span>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-5 sm:px-6 pb-5 pt-0">
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                                        <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA — plain text, blue email */}
                <div className="mt-12 text-center fade-up">
                    <p className="text-sm text-[var(--fg-muted)]">
                        Still have questions?{' '}
                        <a
                            href="mailto:michaeludemba39@gmail.com"
                            className="text-[var(--color-accent)] hover:underline font-medium"
                        >
                            michaeludemba39@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}