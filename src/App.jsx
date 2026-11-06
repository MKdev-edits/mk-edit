// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { SharedAuthProvider } from './contexts/SharedAuthContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ViewerAuthProvider } from './contexts/ViewerAuthContext';
import Layout from './components/common/Layout';
import LandingLayout from './components/landing/LandingLayout';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ViewerProtectedRoute from './components/common/ViewerProtectedRoute';
import Dashboard from './pages/Dashboard/index';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UpdatePassword from './pages/UpdatePassword';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
//import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import VideosPage from './pages/VideosPage';
import ViewerLogin from './components/viewer/ViewerLogin';
import ViewerSignup from './components/viewer/ViewerSignup';
import ViewerDashboard from './components/viewer/ViewerDashboard';
//import SearchPage from './pages/SearchPage';
import ReviewDemo from './pages/ReviewDemo';
import ReviewPage from './pages/ReviewPage';

function SmartRoot() {
    const { user, profile, loading } = useAuth();

    // While auth resolves, render nothing (prevents landing flash)
    if (loading) return null;

    // Logged-in editor → straight to dashboard
    if (user && profile) return <Navigate to="/dashboard" replace />;

    // Everyone else → landing
    return <LandingPage />;
}

function App() {
    return (
        <SharedAuthProvider>
            <AuthProvider>
                <ViewerAuthProvider>
                    <Routes>
                        {/* ✅ LANDING PAGE — always shown at "/" */}
                        <Route element={<LandingLayout />}>
                            <Route path="/" element={<SmartRoot />} />
                            <Route path="/waitlist" element={<LandingPage />} />
                        </Route>

                        {/* ✅ MAIN APP - With sidebar, auth, etc. */}
                        <Route element={<Layout />}>
                            <Route path="/video/:id" element={<VideoDetail />} />
                            <Route path="/videos" element={<VideosPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />

                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                        </Route>

                        {/* Viewer Auth - No sidebar */}
                        <Route path="/viewer-login" element={<ViewerLogin />} />
                        <Route path="/viewer-signup" element={<ViewerSignup />} />
                        <Route path="/viewer-dashboard" element={
                            <ViewerProtectedRoute>
                                <ViewerDashboard />
                            </ViewerProtectedRoute>
                        } />

                        {/* Editor Auth - No sidebar */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/update-password" element={<UpdatePassword />} />

                        {/* ✅ Public Review Page — no auth, no sidebar */}
                        <Route path="/review/demo" element={<ReviewDemo />} />
                        <Route path="/review/:id" element={<ReviewPage />} />

                        {/* ⚠️ Fallback — unknown URLs go back to landing */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ViewerAuthProvider>
            </AuthProvider>
        </SharedAuthProvider>
    );
}

export default App;