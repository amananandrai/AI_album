'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useContext, useEffect, useState, useRef } from "react";
import { GalleryContext } from "../context/gallery";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SortControls } from "./sortControls";

export function ImageGallery() {
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const { images, totalPages, fetchImages, setImages } = useContext(GalleryContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);

    const toggleModal = (src: string) => {
        setIsModalOpen(!isModalOpen);
        setModalImage(src);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalImage("");
    };

    const handleSortChange = (newSortBy: string, newSortOrder: string) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setPage(0); // Reset to first page when sorting changes
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleCloseModal();
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            handleCloseModal();
        }
    };

    useEffect(() => {
        setImages([]); // Clear the images before loading new ones
        fetchImages(page, sortBy, sortOrder).then((data) => {
            setImages(data.rows);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sortBy, sortOrder]);

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen]);

    if (images.length === 0) {
        return <div>Loading...</div>
    }

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(
                    <Button
                        key={i}
                        variant={page === i ? "default" : "ghost"}
                        onClick={() => setPage(i)}
                    >
                        <span>{i + 1}</span>
                    </Button>
                );
            }
        } else {
            let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow);

            if (endPage - startPage < maxPagesToShow) {
                startPage = Math.max(0, endPage - maxPagesToShow);
            }

            for (let i = startPage; i < endPage; i++) {
                pageNumbers.push(
                    <Button
                        key={i}
                        variant={page === i ? "default" : "ghost"}
                        onClick={() => setPage(i)}
                    >
                        <span>{i + 1}</span>
                    </Button>
                );
            }

            if (startPage > 0) {
                pageNumbers.unshift(<Button key="start-ellipsis" variant="ghost">...</Button>);
            }
            if (endPage < totalPages) {
                pageNumbers.push(<Button key="end-ellipsis" variant="ghost">...</Button>);
            }
        }

        return pageNumbers;
    };

    return (
        <div className="flex justify-center items-center flex-col space-y-8">
            <SortControls 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full max-w-6xl">
                {images.map((src, index) => (
                    <div key={index} className="group">
                        <Button
                            onClick={() => toggleModal(src)}
                            className="w-full h-full bg-transparent p-0 m-0 hover:scale-105 transition-transform duration-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl">
                            <GalleryImage src={src} loading="eager" fullscreen={false} />
                        </Button>
                    </div>
                ))}
                {isModalOpen && (
                    <div
                        id="extralarge-modal"
                        className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <div className="relative w-full max-w-4xl max-h-[90vh]" ref={modalRef}>
                            <div className="relative bg-white rounded-lg shadow-2xl">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <button
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors"
                                        onClick={handleCloseModal}
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
            </div>
            <div className="flex flex-wrap gap-2 justify-center items-center">
                <div className="flex justify-center items-center">
                    <Button 
                        variant="outline"
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                        className="flex items-center space-x-1"
                    >
                        <span>First</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button 
                        variant="outline"
                        disabled={page === 0}
                        onClick={() => page > 0 && setPage(page - 1)}
                        className="flex items-center space-x-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                </div>
                {renderPageNumbers()}
                <div className="flex justify-center items-center">
                    <Button 
                        variant="outline"
                        disabled={page >= totalPages - 1}
                        onClick={() => page < totalPages - 1 && setPage(page + 1)}
                        className="flex items-center space-x-1"
                    >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button 
                        variant="outline"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(totalPages - 1)}
                        className="flex items-center space-x-1"
                    >
                        <span>Last</span>
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
            className={`${fullscreen ? "aspect-auto h-full w-auto object-contain max-h-[70vh]" : "aspect-square object-cover h-auto max-w-full rounded-lg"}`}
            sizes="100vw"
            placeholder="blur"
            loading={loading}
            blurDataURL={src}
            width="0"
            height="0"
        />
    );
}
