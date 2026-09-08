import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ContactPage() {
    const [socialLinks, setSocialLinks] = useState([]);
    const [profile, setProfile] = useState({ name: 'Editor' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [socialRes, profileRes] = await Promise.all([
                supabase.from('social_links').select('*'),
                supabase.from('profiles').select('name').limit(1).single()
            ]);

            if (socialRes.data) setSocialLinks(socialRes.data);
            if (profileRes.data) setProfile(profileRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Map platform names to Font Awesome icon classes
    const getIconClass = (platform) => {
        const lowerPlatform = platform.toLowerCase();

        if (lowerPlatform.includes('youtube')) return 'fab fa-youtube';
        if (lowerPlatform.includes('twitter') || lowerPlatform === 'x') return 'fab fa-twitter';
        if (lowerPlatform.includes('instagram') || lowerPlatform === 'ig') return 'fab fa-instagram';
        if (lowerPlatform.includes('tiktok')) return 'fab fa-tiktok';
        if (lowerPlatform.includes('discord')) return 'fab fa-discord';
        if (lowerPlatform.includes('whatsapp')) return 'fab fa-whatsapp';
        if (lowerPlatform.includes('linkedin')) return 'fab fa-linkedin';
        if (lowerPlatform.includes('facebook')) return 'fab fa-facebook';
        if (lowerPlatform.includes('telegram')) return 'fab fa-telegram';

        return 'fas fa-link';
    };

    // Get color
    const getIconColor = (platform) => {
        const lowerPlatform = platform.toLowerCase();

        if (lowerPlatform.includes('youtube')) return 'text-red-500';
        if (lowerPlatform.includes('twitter') || lowerPlatform === 'x') return 'text-blue-400';
        if (lowerPlatform.includes('instagram') || lowerPlatform === 'ig') return 'text-pink-500';
        if (lowerPlatform.includes('tiktok')) return 'text-pink-400';
        if (lowerPlatform.includes('discord')) return 'text-indigo-400';
        if (lowerPlatform.includes('whatsapp')) return 'text-green-400';
        if (lowerPlatform.includes('linkedin')) return 'text-blue-600';
        if (lowerPlatform.includes('facebook')) return 'text-blue-500';
        if (lowerPlatform.includes('telegram')) return 'text-blue-400';

        return 'text-gray-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-20">
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex backdrop-blur-2xl bg-white/5 rounded-full px-4 py-2 mb-4 border border-white/10">
                        <span className="text-supabase-green text-sm">📬 Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Contact {profile.name}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Connect with me through social media or send me a message
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Social Links Section */}
                    <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-supabase-green/20 flex items-center justify-center">
                                <i className="fas fa-share-alt text-supabase-green text-xl"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Social Media</h2>
                                <p className="text-gray-400 text-sm">Follow and connect on these platforms</p>
                            </div>
                        </div>

                        {socialLinks.length === 0 ? (
                            <div className="text-center py-8 bg-white/5 rounded-xl">
                                <i className="fas fa-globe text-4xl text-gray-500 mb-3 block"></i>
                                <p className="text-gray-500">No social links added yet</p>
                                <p className="text-gray-600 text-xs mt-2">Check back soon!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                                    >
                                        <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <i className={`${getIconClass(link.platform)} ${getIconColor(link.platform)} text-xl`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium capitalize">{link.platform}</p>
                                            <p className="text-gray-400 text-xs truncate max-w-[200px] md:max-w-[300px]">
                                                {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                                            </p>
                                        </div>
                                        <div className="text-gray-500 group-hover:text-supabase-green transition-colors">
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Info & Message Section */}
                    <div className="space-y-6">
                        {/* Direct Contact Card */}
                        <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-supabase-green/20 flex items-center justify-center">
                                    <i className="fas fa-envelope text-supabase-green text-xl"></i>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Direct Contact</h2>
                                    <p className="text-gray-400 text-sm">Reach me directly via email</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-supabase-green/20 flex items-center justify-center">
                                        <i className="fas fa-envelope text-supabase-green"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Email Address</p>
                                        <a
                                            href={`mailto:${profile.name?.toLowerCase().replace(/\s/g, '')}@example.com`}
                                            className="text-white text-sm hover:text-supabase-green transition-colors"
                                        >
                                            {profile.name?.toLowerCase().replace(/\s/g, '')}@example.com
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-supabase-green/5 rounded-xl p-4 border border-supabase-green/20">
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        For business inquiries, collaborations, or just to say hello,
                                        feel free to reach out through any of my social platforms or send an email.
                                        I'll get back to you as soon as possible!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Response Note */}
                        <div className="bg-gradient-to-r from-supabase-green/10 to-emerald-500/10 rounded-2xl p-6 border border-supabase-green/20">
                            <div className="flex items-center gap-3 mb-3">
                                <i className="fas fa-bolt text-2xl text-supabase-green"></i>
                                <h3 className="text-white font-semibold">Quick Response</h3>
                            </div>
                            <p className="text-gray-300 text-sm">
                                I typically respond within 24-48 hours. Looking forward to connecting with you!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-12 pt-8 border-t border-white/10">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} {profile.name}'s Hub. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}