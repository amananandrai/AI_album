import { connect, Mongoose } from 'mongoose';
import UploadedImage from '@/app/models/Files';
import { NextRequest } from 'next/server';

let dbConnection: Mongoose | null = null;

export async function POST(request: NextRequest) {
    try {
        // Establish connection if not already established
        if (!dbConnection) {
            dbConnection = await connect(process.env.MONGODB_URI || "", {
                user: process.env.MONGODB_USER,
                pass: process.env.MONGODB_PASS,
                dbName: process.env.MONGODB_DBNAME,
            });
        }

        // Update all existing images with test data
        const result = await UploadedImage.updateMany(
            { isDeleted: false },
            { 
                $set: { 
                    tags: ['#test'],
                    aiModel: '#dummy'
                }
            }
        );

        return Response.json({ 
            success: true, 
            message: `Updated ${result.modifiedCount} images with test data`,
            modifiedCount: result.modifiedCount
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error seeding data:', error);
        return Response.json({ 
            error: 'Internal server error',
            message: error.message
        }, { status: 500 });
    }
} 