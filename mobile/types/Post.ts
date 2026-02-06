export interface Post {
    _id: string;
    content: string;
    user: {
        name: string;
        avatar: string;
        location: string;
    };
    likes: number;
    comments: number;
    time: string;
    image?: string;
}
