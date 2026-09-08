// src/components/editor/ProfileImageUpload.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useDominantColor } from '../../hooks/useDominantColor';

export default function ProfileImageUpload({ isOpen, onClose, onSuccess }) {
    const { user, profile, updateProfile } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // ✅ Get dominant color for glowing border
    const { palette } = useDominantColor(previewUrl || profile?.profile_image || null);

    // ✅ Set preview when modal opens
    useEffect(() => {
        if (isOpen && profile?.profile_image) {
            setPreviewUrl(profile.profile_image);
        }
    }, [isOpen, profile]);

    if (!isOpen) return null;

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // ✅ Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // ✅ Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setError('');
        setUploading(true);
        setPreviewUrl(URL.createObjectURL(file));

        try {
            // ✅ Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `profile_${user.id}_${Date.now()}.${fileExt}`;
            const filePath = `profiles/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('profile-images')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // ✅ Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-images')
                .getPublicUrl(filePath);

            // ✅ Update profile
            const { error: updateError } = await updateProfile({ profile_image: publicUrl });

            if (updateError) throw updateError;

            // ✅ Success
            setPreviewUrl(publicUrl);
            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
            setPreviewUrl(profile?.profile_image || null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!confirm('Remove your profile photo?')) return;

        setUploading(true);
        try {
            const { error } = await updateProfile({ profile_image: null });
            if (!error) {
                setPreviewUrl(null);
                setTimeout(() => {
                    onSuccess();
                }, 500);
            }
        } catch (err) {
            console.error('Remove photo error:', err);
            setError('Failed to remove photo');
        } finally {
            setUploading(false);
        }
    };

    // ✅ Glowing border style
    const getGlowStyle = () => {
        if (palette) {
            return {
                boxShadow: `0 0 30px ${palette.main}, 0 0 60px ${palette.dark}`,
                border: `3px solid ${palette.main}`,
            };
        }
        return {
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            border: '3px solid #10B981',
        };
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <i className="fas fa-times text-lg"></i>
                </button>

                <h3 className="text-white font-semibold mb-4">Profile Photo</h3>

                {/* ✅ Profile Image with Glowing Border */}
                <div
                    className="w-40 h-40 rounded-full mx-auto overflow-hidden mb-4 transition-all duration-500"
                    style={getGlowStyle()}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                            <i className="fas fa-user text-white text-6xl"></i>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-red-400 text-xs mb-3">{error}</p>
                )}

                {/* ✅ Buttons */}
                <div className="space-y-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full py-2 bg-supabase-green hover:bg-supabase-green/80 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50"
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fas fa-spinner fa-spin"></i>
                                Uploading...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fas fa-camera"></i>
                                Choose Photo
                            </span>
                        )}
                    </button>

                    {previewUrl && !uploading && (
                        <button
                            onClick={handleRemovePhoto}
                            className="w-full py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl text-sm font-medium transition-all"
                        >
                            <i className="fas fa-trash-alt mr-2"></i>
                            Remove Photo
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 text-sm font-medium transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}