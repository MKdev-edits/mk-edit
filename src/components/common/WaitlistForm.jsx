// src/components/common/WaitlistForm.jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function WaitlistForm({ isDark }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') {
                    setError('You\'re already on the waitlist! 🎉');
                } else {
                    throw error;
                }
            } else {
                setSuccess(true);
                setEmail('');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-supabase-green/20 border border-supabase-green/50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-supabase-green font-semibold text-lg">You're on the list!</p>
                <p className="text-gray-400 text-sm mt-1">We'll notify you when we launch.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white/10 text-white placeholder-gray-400 border border-white/20"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30 disabled:opacity-50 whitespace-nowrap"
                >
                    {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            <p className={`text-xs text-center mt-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No spam. Unsubscribe anytime. We respect your privacy.
            </p>
        </div>
    );
}