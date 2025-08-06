# AI Gallery

A modern web application for showcasing AI-generated artwork with advanced filtering, sorting, and upload capabilities.

## Features

- **Image Gallery**: Browse AI-generated images with responsive grid layout
- **Advanced Filtering**: Filter by AI model and tags
- **Sorting Options**: Sort by date, popularity, or filename
- **Upload System**: Secure upload with authentication
- **Like System**: Interactive like functionality
- **Responsive Design**: Mobile-friendly interface
- **Modal View**: Full-screen image viewing

## Environment Variables

To configure the application, you need to set the following environment variables in your Vercel deployment:

### Authentication (Required)
```bash
USERNAME=your_upload_username
PASSWORD=your_upload_password
```

### Database (Optional - if using MongoDB)
```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_USER=your_mongodb_username
MONGODB_PASS=your_mongodb_password
MONGODB_DBNAME=your_database_name
```

### Cloud Storage (Optional - if using Cloudflare R2)
```bash
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in Vercel dashboard
4. Deploy to Vercel

## Usage

- **Browse Gallery**: Visit the home page to view all uploaded images
- **Upload Images**: Navigate to `/upload` and login with your credentials
- **Filter & Sort**: Use the controls to find specific images
- **Like Images**: Click the heart icon to like images

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Lucide React icons
- **Backend**: Next.js API routes
- **Database**: MongoDB (optional)
- **Storage**: Cloudflare R2 (optional)
