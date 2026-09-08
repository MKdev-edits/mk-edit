// utils/timer.js
import { supabase } from '../lib/supabase';

export const getLaunchDate = async () => {
    const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'launch_date')
        .single();

    return data ? new Date(data.value) : null;
};

export const getTimeLeft = async () => {
    const launchDate = await getLaunchDate();
    if (!launchDate) return null;

    const now = new Date();
    const diff = launchDate - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
};

// ✅ Admin function to reset timer
export const resetLaunchDate = async (newDate) => {
    const { error } = await supabase
        .from('app_settings')
        .update({ value: newDate.toISOString() })
        .eq('key', 'launch_date');

    return { success: !error, error };
};