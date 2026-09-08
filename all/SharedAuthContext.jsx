// src/contexts/SharedAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SharedAuthContext = createContext({});

export const useSharedAuth = () => useContext(SharedAuthContext);

export const SharedAuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                // Get initial session
                const { data: { session: initialSession } } = await supabase.auth.getSession();

                if (isMounted) {
                    setSession(initialSession);
                    setUser(initialSession?.user || null);
                    setAuthInitialized(true);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Auth init error:', error);
                if (isMounted) {
                    setLoading(false);
                    setAuthInitialized(true);
                }
            }
        };

        initializeAuth();

        // SINGLE listener for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                if (!isMounted) return;

                // Update shared state
                setSession(newSession);
                setUser(newSession?.user || null);
                setLoading(false);
                setAuthInitialized(true);
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setLoading(false);
    };

    const value = {
        session,
        user,
        loading,
        authInitialized,
        signOut,
        isAuthenticated: !!user
    };

    return (
        <SharedAuthContext.Provider value={value}>
            {children}
        </SharedAuthContext.Provider>
    );
};