import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AboutPage() {
    const [profile, setProfile] = useState({
        name: 'Editor',
        tagline: 'Video Editor | Content Creator',
        about: 'Welcome to my video portfolio! I create amazing content...',
        profile_image: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .limit(1)
                .single();

            if (data) {
                setProfile(data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
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
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    {profile.profile_image && (
                        <img
                            src={profile.profile_image}
                            alt={profile.name}
                            className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-supabase-green/50"
                        />
                    )}
                    <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
                    <p className="text-supabase-green text-lg">{profile.tagline}</p>
                </div>

                {/* About Content */}
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {profile.about || 'No about information provided yet.'}
                    </div>
                </div>
            </div>
        </div>
    );
}