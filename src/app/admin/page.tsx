"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, LogOut, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { IFile } from "@/app/models/Files";

const PAGE_SIZE = 18;

type Notice = { type: "success" | "error"; text: string } | null;

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
    const [draft, setDraft] = useState("");

    const addTag = () => {
        const next = draft.trim();
        if (!next || tags.includes(next)) return;
        onChange([...tags, next]);
        setDraft("");
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                        }
                    }}
                    placeholder="Add a tag and press Enter"
                    className="h-12"
                />
                <Button type="button" onClick={addTag} variant="secondary" className="h-12">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag} className="pill bg-sky text-on-sun">
                        {tag}
                        <button type="button" onClick={() => onChange(tags.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}>
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [ready, setReady] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [notice, setNotice] = useState<Notice>(null);
    const [uploading, setUploading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [images, setImages] = useState<IFile[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [editing, setEditing] = useState<IFile | null>(null);
    const [editTags, setEditTags] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<string | null>(null);

    const loadImages = async (nextPage = page) => {
        const response = await fetch(`/api/images?limit=${PAGE_SIZE}&offset=${nextPage * PAGE_SIZE}&sortBy=createdAt&sortOrder=desc`);
        const data = await response.json();
        if (!response.ok) {
            setImages([]);
            setTotal(0);
            throw new Error("Could not load images.");
        }
        setImages(data.rows ?? []);
        setTotal(data.total ?? 0);
    };

    useEffect(() => {
        fetch("/api/auth")
            .then((response) => response.json())
            .then((data) => setAuthenticated(Boolean(data.authenticated)))
            .catch(() => setAuthenticated(false))
            .finally(() => setReady(true));
    }, []);

    useEffect(() => {
        if (!authenticated) return;
        loadImages(page).catch(() => {
            setImages([]);
            setNotice({ type: "error", text: "Could not load images." });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticated, page]);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError(null);
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: form.get("username"),
                password: form.get("password"),
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            setLoginError(data.error || "Login failed");
            return;
        }
        setAuthenticated(true);
    };

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        setAuthenticated(false);
        setImages([]);
    };

    const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (tags.length === 0) {
            setNotice({ type: "error", text: "At least one tag is required." });
            return;
        }
        setUploading(true);
        setNotice(null);
        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.set("tags", JSON.stringify(tags));
        try {
            const response = await fetch("/api/images", { method: "POST", body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Upload failed");
            form.reset();
            setTags([]);
            setPage(0);
            await loadImages(0);
            setNotice({ type: "success", text: "Image uploaded." });
        } catch (error) {
            setNotice({ type: "error", text: error instanceof Error ? error.message : "Upload failed" });
        } finally {
            setUploading(false);
        }
    };

    const openEditor = (image: IFile) => {
        setEditing(image);
        setEditTags(image.tags ?? []);
        setPendingDelete(null);
    };

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editing) return;
        if (editTags.length === 0) {
            setNotice({ type: "error", text: "At least one tag is required." });
            return;
        }
        setSaving(true);
        const form = new FormData(event.currentTarget);
        try {
            const response = await fetch(`/api/images/${editing._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.get("title"),
                    description: form.get("description"),
                    aiModel: form.get("aiModel"),
                    prompts: form.get("prompts"),
                    tags: editTags,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Update failed");
            setEditing(null);
            await loadImages(page);
            setNotice({ type: "success", text: "Image updated." });
        } catch (error) {
            setNotice({ type: "error", text: error instanceof Error ? error.message : "Update failed" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setNotice(null);
        const response = await fetch(`/api/images/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok) {
            setNotice({ type: "error", text: data.error || "Delete failed" });
            return;
        }
        setPendingDelete(null);
        const nextPage = images.length === 1 && page > 0 ? page - 1 : page;
        setPage(nextPage);
        await loadImages(nextPage);
        setNotice({ type: "success", text: "Image removed from the gallery." });
    };

    if (!ready) {
        return <main className="min-h-[50vh] px-4 py-16 text-center text-ink-2">Loading admin...</main>;
    }

    if (!authenticated) {
        return (
            <main className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
                <Card className="rise">
                    <CardHeader>
                        <p className="kicker">Admin</p>
                        <CardTitle className="text-3xl">Sign in</CardTitle>
                        <CardDescription>Upload and edit gallery images.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" autoComplete="username" required className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-12" />
                            </div>
                            <Button type="submit" className="h-12 w-full">Sign in</Button>
                            {loginError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{loginError}</AlertDescription>
                                </Alert>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
            <div className="space-y-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="kicker">Library</p>
                        <h1 className="display text-3xl font-extrabold sm:text-4xl">Admin</h1>
                        <p className="mt-1 text-ink-2">Upload images and edit their details.</p>
                    </div>
                    <Button onClick={handleLogout} variant="outline">
                        <LogOut className="h-4 w-4" />
                        Log out
                    </Button>
                </div>

                {notice && (
                    <Alert variant={notice.type === "success" ? "default" : "destructive"} className={notice.type === "success" ? "bg-mint text-on-mint" : undefined}>
                        {notice.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertDescription>{notice.text}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload image</CardTitle>
                        <CardDescription>Add a new image to the public gallery.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="grid gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="image">Image file</Label>
                                <Input id="image" name="image" type="file" accept="image/*" required />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" required className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aiModel">AI model</Label>
                                    <Input id="aiModel" name="aiModel" required placeholder="Midjourney, Flux, DALL-E..." className="h-12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <TagEditor tags={tags} onChange={setTags} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prompts">Prompts</Label>
                                <Textarea id="prompts" name="prompts" rows={4} />
                            </div>
                            <Button type="submit" disabled={uploading || tags.length === 0} className="h-12">
                                {uploading ? "Uploading..." : "Upload image"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <section className="space-y-4">
                    <h2 className="display text-2xl font-extrabold">Library</h2>
                    {images.length === 0 ? (
                        <p className="text-ink-2">No images in the gallery yet.</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {images.map((image) => (
                                <Card key={image._id} className="overflow-hidden shadow-sticker-sm">
                                    <div className="relative h-44 border-b-2 border-ink bg-empty">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={image.uri} alt={image.title || image.fileName} className="h-full w-full object-cover" />
                                    </div>
                                    <CardContent className="space-y-3 p-4">
                                        <div>
                                            <p className="display truncate text-lg font-extrabold">{image.title || image.fileName}</p>
                                            <p className="text-sm font-semibold text-sun">{image.aiModel}</p>
                                            {image.description && <p className="mt-1 line-clamp-2 text-sm text-ink-2">{image.description}</p>}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button type="button" onClick={() => openEditor(image)} variant="outline" size="sm">
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Button>
                                            {pendingDelete === image._id ? (
                                                <Button type="button" onClick={() => handleDelete(image._id)} variant="destructive" size="sm">
                                                    Confirm
                                                </Button>
                                            ) : (
                                                <Button type="button" onClick={() => setPendingDelete(image._id)} variant="outline" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3">
                            <Button disabled={page === 0} onClick={() => setPage(page - 1)} variant="outline" size="sm">Previous</Button>
                            <span className="self-center text-ink-2">Page {page + 1} of {totalPages}</span>
                            <Button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} variant="outline" size="sm">Next</Button>
                        </div>
                    )}
                </section>
            </div>

            <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit image</DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <form onSubmit={handleSave} className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input id="edit-title" name="title" defaultValue={editing.title} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea id="edit-description" name="description" defaultValue={editing.description} rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-model">AI model</Label>
                                <Input id="edit-model" name="aiModel" defaultValue={editing.aiModel} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <TagEditor tags={editTags} onChange={setEditTags} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-prompts">Prompts</Label>
                                <Textarea id="edit-prompts" name="prompts" defaultValue={editing.prompts} rows={4} />
                            </div>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save changes"}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </main>
    );
}
