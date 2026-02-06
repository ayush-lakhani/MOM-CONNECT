import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Product } from '../types/Product';
// import { io } from 'socket.io-client'; // Socket separate

// Use the same base for socket if needed
const SOCKET_URL = 'http://10.90.125.67:5000';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        // const socket = io(SOCKET_URL);
        // socket.on...

        return () => {
            // socket.disconnect();
        };
    }, []);

    return { products, loading, refetch: fetchProducts };
};
