'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useState, useRef } from "react";
import { GalleryContext } from "../context/gallery";
import { ChevronLeft, ChevronRight, Heart, Filter, X, Image as ImageIcon, Sparkles, Tag, ZoomIn } from "lucide-react";
import { SortControls } from "./sortControls";
import { IFile } from "../models/Files";
import Image from "next/image";

function tileSpan(index: number) {
    const slot = index % 6;
    if (slot === 0) return "col-span-2 row-span-2";
    if (slot === 2 || slot === 3) return "col-span-1";
    return "col-span-2";
}

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

    const openModal = (image: IFile) => {
        setIsModalOpen(true);
        setModalImage(image);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    const handleLike = async (e: React.MouseEvent, imageId: string) => {
        e.stopPropagation();
        await likeImage(imageId);
    };

    const handleSortChange = (newSortBy: string, newSortOrder: string) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setPage(0);
    };

    useEffect(() => {
        let cancelled = false;
        setImages([]);
        fetchImages(page, sortBy, sortOrder).then((data) => {
            if (!cancelled) setImages(data?.rows ?? []);
        }).catch(() => {
            if (!cancelled) setImages([]);
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sortBy, sortOrder]);

    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleCloseModal();
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleCloseModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const galleryImages = images || [];
    const allModels = Array.from(new Set(galleryImages.map(img => img.aiModel).filter(Boolean)));
    const allTags = Array.from(new Set(galleryImages.flatMap(img => img.tags || []).filter(Boolean)));

    const filteredImages = galleryImages.filter(image => {
        const matchesModel = selectedModel === 'all' || !selectedModel || image.aiModel === selectedModel;
        const matchesTag = selectedTag === 'all' || !selectedTag || (image.tags && image.tags.includes(selectedTag));
        return matchesModel && matchesTag;
    });

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        const pushPage = (i: number) => {
            pageNumbers.push(
                <Button
                    key={i}
                    className={
                        page === i
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold border-0 shadow-lg w-12 h-12 rounded-xl"
                            : "glass border border-white/20 text-white hover:bg-white/10 shadow-lg w-12 h-12 rounded-xl"
                    }
                    onClick={() => setPage(i)}
                >
                    <span>{i + 1}</span>
                </Button>
            );
        };

        if (totalPages <= maxPagesToShow) {
            for (let i = 0; i < totalPages; i++) pushPage(i);
        } else {
            let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow);
            if (endPage - startPage < maxPagesToShow) {
                startPage = Math.max(0, endPage - maxPagesToShow);
            }
            if (startPage > 0) {
                pageNumbers.push(
                    <Button key="start-ellipsis" className="glass border border-white/20 text-white w-12 h-12 rounded-xl cursor-default" disabled>
                        ...
                    </Button>
                );
            }
            for (let i = startPage; i < endPage; i++) pushPage(i);
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
        <div className="space-y-8">
            <SortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            <Card className="w-full glass border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
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
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-200">AI Model</label>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full sm:w-52 px-4 py-3 glass border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/5"
                            >
                                <option value="all" className="bg-slate-800">All Models</option>
                                {allModels.map((model) => (
                                    <option key={model} value={model} className="bg-slate-800">{model}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-200">Tag</label>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="w-full sm:w-52 px-4 py-3 glass border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/5"
                            >
                                <option value="all" className="bg-slate-800">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag} className="bg-slate-800">{tag}</option>
                                ))}
                            </select>
                        </div>
                        {(selectedModel !== 'all' || selectedTag !== 'all') && (
                            <div className="flex items-end">
                                <Button
                                    onClick={() => {
                                        setSelectedModel('all');
                                        setSelectedTag('all');
                                    }}
                                    className="glass border border-white/20 text-white hover:bg-white/10"
                                    size="sm"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-slate-300 pt-4 border-t border-white/10">
                        Showing <span className="text-white font-semibold">{filteredImages.length}</span> of <span className="text-white font-semibold">{galleryImages.length}</span> images
                    </p>
                </CardContent>
            </Card>

            {filteredImages.length === 0 ? (
                <div className="flex items-center justify-center min-h-[320px]">
                    <Card className="glass border-white/20 w-full max-w-md">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-6">
                                <ImageIcon className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No Images Found</h3>
                            <p className="text-slate-300 text-center">The gallery is empty.</p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[9rem] sm:auto-rows-[11rem] gap-3 sm:gap-4">
                {filteredImages.map((image, index) => {
                    const liked = hasLiked(image._id);
                    const title = image.title || image.fileName;
                    return (
                        <article
                            key={image._id || index}
                            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 ${tileSpan(index)}`}
                        >
                            <button
                                type="button"
                                onClick={() => openModal(image)}
                                className="absolute inset-0"
                                aria-label={`View ${title}`}
                            >
                                <GalleryImage src={image.uri} alt={title} />
                            </button>
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col gap-1">
                                <p className="text-white font-semibold truncate">{title}</p>
                                {image.aiModel && (
                                    <span className="inline-flex items-center gap-1 text-xs text-purple-100">
                                        <Sparkles className="h-3 w-3" />
                                        {image.aiModel}
                                    </span>
                                )}
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="glass rounded-full p-2">
                                    <ZoomIn className="h-4 w-4 text-white" />
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => handleLike(e, image._id)}
                                    disabled={liked}
                                    aria-label={liked ? 'Liked' : 'Like'}
                                    className="glass rounded-full px-3 py-2 flex items-center gap-1"
                                >
                                    <Heart className={`h-4 w-4 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                    <span className="text-white text-sm font-semibold">{image.likes || 0}</span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
            )}

            {isModalOpen && modalImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 bg-black/90 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto" ref={modalRef}>
                        <Card className="relative glass border-white/20 shadow-2xl overflow-hidden">
                            <CardHeader className="pb-6 border-b border-white/10">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-white">
                                            {modalImage.title || modalImage.fileName}
                                        </CardTitle>
                                        <CardDescription className="text-slate-300 text-base mt-2">
                                            {modalImage.description || 'AI generated artwork'}
                                        </CardDescription>
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
                            <CardContent className="p-0">
                                <div className="flex flex-wrap items-center gap-3 p-6 border-b border-white/10">
                                    <Button
                                        onClick={(e) => handleLike(e, modalImage._id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl ${hasLiked(modalImage._id)
                                            ? 'bg-red-500 text-white'
                                            : 'glass border border-white/20 text-white hover:bg-white/10'
                                            }`}
                                        disabled={hasLiked(modalImage._id)}
                                    >
                                        <Heart className={`h-5 w-5 ${hasLiked(modalImage._id) ? 'fill-white' : ''}`} />
                                        <span>{modalImage.likes || 0} Likes</span>
                                    </Button>
                                    {modalImage.aiModel && (
                                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            {modalImage.aiModel}
                                        </span>
                                    )}
                                </div>
                                {modalImage.tags && modalImage.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-white/10">
                                        {modalImage.tags.map((tag, i) => (
                                            <span key={i} className="glass border border-white/20 text-white text-sm px-3 py-1 rounded-full inline-flex items-center gap-2">
                                                <Tag className="h-4 w-4" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {modalImage.prompts && (
                                    <p className="px-6 py-4 text-slate-300 border-b border-white/10 whitespace-pre-wrap">
                                        {modalImage.prompts}
                                    </p>
                                )}
                                <div className="p-6">
                                    <GalleryImage src={modalImage.uri} alt={modalImage.title || modalImage.fileName} fullscreen />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex flex-wrap gap-3 justify-center items-center">
                    <Button
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                        First
                    </Button>
                    <Button
                        disabled={page === 0}
                        onClick={() => page > 0 && setPage(page - 1)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Previous
                    </Button>
                    <div className="flex gap-2">{renderPageNumbers()}</div>
                    <Button
                        disabled={page >= totalPages - 1}
                        onClick={() => page < totalPages - 1 && setPage(page + 1)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                        Next
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(totalPages - 1)}
                        className="glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                        Last
                    </Button>
                </div>
            )}
        </div>
    );
}

function GalleryImage({ src, alt, fullscreen = false }: { src: string; alt: string; fullscreen?: boolean }) {
    if (fullscreen) {
        return (
            <Image
                alt={alt}
                src={src}
                width={1600}
                height={1200}
                className="h-auto w-full object-contain max-h-[70vh] rounded-xl"
                sizes="(max-width: 1024px) 100vw, 1024px"
            />
        );
    }

    return (
        <Image
            alt={alt}
            src={src}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
        />
    );
}
