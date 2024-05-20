'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { GalleryContext } from "../context/gallery";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageGallery() {
    const [page, setPage] = useState(0);
    const { images, totalPages, fetchImages, setImages } = useContext(GalleryContext);

    useEffect(() => {
        console.log(totalPages)
        fetchImages(page).then((data) => {
            setImages(data.rows);
        });
    }, [page]);

    if (images.length === 0) {
        return <div>Loading...</div>
    }
    return (
        <div className="flex justify-center items-center flex-col">
            <div className="grid gap-0.5  md:grid-cols-3 grid-rows-3">
                {images.map((src, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <Button className="w-full h-full bg-transparent p-1 m-0">
                                <GalleryImage src={src} loading="eager" fullscreen={false} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-screen max-h-screen w-auto h-auto scale-100 m-4">
                            <GalleryImage src={src} loading="lazy" fullscreen={true} />
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
            <div className="flex gap-1">
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                        onClick={() => page > 0 && setPage(page - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                        onClick={() => setPage(0)}
                    >
                        <span>1</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                        onClick={() => setPage(1)}
                    >
                        <span>2</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                        onClick={() => setPage(2)}
                    >
                        <span>3</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                    >
                        <span>...</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                        onClick={() => setPage(totalPages - 2)}
                    >
                        <span>{totalPages - 1}</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                        onClick={() => setPage(totalPages - 1)}
                    >
                        <span>{totalPages}</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button variant="ghost"
                        onClick={() => page < totalPages && setPage(page + 1)}
                    >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

        </div>
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