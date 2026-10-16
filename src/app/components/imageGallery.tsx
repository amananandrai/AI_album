'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import { GalleryContext } from "../context/gallery";
import { ChevronLeft, ChevronRight, Heart, Filter, X, Image as ImageIcon, Sparkles, Tag, ZoomIn } from "lucide-react";
import { SortControls } from "./sortControls";
import { IFile } from "../models/Files";
import Image from "next/image";
import { BENTO_ROW_HEIGHT, countColumnTracks, tilePlacement } from "../lib/tilePlacement";

export function ImageGallery() {
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const { images, totalPages, fetchImages, setImages, likeImage, hasLiked } = useContext(GalleryContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<IFile | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>('all');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [ratios, setRatios] = useState<Record<string, number>>({});
    const [gridMetrics, setGridMetrics] = useState({ columns: 2, columnWidth: 180, gap: 12, rowGap: 12 });

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
        setRatios((current) => {
            let changed = false;
            const next = { ...current };
            for (const image of images || []) {
                if (!image._id || current[image._id] != null) continue;
                if (image.width && image.height && image.width > 0 && image.height > 0) {
                    next[image._id] = image.width / image.height;
                    changed = true;
                }
            }
            return changed ? next : current;
        });
    }, [images]);

    const rememberSize = (id: string, width: number, height: number) => {
        if (!id || width <= 0 || height <= 0) return;
        setRatios((current) => {
            const ratio = width / height;
            if (current[id] && Math.abs(current[id] - ratio) < 0.01) return current;
            return { ...current, [id]: ratio };
        });
    };

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
    const hasTiles = filteredImages.length > 0;

    useLayoutEffect(() => {
        const element = gridRef.current;
        if (!element) return;

        const measure = () => {
            const styles = getComputedStyle(element);
            const columns = countColumnTracks(styles.gridTemplateColumns);
            const parsedGap = Number.parseFloat(styles.columnGap);
            const gap = Number.isFinite(parsedGap) ? parsedGap : 12;
            const parsedRowGap = Number.parseFloat(styles.rowGap);
            const rowGap = Number.isFinite(parsedRowGap) ? parsedRowGap : gap;
            const columnWidth = (element.clientWidth - gap * Math.max(0, columns - 1)) / columns;
            if (!(columnWidth > 0)) return;
            setGridMetrics((current) => (
                current.columns === columns
                && Math.abs(current.columnWidth - columnWidth) < 1
                && current.gap === gap
                && current.rowGap === rowGap
                    ? current
                    : { columns, columnWidth, gap, rowGap }
            ));
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [hasTiles]);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        const pushPage = (i: number) => {
            pageNumbers.push(
                <Button
                    key={i}
                    size="icon"
                    variant={page === i ? "default" : "outline"}
                    className="h-10 w-10"
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
                    <Button key="start-ellipsis" size="icon" variant="outline" className="h-10 w-10 cursor-default" disabled>
                        ...
                    </Button>
                );
            }
            for (let i = startPage; i < endPage; i++) pushPage(i);
            if (endPage < totalPages) {
                pageNumbers.push(
                    <Button key="end-ellipsis" size="icon" variant="outline" className="h-10 w-10 cursor-default" disabled>
                        ...
                    </Button>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <div className="space-y-5">
            <SortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />

            <Card className="rise w-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-peach text-on-sun shadow-sticker-sm">
                            <Filter className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="kicker">Filter</p>
                            <CardTitle className="text-xl">Model and tags</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                        <div className="space-y-2">
                            <label className="kicker" htmlFor="model-filter">AI Model</label>
                            <select
                                id="model-filter"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="field w-full sm:w-52"
                            >
                                <option value="all">All Models</option>
                                {allModels.map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="kicker" htmlFor="tag-filter">Tag</label>
                            <select
                                id="tag-filter"
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="field w-full sm:w-52"
                            >
                                <option value="all">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>
                        {(selectedModel !== 'all' || selectedTag !== 'all') && (
                            <Button
                                onClick={() => {
                                    setSelectedModel('all');
                                    setSelectedTag('all');
                                }}
                                variant="outline"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                                Clear filters
                            </Button>
                        )}
                    </div>
                    <p className="border-t border-dashed border-ink-3 pt-4 text-ink-2">
                        Showing <span className="font-semibold text-ink">{filteredImages.length}</span> of <span className="font-semibold text-ink">{galleryImages.length}</span> images
                    </p>
                </CardContent>
            </Card>

            {filteredImages.length === 0 ? (
                <div className="flex min-h-[280px] items-center justify-center">
                    <Card className="w-full max-w-md border-dashed bg-watch">
                        <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                            <div className="mark mb-5 grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-sun text-on-sun shadow-sticker">
                                <ImageIcon className="h-8 w-8" />
                            </div>
                            <h3 className="display text-3xl font-extrabold">No images found</h3>
                            <p className="mt-2 text-center text-ink-2">The gallery is empty.</p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
            <div
                ref={gridRef}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                style={{ gridAutoRows: `${BENTO_ROW_HEIGHT}px`, gridAutoFlow: "dense" }}
            >
                {filteredImages.map((image, index) => {
                    const liked = hasLiked(image._id);
                    const title = image.title || image.fileName;
                    const ratio = ratios[image._id] ?? (image.width && image.height ? image.width / image.height : 1);
                    const { colSpan, rowSpan } = tilePlacement(ratio, gridMetrics.columns, gridMetrics.columnWidth, gridMetrics.gap, gridMetrics.rowGap);
                    return (
                        <article
                            key={image._id || index}
                            className="lift group relative overflow-hidden rounded-sticker border-2 border-ink bg-card shadow-sticker-sm"
                            style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
                        >
                            <button
                                type="button"
                                onClick={() => openModal(image)}
                                className="absolute inset-0"
                                aria-label={`View ${title}`}
                            >
                                <GalleryImage
                                    src={image.uri}
                                    alt={title}
                                    onMeasure={(width, height) => rememberSize(image._id, width, height)}
                                />
                            </button>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper via-paper/85 to-transparent p-3">
                                <p className="display truncate text-base font-extrabold text-ink">{title}</p>
                                {image.aiModel && (
                                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-sun">
                                        <Sparkles className="h-3 w-3" />
                                        {image.aiModel}
                                    </span>
                                )}
                            </div>
                            <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
                                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-sun text-on-sun shadow-sticker-sm">
                                    <ZoomIn className="h-3.5 w-3.5" />
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => handleLike(e, image._id)}
                                    disabled={liked}
                                    aria-label={liked ? 'Liked' : 'Like'}
                                    className={`inline-flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 shadow-sticker-sm ${liked ? 'bg-mint text-on-mint' : 'bg-card text-ink'}`}
                                >
                                    <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
                                    <span className="font-display text-sm font-extrabold">{image.likes || 0}</span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
            )}

            {isModalOpen && modalImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040302]/72 p-4">
                    <div className="relative max-h-[95vh] w-full max-w-5xl overflow-y-auto" ref={modalRef}>
                        <Card className="relative overflow-hidden">
                            <CardHeader className="border-b border-dashed border-ink-3 pb-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <CardTitle className="text-2xl">
                                            {modalImage.title || modalImage.fileName}
                                        </CardTitle>
                                        <CardDescription className="mt-2 text-base">
                                            {modalImage.description || 'AI generated artwork'}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={handleCloseModal}
                                        variant="outline"
                                        size="icon"
                                        aria-label="Close"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="flex flex-wrap items-center gap-3 border-b border-dashed border-ink-3 p-4 sm:p-6">
                                    <Button
                                        onClick={(e) => handleLike(e, modalImage._id)}
                                        variant="outline"
                                        className={hasLiked(modalImage._id) ? 'bg-mint text-on-mint disabled:opacity-100' : undefined}
                                        disabled={hasLiked(modalImage._id)}
                                    >
                                        <Heart className={`h-4 w-4 ${hasLiked(modalImage._id) ? 'fill-current' : ''}`} />
                                        <span>{modalImage.likes || 0} likes</span>
                                    </Button>
                                    {modalImage.aiModel && (
                                        <span className="pill bg-sun text-on-sun">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            {modalImage.aiModel}
                                        </span>
                                    )}
                                </div>
                                {modalImage.tags && modalImage.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 border-b border-dashed border-ink-3 px-4 py-4 sm:px-6">
                                        {modalImage.tags.map((tag, i) => (
                                            <span key={i} className="pill bg-sky text-on-sun">
                                                <Tag className="h-3.5 w-3.5" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {modalImage.prompts && (
                                    <p className="whitespace-pre-wrap border-b border-dashed border-ink-3 px-4 py-4 text-ink-2 sm:px-6">
                                        {modalImage.prompts}
                                    </p>
                                )}
                                <div className="p-4 sm:p-6">
                                    <GalleryImage src={modalImage.uri} alt={modalImage.title || modalImage.fileName} fullscreen />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                        disabled={page === 0}
                        onClick={() => setPage(0)}
                        variant="outline"
                        size="sm"
                    >
                        First
                    </Button>
                    <Button
                        disabled={page === 0}
                        onClick={() => page > 0 && setPage(page - 1)}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex gap-2">{renderPageNumbers()}</div>
                    <Button
                        disabled={page >= totalPages - 1}
                        onClick={() => page < totalPages - 1 && setPage(page + 1)}
                        variant="outline"
                        size="sm"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(totalPages - 1)}
                        variant="outline"
                        size="sm"
                    >
                        Last
                    </Button>
                </div>
            )}
        </div>
    );
}

function GalleryImage({ src, alt, fullscreen = false, onMeasure }: { src: string; alt: string; fullscreen?: boolean; onMeasure?: (width: number, height: number) => void }) {
    const reportSize = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const image = event.currentTarget;
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            onMeasure?.(image.naturalWidth, image.naturalHeight);
        }
    };

    if (fullscreen) {
        return (
            <Image
                alt={alt}
                src={src}
                width={1600}
                height={1200}
                className="h-auto max-h-[70vh] w-full rounded-[12px] border-2 border-ink object-contain"
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
            sizes="(max-width: 1024px) 50vw, 33vw"
            onLoad={reportSize}
        />
    );
}
