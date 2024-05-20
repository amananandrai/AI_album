'use client';
import { createContext, useEffect, useState } from "react";
import { ImageResponse } from "../types/ExtendNextApiReqeuest";

export const GalleryContext = createContext<{
    images: string[];
    totalPages: number;
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
    loadPage: (page: number) => Promise<void>
}>({
    images: [],
    totalPages: 1,
    setImages: () => { },
    loadPage: async () => { }
});

export function GalleryProvider({ children }: { children: React.ReactNode }) {
    const [images, setImages] = useState<string[]>([]);
    const [totalPages, setTotalPage] = useState(1);
    const LIMIT = 9;
    const fetchImages = async (page: number) => {
        const limit = LIMIT;
        const res = await fetch(`/api/images?limit=${limit}&offset=${page * limit}`);
        const data: ImageResponse = await res.json();
        return data;
    }
    const loadPage = (async (page: number) => {
        const data = await fetchImages(page);
        setImages(prev => [...data.rows, ...prev]);

    })
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
        loadPage,
        totalPages
    }}>
        {children}
    </GalleryContext.Provider>
}
