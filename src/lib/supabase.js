// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// ✅ Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Check if variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase environment variables are missing!');
    console.error('Please check your .env file has:');
    console.error('VITE_SUPABASE_URL=your-project-url');
    console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// ✅ Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Optional: Log success
console.log('✅ Supabase client initialized');