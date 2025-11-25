export interface User {
  _id: string;
  name: string;
  email: string;
  isCreator?: boolean;
  isVerified?: boolean;
  walletBalance?: number;
  profileImage?: string;
}

export interface Post {
  _id: string;
  userId: User;
  text: string;
  image?: string;
  audioUrl?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  userId: string;
  text: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  seller: User;
  stock: number;
  category: string;
  createdAt: string;
}