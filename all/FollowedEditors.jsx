// src/pages/viewer/FollowedEditors.jsx
import { useState, useEffect } from 'react';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function FollowedEditors() {
    const { viewer } = useViewerAuth();
    const [editors, setEditors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFollowedEditors();
    }, [viewer]);

    const fetchFollowedEditors = async () => {
        if (!viewer) return;
        setLoading(true);

        const { data } = await supabase
            .from('follows')
            .select('editor_id, profiles(*)')
            .eq('viewer_id', viewer.id)
            .order('created_at', { ascending: false });

        if (data) {
            const editorList = data.map(item => item.profiles).filter(p => p);
            setEditors(editorList);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="text-gray-400">Loading followed editors...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">👥 Followed Editors</h1>
            <p className="text-gray-400 text-sm mb-6">{editors.length} editors you follow</p>

            {editors.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <i className="fas fa-users text-5xl text-gray-500 mb-3"></i>
                    <p className="text-gray-400">You're not following any editors yet</p>
                    <Link to="/" className="text-supabase-green text-sm hover:underline inline-block mt-2">
                        Browse editors
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editors.map(editor => (
                        <div key={editor.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-supabase-green/50 transition-all">
                            <div className="flex items-center gap-3">
                                {editor.profile_image ? (
                                    <img
                                        src={editor.profile_image}
                                        alt={editor.name}
                                        className="w-12 h-12 rounded-full object-cover border border-supabase-green/50"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-supabase-green to-emerald-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{editor.name?.charAt(0) || 'E'}</span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-white font-medium">{editor.name}</h3>
                                    <p className="text-gray-400 text-sm">{editor.tagline || 'Video Editor'}</p>
                                    <Link
                                        to={`//${editor.subdomain || 'editor'}.yourdomain.com`}
                                        className="text-supabase-green text-xs hover:underline"
                                        target="_blank"
                                    >
                                        Visit website →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}