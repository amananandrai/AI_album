'use client';
import { createContext, useEffect, useState } from "react";
import { ImageResponse } from "../types/ExtendNextApiReqeuest";
import { IFile } from "../models/Files";

function getLikedImagesFromStorage(): string[] {
    if (typeof window !== 'undefined') {
        const liked = localStorage.getItem('likedImages');
        return liked ? JSON.parse(liked) : [];
    }
    return [];
}

function setLikedImagesToStorage(ids: string[]) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('likedImages', JSON.stringify(ids));
    }
}

export const GalleryContext = createContext<{
    images: IFile[];
    totalPages: number;
    setImages: React.Dispatch<React.SetStateAction<IFile[]>>;
    fetchImages: (page: number, sortBy?: string, sortOrder?: string) => Promise<ImageResponse>;
    likeImage: (imageId: string) => Promise<void>;
    hasLiked: (imageId: string) => boolean;
}>({
    images: [],
    totalPages: 1,
    setImages: () => { },
    fetchImages: function (page: number, sortBy?: string, sortOrder?: string): Promise<ImageResponse> {
        throw new Error("Function not implemented.");
    },
    likeImage: function (imageId: string): Promise<void> {
        throw new Error("Function not implemented.");
    },
    hasLiked: function (imageId: string): boolean {
        throw new Error("Function not implemented.");
    }
});

export function GalleryProvider({ children }: { children: React.ReactNode }) {
    const [images, setImages] = useState<IFile[]>([]);
    const [totalPages, setTotalPage] = useState(1);
    const LIMIT = 9;
    const [likedImages, setLikedImages] = useState<string[]>(getLikedImagesFromStorage());

    const fetchImages = async (page: number, sortBy: string = 'createdAt', sortOrder: string = 'desc') => {
        const limit = LIMIT;
        const res = await fetch(`/api/images?limit=${limit}&offset=${page * limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const data: ImageResponse = await res.json();
        return data;
    }

    const likeImage = async (imageId: string) => {
        if (likedImages.includes(imageId)) return; // Prevent multiple likes
        try {
            const response = await fetch(`/api/images/${imageId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                setImages(prevImages => 
                    prevImages.map(img => 
                        img._id === imageId 
                            ? { ...img, likes: (img.likes || 0) + 1 }
                            : img
                    )
                );
                const updatedLiked = [...likedImages, imageId];
                setLikedImages(updatedLiked);
                setLikedImagesToStorage(updatedLiked);
            }
        } catch (error) {
            console.error('Error liking image:', error);
        }
    }

    const hasLiked = (imageId: string) => likedImages.includes(imageId);

    useEffect(() => {
        fetchImages(0).then(data => {
            setImages(data.rows);
            setTotalPage(Math.ceil(data.total / LIMIT))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLikedImages(getLikedImagesFromStorage());
    }, []);

    return <GalleryContext.Provider value={{
        images,
        setImages,
        fetchImages,
        totalPages,
        likeImage,
        hasLiked
    }}>
        {children}
    </GalleryContext.Provider>
}
