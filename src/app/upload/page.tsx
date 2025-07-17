"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";

export default function UploadPage() {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(null);
        const form = e.currentTarget;
        const username = (form.elements.namedItem('username') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        // Mock login: accept any non-empty username/password
        if (username && password) {
            setLoggedIn(true);
        } else {
            setLoginError('Invalid username or password');
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
            form.reset();
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <main className="min-h-screen bg-accent text-primary py-8 flex flex-col items-center gap-8">
            {/* Login Container */}
            <form className="p-4 bg-secondary rounded-lg shadow flex flex-col gap-4 max-w-md w-full" onSubmit={handleLogin}>
                <h2 className="text-lg font-bold text-primary">Login</h2>
                <input type="text" name="username" placeholder="Username" required className="border p-2 rounded" />
                <input type="password" name="password" placeholder="Password" required className="border p-2 rounded" />
                <Button type="submit" disabled={loggedIn}>{loggedIn ? 'Logged In' : 'Login'}</Button>
                {loginError && <div className="text-red-500">{loginError}</div>}
                {loggedIn && <div className="text-green-600">Logged in! You can now upload images.</div>}
            </form>

            {/* Upload Container */}
            <form className="p-4 bg-secondary rounded-lg shadow flex flex-col gap-4 max-w-xl w-full" onSubmit={handleUpload} encType="multipart/form-data">
                <h2 className="text-lg font-bold text-primary">Upload Image</h2>
                <input type="file" name="file" accept="image/*" required className="border p-2 rounded" disabled={!loggedIn} />
                <input type="text" name="title" placeholder="Title" className="border p-2 rounded" disabled={!loggedIn} required />
                <input type="text" name="tags" placeholder="Tags (comma separated)" className="border p-2 rounded" disabled={!loggedIn} required />
                <input type="text" name="aiModel" placeholder="AI Model" className="border p-2 rounded" disabled={!loggedIn} required />
                <input type="text" name="prompt" placeholder="Prompt" className="border p-2 rounded" disabled={!loggedIn} />
                <textarea name="description" placeholder="Description" className="border p-2 rounded" disabled={!loggedIn} />
                <Button type="submit" disabled={uploading || !loggedIn}>{uploading ? 'Uploading...' : 'Upload'}</Button>
                {uploadError && <div className="text-red-500">{uploadError}</div>}
                {uploadSuccess && <div className="text-green-600">{uploadSuccess}</div>}
                {!loggedIn && <div className="text-yellow-600">Please login to upload images.</div>}
            </form>
        </main>
    );
} 