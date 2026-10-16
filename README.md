# AI Gallery

A photo gallery for AI-generated artwork, with a private admin panel for uploads and edits.

## Features

- **Photo gallery**: Bento grid of images on the homepage
- **Filtering and sorting**: Filter by AI model and tags, and sort by date, popularity, or filename
- **Admin panel**: Sign in at `/admin` to upload images and change title, description, model, tags, and prompts
- **Like system**: Visitors can like images

## Environment variables

### Authentication

```bash
USERNAME=your_admin_username
PASSWORD=your_admin_password
```

### Database

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_USER=your_mongodb_username
MONGODB_PASS=your_mongodb_password
MONGODB_DBNAME=your_database_name
```

### Cloudflare R2

```bash
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET=your_r2_bucket_name
R2_PUBLIC_URL=https://your-public-r2-host
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` and set the variables above
4. Run `npm run dev`

## Usage

- **Browse**: The homepage is the gallery
- **Manage images**: Open `/admin` and sign in with `USERNAME` and `PASSWORD`
- **Filter and sort**: Use the controls above the gallery

## Technology stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI components**: Radix UI, Lucide React icons
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Storage**: Cloudflare R2
