'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useContext } from "react";
import { GalleryContext } from "../context/gallery";

export function ImageGallery() {
    const { images } = useContext(GalleryContext);
    return (
        <div className="grid gap-1  md:grid-cols-3 grid-rows-3">
            {images.map((src, index) => (
                <Dialog key={index}>
                    <DialogTrigger asChild>
                        <Button className="w-full h-full bg-transparent hover:border-primary-500">
                            <GalleryImage src={src} loading="eager" fullscreen={false} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-screen max-h-screen w-auto h-auto scale-100 m-4">
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
            objectFit={!fullscreen ? "cover" : "cover"}
            layout='responsive'
            className={`top-0 left-0 rounded-lg ${fullscreen && "aspect-auto h-auto w-auto object-cover"} ${!fullscreen && "aspect-square object-cover h-auto max-w-full"}`}
            sizes="100vw"
            // quality={100}
            placeholder="blur"
            loading={loading}
            blurDataURL={src}
            width="0"
            height="0"
        />
    )
}