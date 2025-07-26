"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Handle login
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    // Simple mock login check
    if (username && password) {
      setLoggedIn(true);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // Handle image upload
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
    <div style={{ maxWidth: 360, margin: "40px auto", padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      {/* Login Section */}
      {!loggedIn && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input name="username" autoComplete="username"
              placeholder="Username" style={{ padding: 8 }} />
            <input name="password" type="password" autoComplete="current-password"
              placeholder="Password" style={{ padding: 8 }} />
            <Button type="submit">Login</Button>
          </form>
          {loginError && <p style={{ color: 'red', marginTop: 8 }}>{loginError}</p>}
        </>
      )}

      {loggedIn && (
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: "green", fontWeight: 500 }}>Logged in! You can now upload images.</p>
          <Button onClick={() => setLoggedIn(false)} style={{ marginTop: 10 }}>Log out</Button>
        </div>
      )}

      {/* Image Upload Section */}
      {loggedIn ? (
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2>Upload Image</h2>
          <input type="file" name="image" accept="image/*" required style={{ padding: 6 }} />
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
          {uploadSuccess && <p style={{ color: 'green' }}>{uploadSuccess}</p>}
        </form>
      ) : (
        <p style={{ color: "#555", marginTop: 32 }}>Please login to upload images.</p>
      )}
    </div>
  );
}
