// src/components/landing/LandingPerk.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function LandingPerk({ onOpenModal }) {
    const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0, expired: false });
    const [loading, setLoading] = useState(true);

    // ✅ Fetch timer with fallback
    const fetchTimer = async () => {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'launch_date')
                .maybeSingle();

            if (data?.value) {
                const launchDate = new Date(data.value);
                const now = new Date();
                const diff = launchDate - now;

                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeLeft({ days, hours, minutes, seconds, expired: false });
                    setLoading(false);
                    return;
                }
            }

            // ✅ FALLBACK: 7 days from now
            const fallback = new Date();
            fallback.setDate(fallback.getDate() + 7);
            const diff = fallback - new Date();
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                expired: false
            });

        } catch (error) {
            console.error('Timer error:', error);
            // ✅ FALLBACK: 7 days from now
            const fallback = new Date();
            fallback.setDate(fallback.getDate() + 7);
            const diff = fallback - new Date();
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                expired: false
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTimer();

        // ✅ Update timer every second
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.expired) return prev;

                const newSeconds = prev.seconds - 1;
                if (newSeconds < 0) {
                    const newMinutes = prev.minutes - 1;
                    if (newMinutes < 0) {
                        const newHours = prev.hours - 1;
                        if (newHours < 0) {
                            const newDays = prev.days - 1;
                            if (newDays < 0) {
                                return { ...prev, expired: true };
                            }
                            return { ...prev, days: newDays, hours: 23, minutes: 59, seconds: 59 };
                        }
                        return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
                    }
                    return { ...prev, minutes: newMinutes, seconds: 59 };
                }
                return { ...prev, seconds: newSeconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <section className="py-16 sm:py-20 px-4 bg-[#0F0F0F] border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                </div>
            </section>
        );
    }

    const isExpired = timeLeft.expired || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0);

    return (
        <section id="perk-section" className="py-16 sm:py-20 px-4 bg-[#0F0F0F] border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                {/* ✅ NO ANIMATION - Always visible */}
                <div className="backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border transition-all duration-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                    <div className="text-center">
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 ${isExpired
                                ? 'bg-gray-500/20 border border-gray-500/30'
                                : 'bg-yellow-500/20 border border-yellow-500/30'
                            }`}>
                            <span className={`text-xs font-medium ${isExpired ? 'text-gray-400' : 'text-yellow-400'
                                }`}>
                                {isExpired ? '⏰ OFFER EXPIRED' : '🔥 LIMITED TIME'}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            🚀 Launch Perk: <span className={isExpired ? 'text-gray-400' : 'text-blue-400'}>Lifetime Access</span>
                        </h2>
                    </div>

                    <div className="mt-4 sm:mt-6 text-center">
                        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                            {isExpired
                                ? 'This offer has expired. But you can still join the waitlist!'
                                : 'Everyone on the waitlist today gets LIFETIME access to our Auto-Storyboard GIF Generator.'
                            }
                        </p>
                        {!isExpired && (
                            <>
                                <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto">
                                    We automatically generate a <span className="text-white font-medium">12-frame GIF storyboard</span> of your entire video. Clients can skim your whole project in 2 seconds.
                                </p>
                                <div className="mt-2 inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                    <span className="text-blue-400 text-sm font-medium">💎 $49 value – Free for first 100 members</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ✅ Timer */}
                    {!isExpired && (
                        <div className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4">
                            {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                                <div key={unit} className="text-center">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl sm:text-3xl font-bold text-white">
                                            {String(timeLeft[unit]).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1 capitalize">{unit}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ✅ CTA Button */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <button
                            onClick={onOpenModal}
                            className={`px-8 py-3.5 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 mx-auto ${isExpired
                                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/40'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/40'
                                }`}
                        >
                            <span>🚀</span>
                            {isExpired ? 'Join Waitlist' : 'Claim My Perk'}
                            <i className="fas fa-arrow-right text-sm"></i>
                        </button>
                        {!isExpired && (
                            <p className="text-gray-500 text-xs mt-3">
                                ⏳ Offer ends in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}