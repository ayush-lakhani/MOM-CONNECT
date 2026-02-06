import { useState } from 'react';
import { Alert } from 'react-native';

export const useProductUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const createListing = async (productData: any, images: any[], user: any) => {
        setUploading(true);
        setProgress(0.1);

        return new Promise<boolean>((resolve) => {
            // MIMIC UPLOAD PROCESS
            setTimeout(() => setProgress(0.3), 800);
            setTimeout(() => setProgress(0.6), 1600);
            setTimeout(() => setProgress(0.9), 2400);

            setTimeout(() => {
                setUploading(false);
                setProgress(1);
                resolve(true); // Always success
            }, 3000);
        });
    };

    return { createListing, uploading, progress };
};
