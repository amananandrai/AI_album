'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageResponse } from "../types/ExtendNextApiReqeuest";

export function ImageGallery() {
    const [images, setImages] = useState<string[]>([]);

    const fetchImages = async (offset: number) => {
        const res = await fetch("/api/images?offset=" + offset);
        const data: ImageResponse = await res.json();
        console.debug("🚀  file: imageGallery.tsx:14  fetchImages  data:", data);

        setImages(prev => [...data.rows, ...prev]);
        return data.total;
    }


    useEffect(() => {
        fetchImages(0);
    }, [])
    return (
        <div className="grid gap-1  md:grid-cols-3 grid-rows-3">
            {images.map((src, index) => (
                <Dialog key={index}>
                    <DialogTrigger asChild>
                        <Button className="w-full h-full bg-transparent hover:border-primary-500">
                            <GalleryImage src={src} loading="eager" fullscreen={false} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-screen max-h-screen w-auto h-auto aspect-auto m-4">
                        <GalleryImage src={src} loading="lazy" fullscreen={true} />
                    </DialogContent>


                </Dialog>
            ))}
        </div >
    );
}


type GalleryImageProp = {
    src: string
    loading?: "eager" | "lazy" | undefined
    fullscreen: boolean
}
const GalleryImage = ({ src, loading, fullscreen }: GalleryImageProp) => {
    return (
        <Image
            alt="gallery"
            src={src}
            objectFit={!fullscreen ? "cover" : "contain"}
            layout='responsive'
            className={`top-0 left-0 rounded-lg ${fullscreen && "aspect-auto h-full w-auto"} ${!fullscreen && "aspect-square object-cover h-auto max-w-full"}`}
            sizes="100vw"
            quality={100}
            placeholder="blur"
            loading={loading}
            blurDataURL={src}
            width="0"
            height="0"
        />
    )
}