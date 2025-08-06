'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { useContext, useEffect, useState, useRef, FormEvent } from "react";
import { GalleryContext } from "../context/gallery";
import { ChevronLeft, ChevronRight, Heart, Filter, X, Image as ImageIcon, Sparkles, Tag, Eye } from "lucide-react";
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
    const [selectedModel, setSelectedModel] = useState<string>('all');
    const [selectedTag, setSelectedTag] = useState<string>('all');

    // Upload form state
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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

    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(null);
        const form = e.currentTarget;
        const formData = new FormData(form);
        try {
            const res = await fetch('/api/images', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            setUploadSuccess('Image uploaded successfully!');
            setPage(0); // Reset to first page
            fetchImages(0, sortBy, sortOrder).then((data) => {
                setImages(data.rows);
            });
            form.reset();
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
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
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md bg-secondary/50 border-primary/20">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="h-8 w-8 text-primary/60" />
                        </div>
                        <h3 className="text-xl font-semibold text-primary mb-2">No Images Found</h3>
                        <p className="text-primary/70 text-center">The gallery is empty. Be the first to upload an image!</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Get unique models and tags for filter options
    const allModels = Array.from(new Set(images.map(img => img.aiModel).filter(Boolean)));
    const allTags = Array.from(new Set(images.flatMap(img => img.tags || []).filter(Boolean)));

    // Filter images based on selected model and tag
    const filteredImages = images.filter(image => {
        const matchesModel = selectedModel === 'all' || !selectedModel || image.aiModel === selectedModel;
        const matchesTag = selectedTag === 'all' || !selectedTag || (image.tags && image.tags.includes(selectedTag));
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
                            ? "bg-tertiary text-accent font-bold border border-primary shadow-lg"
                            : "bg-secondary text-accent hover:bg-tertiary hover:text-accent shadow-md"
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
                            ? "bg-tertiary text-accent font-bold border border-primary shadow-lg"
                            : "bg-secondary text-accent hover:bg-tertiary hover:text-accent shadow-md"
                        }
                        onClick={() => setPage(i)}
                    >
                        <span>{i + 1}</span>
                    </Button>
                );
            }

            if (startPage > 0) {
                pageNumbers.unshift(<Button key="start-ellipsis" className="bg-accent text-primary hover:bg-tertiary hover:text-accent shadow-md">...</Button>);
            }
            if (endPage < totalPages) {
                pageNumbers.push(<Button key="end-ellipsis" className="bg-accent text-primary hover:bg-tertiary hover:text-accent shadow-md">...</Button>);
            }
        }

        return pageNumbers;
    };

    return (
        <>
            {/* Upload Form */}
            <SortControls 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />
            
            {/* Filter Controls */}
            <Card className="w-full max-w-6xl bg-secondary/50 border-primary/20 shadow-xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                            <Filter className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-primary font-bold">Filter Gallery</CardTitle>
                            <CardDescription className="text-primary/70">
                                Filter images by AI model and tags
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-primary text-base">Filter by:</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* AI Model Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-primary/80">AI Model</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full sm:w-48 px-4 py-3 bg-secondary/80 border border-primary/30 text-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary"
                                >
                                    <option value="all">All Models</option>
                                    {allModels.map((model) => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tag Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-primary/80">Tag</label>
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="w-full sm:w-48 px-4 py-3 bg-secondary/80 border border-primary/30 text-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary"
                                >
                                    <option value="all">All Tags</option>
                                    {allTags.map((tag) => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters */}
                            {(selectedModel !== 'all' || selectedTag !== 'all') && (
                                <Button
                                    onClick={() => {
                                        setSelectedModel('all');
                                        setSelectedTag('all');
                                    }}
                                    variant="outline"
                                    className="border-primary/30 text-primary hover:bg-primary hover:text-accent shadow-md"
                                    size="sm"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                        <p className="text-sm text-primary/70">
                            Showing {filteredImages.length} of {images.length} images
                        </p>
                        {(selectedModel !== 'all' || selectedTag !== 'all') && (
                            <span className="bg-tertiary text-white px-3 py-1 rounded-full text-sm font-medium">
                                Filtered
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Grid */}
            <div className="grid gap-6 sm:gap-8 md:gap-6 lg:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl">
                {filteredImages.map((image, index) => {
                    const liked = hasLiked(image._id);
                    return (
                        <Card key={index} className="group relative overflow-hidden bg-secondary/30 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <CardContent className="p-0">
                                <Button
                                    onClick={() => toggleModal(image)}
                                    className="w-full h-full bg-transparent p-0 m-0 hover:bg-transparent relative overflow-hidden">
                                    <GalleryImage src={image.uri} loading="eager" fullscreen={false} />
                                    
                                    {/* Overlay with info */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Eye className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </Button>
                                
                                {/* Heart Icon Overlay */}
                                <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-2">
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
                                <div className="absolute bottom-3 left-3 flex flex-col gap-2 items-start">
                                    {image.aiModel && (
                                        <span className="bg-tertiary text-white text-xs font-semibold px-3 py-1 shadow-lg flex items-center gap-1 rounded-full">
                                            <Sparkles className="h-3 w-3" />
                                            {image.aiModel}
                                        </span>
                                    )}
                                    <div className="flex flex-wrap gap-1">
                                        {image.tags && image.tags.map((tag, i) => (
                                            <span key={i} className="bg-primary text-white text-xs px-2 py-1 shadow-lg flex items-center gap-1 rounded-full">
                                                <Tag className="h-3 w-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Modal */}
            {isModalOpen && modalImage && (
                <div
                    id="extralarge-modal"
                    className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 bg-black/80"
                >
                    <div className="relative w-full max-w-4xl max-h-[90vh]" ref={modalRef}>
                        <Card className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
                            {/* Modal Header */}
                            <CardHeader className="pb-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                            <ImageIcon className="h-5 w-5 text-accent" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-primary truncate" title={modalImage.fileName}>
                                                {modalImage.fileName}
                                            </CardTitle>
                                            <CardDescription className="text-primary/70">
                                                AI Generated Artwork
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleCloseModal}
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Modal Content */}
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={(e) => handleLike(e, modalImage._id)}
                                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white shadow-md"
                                            size="sm"
                                            disabled={hasLiked(modalImage._id)}
                                            aria-label={hasLiked(modalImage._id) ? 'Liked' : 'Like'}
                                        >
                                            <Heart className="h-4 w-4" style={{ color: hasLiked(modalImage._id) ? 'white' : (modalImage.likes ? 'rgba(255,255,255,0.8)' : 'transparent'), fill: hasLiked(modalImage._id) ? 'white' : 'none', stroke: hasLiked(modalImage._id) ? 'white' : 'red' }} />
                                            <span>{modalImage.likes || 0}</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* AI Model and Tags */}
                                <div className="flex flex-col gap-3 p-4">
                                    {modalImage.aiModel && (
                                        <div className="flex items-center gap-2">
                                            <span className="bg-tertiary text-white text-sm font-semibold px-3 py-1 shadow-md flex items-center gap-2 rounded-full">
                                                <Sparkles className="h-4 w-4" />
                                                {modalImage.aiModel}
                                            </span>
                                        </div>
                                    )}
                                    {modalImage.tags && modalImage.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {modalImage.tags.map((tag, i) => (
                                                <span key={i} className="bg-primary text-white text-sm px-3 py-1 shadow-md flex items-center gap-2 rounded-full">
                                                    <Tag className="h-4 w-4" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-200"></div>

                                {/* Image */}
                                <div className="p-4">
                                    <GalleryImage src={modalImage.uri} loading="lazy" fullscreen={true} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center mt-12 sm:mt-16">
                <div className="flex justify-center items-center">
                    <Button 
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow-md"
                    >
                        <span>First</span>
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button 
                        disabled={page === 0}
                        onClick={() => page > 0 && setPage(page - 1)}
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow-md"
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
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow-md"
                    >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <Button 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(totalPages - 1)}
                        className="bg-secondary text-accent hover:bg-tertiary hover:text-accent flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow-md"
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
