import { useState, useEffect } from 'react';
import { User } from '../types/User';
import { Product } from '../types/Product';

export const MOCK_USER: User = {
    _id: 'mock_user_1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    city: 'Bengaluru',
    avatar: 'https://i.pravatar.cc/100?img=5',
    listings: [
        { _id: '1', name: 'Baby Crib Like New', price: 2500, category: 'Baby Gear', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', seller: { name: 'Priya Sharma' }, status: 'active', views: 124 },
        { _id: '101', name: 'Stroller (Chicco)', price: 3000, category: 'Baby Gear', image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc', seller: { name: 'Priya Sharma' }, status: 'sold', views: 450 },
        { _id: '102', name: 'High Chair', price: 1500, category: 'Baby Gear', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4', seller: { name: 'Priya Sharma' }, status: 'sold', views: 320 },
    ] as Product[],
    stats: {
        sold: 2,
        active: 1,
        earnings: 4500
    },
    rating: 4.8
};

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setUser(MOCK_USER);
            setLoading(false);
        }, 500);
    }, []);

    return { user, loading };
};
