import { getImages } from "@/app/services/images";
import { ImageResponse } from "@/app/types/ExtendNextApiReqeuest";
import { NextRequest } from "next/server";
import mongoose, { Schema } from 'mongoose';
import UploadedImage from '@/app/models/Files';

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
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') as string;
    const tags = formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [];
    const aiModel = formData.get('aiModel') as string;
    const prompt = formData.get('prompt') as string;
    const description = formData.get('description') as string;

    if (!file || typeof file === 'string') {
        return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // For now, just save the file as a base64 string (replace with Imgur upload logic as needed)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // TODO: Replace this with Imgur upload and get the URL
    const uri = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Save to MongoDB
    const doc = await UploadedImage.create({
        fileName: file.name,
        title,
        tags,
        aiModel,
        prompt,
        description,
        uri,
        createdAt: new Date(),
    });

    return Response.json({ success: true, image: doc }, { status: 201 });
}


