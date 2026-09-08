// src/components/landing/LandingFAQ.jsx
import { useState, useEffect, useRef } from 'react';

export default function LandingFAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const sectionRef = useRef(null);

    const faqs = [
        {
            question: "Is this really free?",
            answer: "Yes! You get a 1-month free trial when we launch. No credit card required. After that, it's just $9/month for the full platform."
        },
        {
            question: "What if I already have a portfolio website?",
            answer: "Great! You can use your EditPort subdomain as your client review room. Send clients here for feedback, and keep your main website for showcasing."
        },
        {
            question: "When will the platform launch?",
            answer: "We're launching in 7 days. Everyone on the waitlist gets early access and 1 month free."
        },
        {
            question: "What happens to my subdomain when I upgrade?",
            answer: "Your subdomain stays the same. You can even connect your own custom domain later."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // ✅ IntersectionObserver for scroll animation
    useEffect(() => {
        const checkInitialVisibility = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('animate-in');
                }
            });
        };

        const timer = setTimeout(() => {
            checkInitialVisibility();
        }, 200);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

        const handleResize = () => {
            const el = document.querySelectorAll('.animate-on-scroll:not(.animate-in)');
            el.forEach((elem) => {
                const rect = elem.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    elem.classList.add('animate-in');
                }
            });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section
            id="faq-section"
            ref={sectionRef}
            className="py-16 sm:py-20 px-4 bg-[#0F0F0F] border-t border-white/5"
        >
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                        Frequently Asked <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Questions</span>
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-gray-400">
                        Everything you need to know about EditPort.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-white/5"
                                >
                                    <span className="text-white text-sm sm:text-base font-medium">
                                        {faq.question}
                                    </span>
                                    <span className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === index ? 'rotate-180' : ''
                                        }`}>
                                        <i className="fas fa-chevron-down text-sm"></i>
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-gray-400 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ Bottom CTA */}
                <div className="mt-10 text-center">
                    <p className="text-gray-400 text-sm">
                        Still have questions?
                        <button
                            onClick={() => document.getElementById('perk-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-blue-400 hover:text-blue-300 ml-1 transition-colors"
                        >
                            Claim your free subdomain →
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
}