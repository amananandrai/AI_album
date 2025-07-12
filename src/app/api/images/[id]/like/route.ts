import { connect, Mongoose } from 'mongoose';
import UploadedImage from '@/app/models/Files';
import { NextRequest } from 'next/server';

let dbConnection: Mongoose | null = null;

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Establish connection if not already established
        if (!dbConnection) {
            dbConnection = await connect(process.env.MONGODB_URI || "", {
                user: process.env.MONGODB_USER,
                pass: process.env.MONGODB_PASS,
                dbName: process.env.MONGODB_DBNAME,
            });
        }

        const imageId = params.id;

        // Find the image and increment likes
        const updatedImage = await UploadedImage.findByIdAndUpdate(
            imageId,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!updatedImage) {
            return Response.json({ error: 'Image not found' }, { status: 404 });
        }

        return Response.json({ 
            success: true, 
            likes: updatedImage.likes 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error liking image:', error);
        return Response.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
} 