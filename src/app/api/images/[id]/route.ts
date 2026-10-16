import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { isAdminRequest, unauthorizedResponse } from "@/app/lib/adminAuth";
import { softDeleteImage, updateImage, ImageUpdate } from "@/app/services/images";

type RouteContext = { params: Promise<{ id: string }> };

function invalidId() {
    return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
}

function readString(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;
    return value.trim();
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
    if (!isAdminRequest(request)) {
        return unauthorizedResponse();
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidId();

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const fields: ImageUpdate = {};

    if ("title" in body) {
        const title = readString(body.title);
        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
        fields.title = title;
    }
    if ("description" in body) {
        fields.description = readString(body.description) ?? "";
    }
    if ("aiModel" in body) {
        const aiModel = readString(body.aiModel);
        if (!aiModel) return NextResponse.json({ error: "AI model is required" }, { status: 400 });
        fields.aiModel = aiModel;
    }
    if ("prompts" in body) {
        fields.prompts = readString(body.prompts) ?? "";
    }
    if ("tags" in body) {
        if (!Array.isArray(body.tags)) {
            return NextResponse.json({ error: "Tags must be a list" }, { status: 400 });
        }
        const tags = body.tags
            .filter((tag): tag is string => typeof tag === "string")
            .map((tag) => tag.trim())
            .filter(Boolean);
        if (tags.length === 0) {
            return NextResponse.json({ error: "At least one tag is required" }, { status: 400 });
        }
        fields.tags = tags;
    }

    if (Object.keys(fields).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    try {
        const image = await updateImage(id, fields);
        if (!image) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, image });
    } catch (error) {
        console.error("Update image error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
    if (!isAdminRequest(request)) {
        return unauthorizedResponse();
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return invalidId();

    try {
        const image = await softDeleteImage(id);
        if (!image) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete image error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
