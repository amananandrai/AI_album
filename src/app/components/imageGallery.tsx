'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GallerySkeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useContext, useEffect, useState, useRef, FormEvent } from "react";
import { GalleryContext } from "../context/gallery";
import { ChevronLeft, ChevronRight, Heart, Filter, X, Image as ImageIcon, Sparkles, Tag, Eye, Download, Share2, ZoomIn } from "lucide-react";
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
                <Card className="glass border-white/20 w-full max-w-md animate-fade-in">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-6 animate-glow">
                            <ImageIcon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No Images Found</h3>
                        <p className="text-slate-300 text-center mb-6">The gallery is empty. Be the first to upload an image!</p>
                        <a 
                            href="/upload" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                        >
                            <Sparkles className="h-4 w-4" />
                            Upload First Image
                        </a>
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
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold border-0 shadow-lg w-12 h-12 rounded-xl"
                            : "glass border border-white/20 text-white hover:bg-white/10 shadow-lg w-12 h-12 rounded-xl transition-all duration-300 hover:scale-105"
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
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold border-0 shadow-lg w-12 h-12 rounded-xl"
                            : "glass border border-white/20 text-white hover:bg-white/10 shadow-lg w-12 h-12 rounded-xl transition-all duration-300 hover:scale-105"
                        }
                        onClick={() => setPage(i)}
                    >
                        <span>{i + 1}</span>
                    </Button>
                );
            }

            if (startPage > 0) {
                pageNumbers.unshift(
                    <Button key="start-ellipsis" className="glass border border-white/20 text-white w-12 h-12 rounded-xl cursor-default" disabled>
                        ...
                    </Button>
                );
            }
            if (endPage < totalPages) {
                pageNumbers.push(
                    <Button key="end-ellipsis" className="glass border border-white/20 text-white w-12 h-12 rounded-xl cursor-default" disabled>
                        ...
                    </Button>
                );
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
            <Card className="w-full max-w-6xl glass border-white/20 shadow-2xl animate-fade-in">
                <CardHeader className="pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                            <Filter className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-white font-bold">Filter Gallery</CardTitle>
                            <CardDescription className="text-slate-300 text-lg">
                                Filter images by AI model and tags
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-white text-lg">Filter by:</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                            {/* AI Model Filter */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-200">AI Model</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full sm:w-52 px-4 py-3 glass border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/5"
                                >
                                    <option value="all" className="bg-slate-800">All Models</option>
                                    {allModels.map((model) => (
                                        <option key={model} value={model} className="bg-slate-800">{model}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tag Filter */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-200">Tag</label>
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="w-full sm:w-52 px-4 py-3 glass border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/5"
                                >
                                    <option value="all" className="bg-slate-800">All Tags</option>
                                    {allTags.map((tag) => (
                                        <option key={tag} value={tag} className="bg-slate-800">{tag}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters */}
                            {(selectedModel !== 'all' || selectedTag !== 'all') && (
                                <div className="flex items-end">
                                    <Button
                                        onClick={() => {
                                            setSelectedModel('all');
                                            setSelectedTag('all');
                                        }}
                                        className="glass border border-white/20 text-white hover:bg-white/10 shadow-lg transition-all duration-300 hover:scale-105"
                                        size="sm"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <p className="text-slate-300">
                            Showing <span className="text-white font-semibold">{filteredImages.length}</span> of <span className="text-white font-semibold">{images.length}</span> images
                        </p>
                        {(selectedModel !== 'all' || selectedTag !== 'all') && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                Filtered
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Grid */}
            <div className="grid gap-4 sm:gap-5 md:gap-4 lg:gap-5 grid-cols-3 w-full max-w-7xl">
                {filteredImages.map((image, index) => {
                    const liked = hasLiked(image._id);
                    return (
                        <Card key={index} className="group relative overflow-hidden glass border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:border-white/20 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                            <CardContent className="p-0">
                                <Button
                                    onClick={() => toggleModal(image)}
                                    className="w-full h-full bg-transparent p-0 m-0 hover:bg-transparent relative overflow-hidden">
                                    <GalleryImage src={image.uri} loading="eager" fullscreen={false} />
                                    
                                    {/* Overlay with info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                        <div className="flex items-center gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="p-3 glass rounded-full">
                                                <ZoomIn className="h-6 w-6 text-white" />
                                            </div>
                                            <span className="text-white font-medium">View Details</span>
                                        </div>
                                    </div>
                                </Button>
                                
                                {/* Heart Icon Overlay */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 glass rounded-full px-4 py-2 backdrop-blur-md">
                                    <Button
                                        onClick={(e) => handleLike(e, image._id)}
                                        className="p-1 h-auto w-auto bg-transparent hover:bg-transparent transition-transform duration-200 hover:scale-110"
                                        size="sm"
                                        disabled={liked}
                                        aria-label={liked ? 'Liked' : 'Like'}
                                    >
                                        <Heart className={`h-5 w-5 transition-colors duration-200 ${liked ? 'text-red-500 fill-red-500' : 'text-white hover:text-red-400'}`} />
                                    </Button>
                                    <span className="text-white text-sm font-semibold">{image.likes || 0}</span>
                                </div>
                                
                                {/* Tags and AI Model */}
                                <div className="absolute bottom-4 left-4 flex flex-col gap-2 items-start max-w-[calc(100%-8rem)]">
                                    {image.aiModel && (
                                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-2 shadow-lg flex items-center gap-2 rounded-full backdrop-blur-sm">
                                            <Sparkles className="h-3 w-3" />
                                            {image.aiModel}
                                        </span>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {image.tags && image.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="glass text-white text-xs px-3 py-1 shadow-lg flex items-center gap-1 rounded-full backdrop-blur-sm">
                                                <Tag className="h-3 w-3" />
                                                {tag}
                                            </span>
                                        ))}
                                        {image.tags && image.tags.length > 2 && (
                                            <span className="glass text-white text-xs px-3 py-1 shadow-lg rounded-full backdrop-blur-sm">
                                                +{image.tags.length - 2}
                                            </span>
                                        )}
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
                    className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
                >
                    <div className="relative w-full max-w-5xl max-h-[95vh] animate-scale-in" ref={modalRef}>
                        <Card className="relative glass border-white/20 shadow-2xl overflow-hidden">
                            {/* Modal Header */}
                            <CardHeader className="pb-6 border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                                            <ImageIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-white truncate max-w-md" title={modalImage.fileName}>
                                                {modalImage.fileName}
                                            </CardTitle>
                                            <CardDescription className="text-slate-300 text-base">
                                                AI Generated Artwork
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleCloseModal}
                                        className="glass border border-white/20 text-white hover:bg-white/10 p-3"
                                        size="sm"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Modal Content */}
                            <CardContent className="p-0">
                                {/* Action Bar */}
                                <div className="flex items-center justify-between p-6 border-b border-white/10">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={(e) => handleLike(e, modalImage._id)}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                                                hasLiked(modalImage._id) 
                                                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                                                    : 'glass border border-white/20 text-white hover:bg-white/10'
                                            }`}
                                            disabled={hasLiked(modalImage._id)}
                                            aria-label={hasLiked(modalImage._id) ? 'Liked' : 'Like'}
                                        >
                                            <Heart className={`h-5 w-5 ${hasLiked(modalImage._id) ? 'fill-white' : ''}`} />
                                            <span>{modalImage.likes || 0} Likes</span>
                                        </Button>
                                        <Button className="glass border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button className="glass border border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>

                                {/* AI Model and Tags */}
                                <div className="flex flex-col gap-4 p-6 border-b border-white/10">
                                    {modalImage.aiModel && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-300 font-medium">AI Model:</span>
                                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-2 shadow-lg flex items-center gap-2 rounded-full">
                                                <Sparkles className="h-4 w-4" />
                                                {modalImage.aiModel}
                                            </span>
                                        </div>
                                    )}
                                    {modalImage.tags && modalImage.tags.length > 0 && (
                                        <div className="flex flex-col gap-3">
                                            <span className="text-slate-300 font-medium">Tags:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {modalImage.tags.map((tag, i) => (
                                                    <span key={i} className="glass border border-white/20 text-white text-sm px-4 py-2 shadow-lg flex items-center gap-2 rounded-full backdrop-blur-sm">
                                                        <Tag className="h-4 w-4" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="p-6">
                                    <div className="rounded-xl overflow-hidden shadow-2xl">
                                        <GalleryImage src={modalImage.uri} loading="lazy" fullscreen={true} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap gap-4 justify-center items-center mt-16 animate-fade-in">
                    <Button 
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <span>First</span>
                    </Button>
                    <Button 
                        disabled={page === 0}
                        onClick={() => page > 0 && setPage(page - 1)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span>Previous</span>
                    </Button>
                    
                    <div className="flex gap-2">
                        {renderPageNumbers()}
                    </div>
                    
                    <Button 
                        disabled={page >= totalPages - 1}
                        onClick={() => page < totalPages - 1 && setPage(page + 1)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <span>Next</span>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(totalPages - 1)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <span>Last</span>
                    </Button>
                </div>
            )}
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
