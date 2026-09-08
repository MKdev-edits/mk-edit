// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSharedAuth } from './SharedAuthContext';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { user, loading: sharedLoading, authInitialized, signOut: sharedSignOut } = useSharedAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch editor profile only when user changes
    useEffect(() => {
        let isMounted = true;

        const fetchEditorProfile = async () => {
            if (!user) {
                if (isMounted) {
                    setProfile(null);
                    setLoading(false);
                }
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (isMounted) {
                    if (!error && data) {
                        setProfile(data);
                    } else {
                        setProfile(null); // Not an editor
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error('Fetch profile error:', err);
                if (isMounted) {
                    setProfile(null);
                    setLoading(false);
                }
            }
        };

        // Wait for shared auth to initialize
        if (authInitialized) {
            fetchEditorProfile();
        }

        return () => {
            isMounted = false;
        };
    }, [user, authInitialized]);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        await sharedSignOut();
        setProfile(null);
    };

    const updateProfile = async (updates) => {
        if (!user?.id) return { error: 'No user logged in' };

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .maybeSingle();

        if (!error && data) {
            setProfile(data);
            window.dispatchEvent(new CustomEvent('profile-updated', { detail: data }));
        }
        return { data, error };
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading: loading || sharedLoading,
            initialized: authInitialized,
            signIn,
            signOut,
            updateProfile,
            isAuthenticated: !!profile
        }}>
            {children}
        </AuthContext.Provider>
    );
};