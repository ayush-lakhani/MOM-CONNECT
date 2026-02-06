import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Post } from '../types/Post';

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/community/posts');
            // Transform if needed, ensuring user object structure matches FeedCard
            setPosts(response.data.map((p: any) => ({
                ...p,
                user: {
                    name: p.user?.name || 'Anonymous',
                    avatar: p.user?.profileImage || 'https://i.pravatar.cc/100',
                    location: p.user?.location || 'Community'
                },
                time: new Date(p.createdAt).toLocaleDateString(), // Simple format
                likes: p.likes?.length || 0,
                comments: p.comments?.length || 0
            })));
        } catch (error) {
            console.error('Fetch posts error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return { posts, loading, refetch: fetchPosts };
};
