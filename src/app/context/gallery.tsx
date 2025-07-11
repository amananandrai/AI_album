'use client';
import { createContext, useEffect, useState } from "react";
import { ImageResponse } from "../types/ExtendNextApiReqeuest";

export const GalleryContext = createContext<{
    images: string[];
    totalPages: number;
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
    fetchImages: (page: number, sortBy?: string, sortOrder?: string) => Promise<ImageResponse>
}>({
    images: [],
    totalPages: 1,
    setImages: () => { },
    fetchImages: function (page: number, sortBy?: string, sortOrder?: string): Promise<ImageResponse> {
        throw new Error("Function not implemented.");
    }
});

export function GalleryProvider({ children }: { children: React.ReactNode }) {
    const [images, setImages] = useState<string[]>([]);
    const [totalPages, setTotalPage] = useState(1);
    const LIMIT = 9;
    const fetchImages = async (page: number, sortBy: string = 'createdAt', sortOrder: string = 'desc') => {
        const limit = LIMIT;
        const res = await fetch(`/api/images?limit=${limit}&offset=${page * limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const data: ImageResponse = await res.json();
        return data;
    }
    useEffect(() => {
        fetchImages(0).then(data => {
            setImages(data.rows);
            setTotalPage(Math.ceil(data.total / LIMIT))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <GalleryContext.Provider value={{
        images,
        setImages,
        fetchImages,
        totalPages
    }}>
        {children}
    </GalleryContext.Provider>
}
