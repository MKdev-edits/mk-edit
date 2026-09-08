// src/pages/viewer/MyComments.jsx
import { useState, useEffect } from 'react';
import { useViewerAuth } from '../../contexts/ViewerAuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function MyComments() {
    const { viewer } = useViewerAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [viewer]);

    const fetchComments = async () => {
        if (!viewer) return;
        setLoading(true);

        // This assumes you have a comments table
        const { data } = await supabase
            .from('video_comments')
            .select('*, videos(*)')
            .eq('viewer_id', viewer.id)
            .order('created_at', { ascending: false });

        setComments(data || []);
        setLoading(false);
    };

    if (loading) {
        return <div className="text-gray-400">Loading comments...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">💬 My Comments</h1>
            <p className="text-gray-400 text-sm mb-6">{comments.length} comments you've made</p>

            {comments.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <i className="fas fa-comment text-5xl text-gray-500 mb-3"></i>
                    <p className="text-gray-400">You haven't commented on any videos yet</p>
                    <Link to="/" className="text-supabase-green text-sm hover:underline inline-block mt-2">
                        Browse videos
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map(comment => (
                        <Link
                            key={comment.id}
                            to={`/video/${comment.video_id}`}
                            className="block bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
                        >
                            <p className="text-gray-300">{comment.content}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <span>On: {comment.videos?.title || 'Video'}</span>
                                <span>•</span>
                                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}