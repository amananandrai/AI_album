import { connectDb, getImages } from "@/app/services/images";
import { ImageResponse } from "@/app/types/ExtendNextApiReqeuest";
import { NextRequest } from "next/server";
import UploadedImage from "@/app/models/Files";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { isAdminRequest, unauthorizedResponse } from "@/app/lib/adminAuth";
import { readImageSize } from "@/app/lib/imageSize";

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

function parseTags(value: FormDataEntryValue | null): string[] {
    if (typeof value !== "string" || value.length === 0) return [];
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean);
    } catch {
        return [];
    }
}

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const limit = parseInt(params.get("limit") || "18");
        const offset = parseInt(params.get("offset") || "0");
        const sortBy = params.get("sortBy") || "createdAt";
        const sortOrder = params.get("sortOrder") || "desc";
        const resp: ImageResponse = await getImages(limit, offset, sortBy, sortOrder);
        return Response.json(resp, {
            status: 200, headers: {
                "Cache-Control": "public, max-age=60, stale-while-revalidate=10"
            },
        });
    }
    catch (e: unknown) {
        console.error(e instanceof Error ? e.message : e);
        return Response.json({ error: true, message: "Failed to load images" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!isAdminRequest(request)) {
        return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get("image");
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const tags = parseTags(formData.get("tags"));
    const aiModel = String(formData.get("aiModel") || "").trim();
    const prompts = String(formData.get("prompts") || "").trim();

    if (!file || typeof file === "string") {
        return Response.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!title) {
        return Response.json({ error: "Title is required" }, { status: 400 });
    }
    if (!aiModel) {
        return Response.json({ error: "AI model is required" }, { status: 400 });
    }
    if (tags.length === 0) {
        return Response.json({ error: "At least one tag is required" }, { status: 400 });
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const size = readImageSize(buffer);
        const ext = file.name.split(".").pop() || "jpg";
        const key = `uploads/${uuidv4()}.${ext}`;

        await s3.send(new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ACL: "public-read",
        }));

        const uri = `${R2_PUBLIC_URL}/${key}`;

        await connectDb();
        const doc = await UploadedImage.create({
            fileName: file.name,
            title,
            description,
            tags,
            aiModel,
            prompts,
            uri,
            width: size?.width,
            height: size?.height,
            createdAt: new Date(),
        });

        return Response.json({ success: true, image: doc }, { status: 201 });
    } catch (error) {
        console.error("Upload API error:", error);
        return Response.json({ error: "Upload failed" }, { status: 500 });
    }
}
