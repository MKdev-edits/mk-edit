import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function Footer() {
    const [socialLinks, setSocialLinks] = useState([]);
    const [editorName, setEditorName] = useState('Editor');

    useEffect(() => {
        fetchSocialLinks();
        fetchEditorName();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            const { data } = await supabase
                .from('social_links')
                .select('*')
                .order('created_at', { ascending: true });

            setSocialLinks(data || []);
        } catch (err) {
            console.error('Error fetching social links:', err);
        }
    };

    const fetchEditorName = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('name')
                .limit(1)
                .maybeSingle();

            if (data?.name) {
                setEditorName(data.name);
            }
        } catch (err) {
            console.error('Error fetching editor name:', err);
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
        if (lowerPlatform.includes('github')) return 'fab fa-github';
        if (lowerPlatform.includes('reddit')) return 'fab fa-reddit';
        if (lowerPlatform.includes('pinterest')) return 'fab fa-pinterest';
        if (lowerPlatform.includes('snapchat')) return 'fab fa-snapchat';
        if (lowerPlatform.includes('twitch')) return 'fab fa-twitch';
        if (lowerPlatform.includes('spotify')) return 'fab fa-spotify';
        if (lowerPlatform.includes('apple')) return 'fab fa-apple';
        if (lowerPlatform.includes('google')) return 'fab fa-google';
        if (lowerPlatform.includes('microsoft')) return 'fab fa-microsoft';
        if (lowerPlatform.includes('email') || lowerPlatform.includes('mail')) return 'fas fa-envelope';

        return 'fas fa-link';
    };

    // Get color on hover
    const getHoverColor = (platform) => {
        const lowerPlatform = platform.toLowerCase();

        if (lowerPlatform.includes('youtube')) return 'hover:text-red-500';
        if (lowerPlatform.includes('twitter') || lowerPlatform === 'x') return 'hover:text-blue-400';
        if (lowerPlatform.includes('instagram') || lowerPlatform === 'ig') return 'hover:text-pink-500';
        if (lowerPlatform.includes('tiktok')) return 'hover:text-pink-400';
        if (lowerPlatform.includes('discord')) return 'hover:text-indigo-400';
        if (lowerPlatform.includes('whatsapp')) return 'hover:text-green-400';
        if (lowerPlatform.includes('linkedin')) return 'hover:text-blue-600';
        if (lowerPlatform.includes('facebook')) return 'hover:text-blue-500';
        if (lowerPlatform.includes('telegram')) return 'hover:text-blue-400';
        if (lowerPlatform.includes('github')) return 'hover:text-gray-400';

        return 'hover:text-supabase-green';
    };

    return (
        <footer className="border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">E</span>
                            </div>
                            <span className="text-white font-medium text-sm">{editorName}'s Hub</span>
                        </div>
                        <p className="text-gray-500 text-xs">
                            Curating the best video content from YouTube, TikTok, and more.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-sm font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-500 hover:text-supabase-green text-xs transition-colors">Home</a></li>
                            <li><a href="/about" className="text-gray-500 hover:text-supabase-green text-xs transition-colors">About</a></li>
                            <li><Link to="/videos" className="text-gray-500 hover:text-supabase-green text-xs transition-colors">Videos</Link></li>
                            <li><a href="/contact" className="text-gray-500 hover:text-supabase-green text-xs transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Platforms */}
                    <div>
                        <h3 className="text-white text-sm font-semibold mb-4">Platforms</h3>
                        <ul className="space-y-2">
                            <li><a href="/videos?platform=youtube" className="text-gray-500 hover:text-supabase-green text-xs transition-colors">YouTube</a></li>
                            <li><a href="/videos?platform=tiktok" className="text-gray-500 hover:text-supabase-green text-xs transition-colors">TikTok</a></li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-white text-sm font-semibold mb-4">Connect</h3>
                        {socialLinks.length === 0 ? (
                            <p className="text-gray-500 text-xs">No social links added yet</p>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-gray-400 ${getHoverColor(link.platform)} transition-all transform hover:scale-110 text-xl`}
                                        title={link.platform}
                                    >
                                        <i className={getIconClass(link.platform)}></i>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-8 pt-6 text-center">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} {editorName}'s Hub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}