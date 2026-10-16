import { NextRequest } from "next/server";
import UploadedImage from "@/app/models/Files";
import { connectDb } from "@/app/services/images";

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();
        const { id: imageId } = await params;

        const updatedImage = await UploadedImage.findByIdAndUpdate(
            imageId,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!updatedImage) {
            return Response.json({ error: "Image not found" }, { status: 404 });
        }

        return Response.json({
            success: true,
            likes: updatedImage.likes
        }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error liking image:", error);
        return Response.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
