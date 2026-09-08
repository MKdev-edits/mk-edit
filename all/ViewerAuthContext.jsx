// src/contexts/ViewerAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSharedAuth } from './SharedAuthContext';

const ViewerAuthContext = createContext({});
export const useViewerAuth = () => useContext(ViewerAuthContext);

export const ViewerAuthProvider = ({ children }) => {
    const { user, loading: sharedLoading, authInitialized, signOut: sharedSignOut } = useSharedAuth();

    const [viewer, setViewer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedEmail, setSavedEmail] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('savedViewerEmail');
        if (saved) setSavedEmail(saved);
    }, []);

    // Fetch or create viewer profile only when user changes
    useEffect(() => {
        let isMounted = true;

        const fetchOrCreateViewer = async () => {
            if (!user) {
                if (isMounted) {
                    setViewer(null);
                    setLoading(false);
                }
                return;
            }

            try {
                // First, check if this user is an Editor
                const { data: isEditor } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.id)
                    .maybeSingle();

                if (isEditor) {
                    // This user is an editor, not a viewer
                    if (isMounted) {
                        setViewer(null);
                        setLoading(false);
                    }
                    return;
                }

                // Check if viewer exists
                let { data: viewerData, error: fetchError } = await supabase
                    .from('viewers')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (viewerData) {
                    if (isMounted) {
                        setViewer(viewerData);
                        setLoading(false);
                    }
                    return;
                }

                // Create new viewer
                const username = user.user_metadata?.username ||
                    user.email?.split('@')[0] ||
                    `user_${Math.random().toString(36).substr(2, 6)}`;

                const fullName = user.user_metadata?.full_name || '';

                const { data: newViewer, error: insertError } = await supabase
                    .from('viewers')
                    .insert([{
                        id: user.id,
                        email: user.email,
                        username: username,
                        full_name: fullName,
                        created_at: new Date(),
                        last_active: new Date()
                    }])
                    .select()
                    .maybeSingle();

                if (!insertError && newViewer && isMounted) {
                    setViewer(newViewer);
                }
            } catch (err) {
                console.error('Error in fetchOrCreateViewer:', err);
                if (isMounted) setViewer(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (authInitialized) {
            fetchOrCreateViewer();
        }

        return () => {
            isMounted = false;
        };
    }, [user, authInitialized]);

    const signUp = async (email, username, fullName, password, rememberMe = false) => {
        try {
            // Check if username exists
            const { data: existingUser } = await supabase
                .from('viewers')
                .select('username')
                .eq('username', username)
                .maybeSingle();

            if (existingUser) {
                return { success: false, error: 'Username already taken' };
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username, full_name: fullName } }
            });

            if (authError) throw authError;
            if (!authData.user) return { success: false, error: 'Signup failed' };

            if (rememberMe) {
                localStorage.setItem('savedViewerEmail', email);
                setSavedEmail(email);
            }

            return { success: true };
        } catch (err) {
            console.error('Signup error:', err);
            return { success: false, error: err.message };
        }
    };

    const signIn = async (email, password, rememberMe = false) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (rememberMe) {
                localStorage.setItem('savedViewerEmail', email);
                setSavedEmail(email);
            }

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const signOut = async () => {
        await sharedSignOut();
        setViewer(null);
    };

    const updateProfile = async (updates) => {
        try {
            const { data, error } = await supabase
                .from('viewers')
                .update({
                    full_name: updates.full_name,
                    username: updates.username,
                    avatar_url: updates.avatar_url,
                    updated_at: new Date()
                })
                .eq('id', viewer.id)
                .select()
                .maybeSingle();

            if (error) throw error;
            setViewer(data);
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deleteAccount = async () => {
        try {
            const { error: viewerError } = await supabase
                .from('viewers')
                .delete()
                .eq('id', viewer.id);

            if (viewerError) throw viewerError;
            await signOut();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return (
        <ViewerAuthContext.Provider value={{
            viewer,
            loading: loading || sharedLoading,
            savedEmail,
            signUp,
            signIn,
            signOut,
            updateProfile,
            deleteAccount,
            isLoggedIn: !!viewer
        }}>
            {children}
        </ViewerAuthContext.Provider>
    );
};