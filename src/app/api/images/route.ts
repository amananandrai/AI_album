import { getImages } from "@/app/services/images";
import { ImageResponse } from "@/app/types/ExtendNextApiReqeuest";
import { NextRequest } from "next/server";
import mongoose, { Schema } from 'mongoose';
import UploadedImage from '@/app/models/Files';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.R2_BUCKET!;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const limit = parseInt(params.get("limit") || "9");
        const offset = parseInt(params.get("offset") || "0");
        const sortBy = params.get("sortBy") || "createdAt";
        const sortOrder = params.get("sortOrder") || "desc";
        const resp: ImageResponse = await getImages(limit, offset, sortBy, sortOrder);
        return Response.json(resp, {
            status: 200, headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=10'
            },
        });

    }
    catch (e: any) {
        console.error(e.message);
        return Response.json({ error: true, message: e.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    console.log('Upload API - Received credentials:', {
        username: username ? '[PROVIDED]' : 'undefined',
        password: password ? '[PROVIDED]' : 'undefined',
        expectedUsername: process.env.USERNAME ? '[SET]' : 'undefined',
        expectedPassword: process.env.PASSWORD ? '[SET]' : 'undefined'
    });

    if (
        username !== process.env.USERNAME ||
        password !== process.env.PASSWORD
    ) {
        console.log('Upload API - Authentication failed');
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('Upload API - Authentication successful');

    const file = formData.get('image'); // Changed from 'file' to 'image'
    const title = formData.get('title') as string;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : []; // Parse JSON tags
    const aiModel = formData.get('aiModel') as string;
    const prompts = formData.get('prompts') as string; // Changed from 'prompt' to 'prompts'

    console.log('Upload API - Form data:', {
        hasFile: !!file,
        title,
        tags,
        aiModel,
        prompts: prompts ? '[PROVIDED]' : 'undefined'
    });

    if (!file || typeof file === 'string') {
        console.log('Upload API - No file uploaded');
        return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    try {
        // Prepare file for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = file.name.split('.').pop() || 'jpg';
        const key = `uploads/${uuidv4()}.${ext}`;

        console.log('Upload API - Uploading to R2:', { key, fileType: file.type });

        // Upload to R2
        await s3.send(new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ACL: "public-read", // R2 ignores this, but S3 SDK requires it
        }));

        // Construct public URL
        const uri = `${R2_PUBLIC_URL}/${key}`;

        console.log('Upload API - Saving to MongoDB');

        // Save to MongoDB
        const doc = await UploadedImage.create({
            fileName: file.name,
            title,
            tags,
            aiModel,
            prompts, // Changed from 'prompt' to 'prompts'
            uri,
            createdAt: new Date(),
        });

        console.log('Upload API - Success');
        return Response.json({ success: true, image: doc }, { status: 201 });
    } catch (error) {
        console.error('Upload API - Error:', error);
        return Response.json({ error: 'Upload failed' }, { status: 500 });
    }
}


