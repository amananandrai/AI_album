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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");

    const toggleModal = (src: string) => {
        setIsModalOpen(!isModalOpen);
        setModalImage(src);
    };
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
                    <>
                        <Button key={index}
                            onClick={() => toggleModal(src)}
                            data-modal-target="extralarge-modal" data-modal-toggle="extralarge-modal" className="w-full h-full bg-transparent p-1 m-0">
                            <GalleryImage src={src} loading="eager" fullscreen={false} />
                        </Button>
                        {isModalOpen && (
                            <div
                                id="extralarge-modal"
                                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full"
                            >
                                <div className="relative w-full max-w-2xl max-h-auto">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <button
                                                type="button"
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={() => toggleModal(src)}
                                            >
                                                <svg
                                                    className="w-3 h-3"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                    />
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        <GalleryImage src={modalImage} loading="lazy" fullscreen={true} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
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
            className={`top-0 left-0 rounded-lg ${fullscreen && "aspect-auto h-full w-auto object-cover"} ${!fullscreen && "aspect-square object-cover h-auto max-w-full"}`}
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
