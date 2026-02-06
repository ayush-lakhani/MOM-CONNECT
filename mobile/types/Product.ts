export interface Product {
    _id: string; // Using _id to match MongoDB style mock data
    name: string;
    price: number;
    category: 'Baby Gear' | 'Clothes 0-6m' | 'Clothes 6m+' | 'Toys 0-12m' | 'Toys 1-3y' | 'Books' | 'Health' | 'Pregnancy';
    image: string;
    seller: {
        name: string;
        avatar?: string
    };
    status?: 'active' | 'sold';
    views?: number;
    description?: string;
}
