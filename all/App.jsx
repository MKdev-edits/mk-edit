// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { SharedAuthProvider } from './contexts/SharedAuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { ViewerAuthProvider } from './contexts/ViewerAuthContext';
import Layout from './components/common/Layout';          // ← ✅ CHANGED
//import Navbar from './components/common/Navbar';
import MobileBottomNav from './components/common/MobileBottomNav';
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
import RecentVideos from './pages/RecentVideos';
import SearchPage from './pages/SearchPage';

// Viewer Pages
import LikedVideos from './pages/viewer/LikedVideos';
import MyComments from './pages/viewer/MyComments';
import FollowedEditors from './pages/viewer/FollowedEditors';

function App() {
    return (
        <SharedAuthProvider>
            <AuthProvider>
                <ViewerAuthProvider>
                    <Routes>
                        {/* ✅ ALL ROUTES use Layout */}
                        <Route element={<Layout />}>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/video/:id" element={<VideoDetail />} />
                            <Route path="/recent" element={<RecentVideos />} />
                            <Route path="/videos" element={<VideosPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />

                            {/* Viewer Routes (Protected) */}
                            <Route path="/liked" element={
                                <ViewerProtectedRoute>
                                    <LikedVideos />
                                </ViewerProtectedRoute>
                            } />
                            <Route path="/comments" element={
                                <ViewerProtectedRoute>
                                    <MyComments />
                                </ViewerProtectedRoute>
                            } />
                            <Route path="/followed" element={
                                <ViewerProtectedRoute>
                                    <FollowedEditors />
                                </ViewerProtectedRoute>
                            } />
                            <Route path="/playlist/new" element={
                                <ViewerProtectedRoute>
                                    <div className="text-white p-8">New Playlist Page</div>
                                </ViewerProtectedRoute>
                            } />

                            {/* ✅ Editor Dashboard - INSIDE Layout */}
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
                    <MobileBottomNav />
                </ViewerAuthProvider>
            </AuthProvider>
        </SharedAuthProvider>
    );
}

export default App;