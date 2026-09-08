// src/components/ViewerProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { useSharedAuth } from '../../contexts/SharedAuthContext';

export default function ViewerProtectedRoute({ children }) {
    const { viewer, loading } = useViewerAuth();
    const { authInitialized } = useSharedAuth();

    if (!authInitialized || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Verifying Viewer credentials...</p>
                </div>
            </div>
        );
    }

    if (!viewer) {
        return <Navigate to="/viewer-login" replace />;
    }

    return children;
}