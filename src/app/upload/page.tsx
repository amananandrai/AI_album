"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, User, Lock, Image, Tag, FileText, Sparkles, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);

  // Handle login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    console.log('Login attempt:', { username, password: password ? '[HIDDEN]' : 'undefined' });

    if (!username || !password) {
      setLoginError('Please enter both username and password');
      return;
    }

    try {
      console.log('Sending request to /api/auth');
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setLoggedIn(true);
        setLoginError(null);
        setCredentials({ username, password });
        console.log('Login successful - setting loggedIn to true');
      } else {
        setLoginError(data.error || 'Login failed');
        console.log('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please try again.');
    }
  };

  // Handle image upload
  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate that at least one tag is added
    if (tags.length === 0) {
      setUploadError('At least one tag is required');
      return;
    }
    
    // Check if user is logged in
    if (!credentials) {
      setUploadError('Please login first');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Add tags to form data
    formData.append('tags', JSON.stringify(tags));

    // Add authentication credentials to form data
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    console.log('Upload - Sending form data:', {
      hasImage: formData.has('image'),
      hasTitle: formData.has('title'),
      hasAiModel: formData.has('aiModel'),
      hasTags: formData.has('tags'),
      hasPrompts: formData.has('prompts'),
      hasUsername: formData.has('username'),
      hasPassword: formData.has('password'),
      tags: JSON.stringify(tags)
    });

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload - Response status:', res.status);
      const data = await res.json();
      console.log('Upload - Response data:', data);

      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUploadSuccess('Image uploaded successfully!');
      form.reset();
      setTags([]);
      setNewTag('');
    } catch (err: any) {
      console.error('Upload - Error:', err);
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle adding tags
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle removing tags
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            AI Gallery Upload
          </h1>
          <p className="text-lg text-primary/80">
            Share your AI-generated artwork with the community
          </p>
        </div>

        {/* Login Section */}
        {!loggedIn && (
          <Card className="w-full shadow-lg border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl text-primary">Login Required</CardTitle>
              <CardDescription className="text-primary/70">
                Please login to upload images to the gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-primary font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/50" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your username"
                      className="pl-10 bg-secondary border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-primary font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/50" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="pl-10 bg-secondary border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-secondary text-accent font-medium py-3">
                  Login
                </Button>

                {loginError && (
                  <Alert className="border-red-500 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {loginError}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        {loggedIn && (
          <div className="space-y-6">
            {/* Success Message */}
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 font-medium">
                Successfully logged in! You can now upload your AI-generated images.
              </AlertDescription>
            </Alert>

            {/* Logout Button */}
            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  setLoggedIn(false);
                  setCredentials(null);
                }} 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-accent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Upload Form */}
            <Card className="w-full shadow-lg border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Upload className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-primary">Upload Image</CardTitle>
                    <CardDescription className="text-primary/70">
                      Share your AI-generated artwork with detailed information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-primary font-medium flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Image File
                    </Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="bg-secondary border-primary/30 text-accent file:bg-primary file:text-accent file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-secondary"
                      required
                    />
                    <p className="text-sm text-primary/60">
                      Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
                    </p>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-primary font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter a descriptive title for your image"
                      className="bg-secondary border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary"
                      required
                    />
                  </div>

                  {/* AI Model */}
                  <div className="space-y-2">
                    <Label htmlFor="aiModel" className="text-primary font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Model *
                    </Label>
                    <Input
                      id="aiModel"
                      name="aiModel"
                      type="text"
                      placeholder="Enter the AI model used (e.g., DALL-E 3, Midjourney, Stable Diffusion)"
                      className="bg-secondary border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary"
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="text-primary font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags *
                    </Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder="Add tags (press Enter to add) - At least one tag required"
                          className="bg-secondary border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="bg-primary hover:bg-secondary text-accent px-4"
                        >
                          Add
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-tertiary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-200"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      {tags.length === 0 && (
                        <p className="text-sm text-red-500">At least one tag is required</p>
                      )}
                    </div>
                  </div>

                  {/* Prompts */}
                  <div className="space-y-2">
                    <Label htmlFor="prompts" className="text-primary font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Prompts Used (Optional)
                    </Label>
                    <Textarea
                      id="prompts"
                      name="prompts"
                      placeholder="Describe the prompts you used to generate this image... (optional)"
                      className="bg-secondary border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary min-h-[100px]"
                      rows={4}
                    />
                    <p className="text-sm text-primary/60">
                      Share the prompts that helped create this artwork (optional)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={uploading || tags.length === 0}
                    className="w-full bg-primary hover:bg-secondary text-accent font-medium py-3"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>

                  {/* Error/Success Messages */}
                  {uploadError && (
                    <Alert className="border-red-500 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadSuccess && (
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700">
                        {uploadSuccess}
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
