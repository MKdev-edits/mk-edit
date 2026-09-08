// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { SharedAuthProvider } from './contexts/SharedAuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { ViewerAuthProvider } from './contexts/ViewerAuthContext';
import Layout from './components/common/Layout';
import LandingLayout from './components/landing/LandingLayout';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ViewerProtectedRoute from './components/common/ViewerProtectedRoute';
import Dashboard from './pages/Dashboard/index';
import Login from './pages/Login';
import UpdatePassword from './pages/UpdatePassword';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import VideosPage from './pages/VideosPage';
import ViewerLogin from './components/viewer/ViewerLogin';
import ViewerSignup from './components/viewer/ViewerSignup';
import ViewerDashboard from './components/viewer/ViewerDashboard';
import SearchPage from './pages/SearchPage';

function App() {
    return (
        <SharedAuthProvider>
            <AuthProvider>
                <ViewerAuthProvider>
                    <Routes>
                        {/* ✅ LANDING PAGE - No sidebar, no auth */}
                        <Route element={<LandingLayout />}>
                            <Route path="/" element={<LandingPage />} />
                        </Route>

                        {/* ✅ MAIN APP - With sidebar, auth, etc. */}
                        <Route element={<Layout />}>
                            {/* Public Routes */}
                            <Route path="/home" element={<Home />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/video/:id" element={<VideoDetail />} />
                            <Route path="/videos" element={<VideosPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />

                            {/* ✅ Editor Dashboard */}
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
                        <Route path="/update-password" element={<UpdatePassword />} />
                    </Routes>
                </ViewerAuthProvider>
            </AuthProvider>
        </SharedAuthProvider>
    );
}

export default App;