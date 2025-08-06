"use client";

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, User, Lock, Image, Tag, FileText, Sparkles, LogOut, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';

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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 shadow-lg">
            <Upload className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
            AI Gallery Upload
          </h1>
          <p className="text-xl text-primary/80 max-w-2xl mx-auto">
            Share your AI-generated artwork with the community and inspire others
          </p>
        </div>

        {/* Login Section */}
        {!loggedIn && (
          <Card className="w-full shadow-2xl border-primary/20 bg-secondary/50">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                <User className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-3xl text-primary font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-lg text-primary/70">
                Please login to upload images to the gallery
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-primary font-semibold text-base">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your username"
                      className="pl-12 h-12 bg-secondary/80 border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-primary font-semibold text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="pl-12 h-12 bg-secondary/80 border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 text-base"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-accent font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200">
                  Sign In
                </Button>

                {loginError && (
                  <Alert className="border-red-500/50 bg-red-50/50">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <AlertDescription className="text-red-700 font-medium">
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
          <div className="space-y-8">
            {/* Success Message */}
            <Alert className="border-green-500/50 bg-green-50/50">
              <CheckCircle className="h-5 w-5 text-green-500" />
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
                className="border-primary/30 text-primary hover:bg-primary hover:text-accent shadow-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Upload Form */}
            <Card className="w-full shadow-2xl border-primary/20 bg-secondary/50">
              <CardHeader className="pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Upload className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-primary font-bold">Upload Image</CardTitle>
                    <CardDescription className="text-lg text-primary/70">
                      Share your AI-generated artwork with detailed information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleUpload} className="space-y-8">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label htmlFor="image" className="text-primary font-semibold text-base flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Image File
                    </Label>
                    <div className="relative">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="h-12 bg-secondary/80 border-primary/30 text-accent file:bg-primary file:text-accent file:border-0 file:rounded-lg file:px-6 file:py-3 file:mr-4 file:cursor-pointer hover:file:bg-primary/90 file:font-semibold file:shadow-md"
                        required
                      />
                    </div>
                    <p className="text-sm text-primary/60">
                      Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
                    </p>
                  </div>

                  <div className="border-t border-primary/20"></div>

                  {/* Title */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-primary font-semibold text-base flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter a descriptive title for your image"
                      className="h-12 bg-secondary/80 border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 text-base"
                      required
                    />
                  </div>

                  {/* AI Model */}
                  <div className="space-y-3">
                    <Label htmlFor="aiModel" className="text-primary font-semibold text-base flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Model *
                    </Label>
                    <Input
                      id="aiModel"
                      name="aiModel"
                      type="text"
                      placeholder="Enter the AI model used (e.g., DALL-E 3, Midjourney, Stable Diffusion)"
                      className="h-12 bg-secondary/80 border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 text-base"
                      required
                    />
                  </div>

                  <div className="border-t border-primary/20"></div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <Label className="text-primary font-semibold text-base flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags *
                    </Label>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder="Add tags (press Enter to add) - At least one tag required"
                          className="flex-1 h-12 bg-secondary/80 border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 text-base"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="h-12 bg-primary hover:bg-primary/90 text-accent px-6 font-semibold shadow-md"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-tertiary text-white hover:bg-tertiary/90 px-3 py-2 text-sm font-medium flex items-center gap-2 rounded-full"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-200 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      {tags.length === 0 && (
                        <p className="text-sm text-red-500 font-medium">At least one tag is required</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-primary/20"></div>

                  {/* Prompts */}
                  <div className="space-y-3">
                    <Label htmlFor="prompts" className="text-primary font-semibold text-base flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Prompts Used (Optional)
                    </Label>
                    <Textarea
                      id="prompts"
                      name="prompts"
                      placeholder="Describe the prompts you used to generate this image... (optional)"
                      className="bg-secondary/80 border-primary/30 text-accent placeholder:text-accent/60 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 min-h-[120px] text-base resize-none"
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
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-accent font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent mr-3"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-3" />
                        Upload Image
                      </>
                    )}
                  </Button>

                  {/* Error/Success Messages */}
                  {uploadError && (
                    <Alert className="border-red-500/50 bg-red-50/50">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <AlertDescription className="text-red-700 font-medium">
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadSuccess && (
                    <Alert className="border-green-500/50 bg-green-50/50">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <AlertDescription className="text-green-700 font-medium">
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
