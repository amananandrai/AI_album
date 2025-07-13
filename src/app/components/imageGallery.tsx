'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useContext, useEffect, useState, useRef } from "react";
import { GalleryContext } from "../context/gallery";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { SortControls } from "./sortControls";
import { IFile } from "../models/Files";

export function ImageGallery() {
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const { images, totalPages, fetchImages, setImages, likeImage, hasLiked } = useContext(GalleryContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<IFile | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<string>('');

    const toggleModal = (image: IFile) => {
        setIsModalOpen(!isModalOpen);
        setModalImage(image);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    const handleLike = async (e: React.MouseEvent, imageId: string) => {
        e.stopPropagation(); // Prevent modal from opening
        await likeImage(imageId);
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

    // Get unique models and tags for filter options
    const allModels = Array.from(new Set(images.map(img => img.aiModel).filter(Boolean)));
    const allTags = Array.from(new Set(images.flatMap(img => img.tags || []).filter(Boolean)));

    // Filter images based on selected model and tag
    const filteredImages = images.filter(image => {
        const matchesModel = !selectedModel || image.aiModel === selectedModel;
        const matchesTag = !selectedTag || (image.tags && image.tags.includes(selectedTag));
        return matchesModel && matchesTag;
    });

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(
                    <Button
                        key={i}
                        className={
                          page === i
                            ? "bg-tertiary text-accent font-bold border border-primary"
                            : "bg-secondary text-accent hover:bg-tertiary hover:text-accent"
                        }
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
                        className={
                          page === i
                            ? "bg-tertiary text-accent font-bold border border-primary"
                            : "bg-secondary text-accent hover:bg-tertiary hover:text-accent"
                        }
                        onClick={() => setPage(i)}
                    >
                        <span>{i + 1}</span>
                    </Button>
                );
            }

            if (startPage > 0) {
                pageNumbers.unshift(<Button key="start-ellipsis" className="bg-accent text-primary hover:bg-tertiary hover:text-accent">...</Button>);
            }
            if (endPage < totalPages) {
                pageNumbers.push(<Button key="end-ellipsis" className="bg-accent text-primary hover:bg-tertiary hover:text-accent">...</Button>);
            }
        }

        return pageNumbers;
    };

    return (
        <>
            <SortControls 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 p-4 bg-secondary text-accent rounded-lg shadow-sm border border-primary w-full max-w-6xl">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-accent">Filter by:</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* AI Model Filter */}
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="px-3 py-2 bg-secondary text-accent border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary"
                    >
                        <option value="">All Models</option>
                        {allModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>

                    {/* Tag Filter */}
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="px-3 py-2 bg-secondary text-accent border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary"
                    >
                        <option value="">All Tags</option>
                        {allTags.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    {(selectedModel || selectedTag) && (
                        <Button
                            onClick={() => {
                                setSelectedModel('');
                                setSelectedTag('');
                            }}
                            className="bg-tertiary text-accent hover:bg-primary"
                            size="sm"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full max-w-6xl">
                {filteredImages.map((image, index) => {
                    const liked = hasLiked(image._id);
                    return (
                        <div key={index} className="group relative">
                            <Button
                                onClick={() => toggleModal(image)}
                                className="w-full h-full bg-transparent p-0 m-0 hover:scale-105 transition-transform duration-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl">
                                <GalleryImage src={image.uri} loading="eager" fullscreen={false} />
                            </Button>
                            {/* Heart Icon Overlay */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                                <Button
                                    onClick={(e) => handleLike(e, image._id)}
                                    className="p-1 h-auto w-auto bg-transparent hover:bg-transparent"
                                    size="sm"
                                    disabled={liked}
                                    aria-label={liked ? 'Liked' : 'Like'}
                                >
                                    <Heart className="h-4 w-4" style={{ color: liked ? 'red' : (image.likes ? 'rgba(255,255,255,0.8)' : 'transparent'), fill: liked ? 'red' : 'none', stroke: liked ? 'red' : 'white' }} />
                                </Button>
                                <span className="text-white text-sm font-medium">{image.likes || 0}</span>
                            </div>
                            {/* Tags and AI Model */}
                            <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
                                {image.aiModel && (
                                    <span className="bg-tertiary text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">{image.aiModel}</span>
                                )}
                                <div className="flex flex-wrap gap-1">
                                    {image.tags && image.tags.map((tag, i) => (
                                        <span key={i} className="bg-primary text-white text-xs px-2 py-0.5 rounded-full shadow">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {isModalOpen && modalImage && (
                    <div
                        id="extralarge-modal"
                        className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <div className="relative w-full max-w-4xl max-h-[90vh]" ref={modalRef}>
                            <div className="relative bg-white rounded-lg shadow-2xl">
                                {/* Modal Title: Image Name */}
                                <div className="flex flex-col items-center justify-center p-4 border-b">
                                    <h2 className="text-lg font-bold text-primary text-center w-full truncate" title={modalImage.fileName}>{modalImage.fileName}</h2>
                                </div>
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={(e) => handleLike(e, modalImage._id)}
                                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                                            size="sm"
                                            disabled={hasLiked(modalImage._id)}
                                            aria-label={hasLiked(modalImage._id) ? 'Liked' : 'Like'}
                                        >
                                            <Heart className="h-4 w-4" style={{ color: hasLiked(modalImage._id) ? 'white' : (modalImage.likes ? 'rgba(255,255,255,0.8)' : 'transparent'), fill: hasLiked(modalImage._id) ? 'white' : 'none', stroke: hasLiked(modalImage._id) ? 'white' : 'red' }} />
                                            <span>{modalImage.likes || 0}</span>
                                        </Button>
                                    </div>
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
                                {/* AI Model and Tags in Modal */}
                                <div className="flex flex-col gap-2 p-4">
                                    {modalImage.aiModel && (
                                        <span className="bg-tertiary text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow self-start">{modalImage.aiModel}</span>
                                    )}
                                    <div className="flex flex-wrap gap-1">
                                        {modalImage.tags && modalImage.tags.map((tag, i) => (
                                            <span key={i} className="bg-primary text-white text-xs px-2 py-0.5 rounded-full shadow">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <GalleryImage src={modalImage.uri} loading="lazy" fullscreen={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center items-center">
                <div className="flex justify-center items-center">
                    <Button 
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-1"
                    >
                        <span>First</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button 
                        disabled={page === 0}
                        onClick={() => page > 0 && setPage(page - 1)}
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                </div>
                {renderPageNumbers()}
                <div className="flex justify-center items-center">
                    <Button 
                        disabled={page >= totalPages - 1}
                        onClick={() => page < totalPages - 1 && setPage(page + 1)}
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-1"
                    >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(totalPages - 1)}
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-1"
                    >
                        <span>Last</span>
                    </Button>
                </div>
            </div>
        </>
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
