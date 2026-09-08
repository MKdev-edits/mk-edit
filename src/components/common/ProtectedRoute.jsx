// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSharedAuth } from '../../contexts/SharedAuthContext';

export default function ProtectedRoute({ children }) {
    const { profile, loading } = useAuth();
    const { authInitialized } = useSharedAuth();

    // Show loading while checking auth
    if (!authInitialized || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-supabase-green/30 border-t-supabase-green rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Verifying Editor credentials...</p>
                </div>
            </div>
        );
    }

    // Redirect if no editor profile
    if (!profile) {
        return <Navigate to="/login" replace />;
    }

    return children;
}