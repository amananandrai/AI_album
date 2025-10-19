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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl mb-8 shadow-2xl animate-glow">
            <Upload className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Upload Your
            </span>
            <br />
            <span className="text-white">AI Artwork</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Share your AI-generated artwork with the community and inspire others with your 
            <span className="text-purple-400 font-semibold"> creative vision</span>
          </p>
        </div>

        {/* Login Section */}
        {!loggedIn && (
          <Card className="w-full glass border-white/20 shadow-2xl animate-slide-up">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mb-8 shadow-2xl animate-glow">
                <User className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-4xl text-white font-bold mb-4">Welcome Back</CardTitle>
              <CardDescription className="text-xl text-slate-300">
                Please login to upload images to the gallery
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="username" className="text-white font-semibold text-lg">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your username"
                      className="pl-14 h-14 glass border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-lg rounded-xl bg-white/5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="password" className="text-white font-semibold text-lg">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="pl-14 h-14 glass border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-lg rounded-xl bg-white/5"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] rounded-xl">
                  Sign In
                </Button>

                {loginError && (
                  <Alert className="glass border border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <AlertDescription className="text-red-300 font-medium">
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
            <Alert className="glass border border-green-500/50 bg-green-500/10 animate-fade-in">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <AlertDescription className="text-green-300 font-medium text-lg">
                Successfully logged in! You can now upload your AI-generated images.
              </AlertDescription>
            </Alert>

            {/* Logout Button */}
            <div className="flex justify-end animate-fade-in" style={{animationDelay: '0.2s'}}>
              <Button 
                onClick={() => {
                  setLoggedIn(false);
                  setCredentials(null);
                }} 
                className="glass border border-white/20 text-white hover:bg-white/10 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>

            {/* Upload Form */}
            <Card className="w-full glass border-white/20 shadow-2xl animate-slide-up" style={{animationDelay: '0.4s'}}>
              <CardHeader className="pb-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-4xl text-white font-bold mb-2">Upload Image</CardTitle>
                    <CardDescription className="text-xl text-slate-300">
                      Share your AI-generated artwork with detailed information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleUpload} className="space-y-8">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label htmlFor="image" className="text-white font-semibold text-lg flex items-center gap-3">
                      <Image className="h-6 w-6 text-purple-400" />
                      Image File
                    </Label>
                    <div className="relative">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="h-14 glass border border-white/20 text-white file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white file:border-0 file:rounded-xl file:px-6 file:py-3 file:mr-4 file:cursor-pointer hover:file:from-purple-600 hover:file:to-pink-600 file:font-semibold file:shadow-lg file:transition-all file:duration-300 rounded-xl bg-white/5"
                        required
                      />
                    </div>
                    <p className="text-sm text-slate-400">
                      Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
                    </p>
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Title */}
                  <div className="space-y-4">
                    <Label htmlFor="title" className="text-white font-semibold text-lg flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-400" />
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter a descriptive title for your image"
                      className="h-14 glass border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-lg rounded-xl bg-white/5"
                      required
                    />
                  </div>

                  {/* AI Model */}
                  <div className="space-y-4">
                    <Label htmlFor="aiModel" className="text-white font-semibold text-lg flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-pink-400" />
                      AI Model *
                    </Label>
                    <Input
                      id="aiModel"
                      name="aiModel"
                      type="text"
                      placeholder="Enter the AI model used (e.g., DALL-E 3, Midjourney, Stable Diffusion)"
                      className="h-14 glass border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-lg rounded-xl bg-white/5"
                      required
                    />
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Tags */}
                  <div className="space-y-6">
                    <Label className="text-white font-semibold text-lg flex items-center gap-3">
                      <Tag className="h-6 w-6 text-green-400" />
                      Tags *
                    </Label>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder="Add tags (press Enter to add) - At least one tag required"
                          className="flex-1 h-14 glass border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-lg rounded-xl bg-white/5"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 font-semibold shadow-lg transition-all duration-300 hover:scale-105 rounded-xl"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="glass border border-white/20 text-white hover:bg-white/10 px-4 py-3 text-sm font-medium flex items-center gap-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-400 transition-colors p-1 hover:bg-red-500/20 rounded-full"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      {tags.length === 0 && (
                        <p className="text-sm text-red-400 font-medium">At least one tag is required</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Prompts */}
                  <div className="space-y-4">
                    <Label htmlFor="prompts" className="text-white font-semibold text-lg flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                      Prompts Used (Optional)
                    </Label>
                    <Textarea
                      id="prompts"
                      name="prompts"
                      placeholder="Describe the prompts you used to generate this image... (optional)"
                      className="glass border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-[140px] text-lg resize-none rounded-xl bg-white/5 p-4"
                      rows={5}
                    />
                    <p className="text-sm text-slate-400">
                      Share the prompts that helped create this artwork (optional)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={uploading || tags.length === 0}
                    className="w-full h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] rounded-xl"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Uploading Your Masterpiece...
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 mr-3" />
                        Upload AI Artwork
                      </>
                    )}
                  </Button>

                  {/* Error/Success Messages */}
                  {uploadError && (
                    <Alert className="glass border border-red-500/50 bg-red-500/10 animate-fade-in">
                      <AlertCircle className="h-6 w-6 text-red-400" />
                      <AlertDescription className="text-red-300 font-medium text-lg">
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadSuccess && (
                    <Alert className="glass border border-green-500/50 bg-green-500/10 animate-fade-in">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <AlertDescription className="text-green-300 font-medium text-lg">
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
