"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function UploadPage() {
    const { data: session, status } = useSession();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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
            form.reset();
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (!session) {
        return (
            <main className="min-h-screen bg-accent text-primary py-8 flex flex-col items-center">
                <div className="mt-8 mb-6 p-4 bg-secondary rounded-lg shadow flex flex-col gap-4 max-w-xl w-full text-center">
                    <h2 className="text-lg font-bold text-primary">Sign in to upload images</h2>
                    <Button onClick={() => signIn()}>Sign In</Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-accent text-primary py-8 flex flex-col items-center">
            <form className="mt-8 mb-6 p-4 bg-secondary rounded-lg shadow flex flex-col gap-4 max-w-xl w-full" onSubmit={handleUpload} encType="multipart/form-data">
                <h2 className="text-lg font-bold text-primary">Upload Image</h2>
                <input type="file" name="file" accept="image/*" required className="border p-2 rounded" />
                <input type="text" name="title" placeholder="Title" className="border p-2 rounded" />
                <input type="text" name="tags" placeholder="Tags (comma separated)" className="border p-2 rounded" />
                <input type="text" name="aiModel" placeholder="AI Model" className="border p-2 rounded" />
                <input type="text" name="prompt" placeholder="Prompt" className="border p-2 rounded" />
                <textarea name="description" placeholder="Description" className="border p-2 rounded" />
                <Button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
                {uploadError && <div className="text-red-500">{uploadError}</div>}
                {uploadSuccess && <div className="text-green-600">{uploadSuccess}</div>}
            </form>
        </main>
    );
} 