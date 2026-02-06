import { Product } from './Product';

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    city: string;
    avatar: string;
    listings: Product[];
    stats: {
        sold: number;
        active: number;
        earnings: number;
    };
    rating: number;
}
