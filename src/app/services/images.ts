import { connect, Connection, Mongoose } from 'mongoose';
import UploadedImage, { IFile } from '../models/Files';
import { ImageResponse } from '../types/ExtendNextApiReqeuest';

let dbConnection: Mongoose | null = null;

export async function getImages(limit: number | null, offset: number | null, sortBy: string = 'createdAt', sortOrder: string = 'desc') {
    try {
        // Establish connection if not already established
        if (!dbConnection) {
            dbConnection = await connect(process.env.MONGODB_URI || "", {
                user: process.env.MONGODB_USER,
                pass: process.env.MONGODB_PASS,
                dbName: process.env.MONGODB_DBNAME,
            });
        }

        // Fetch total count of non-deleted images
        const total = await UploadedImage.find({ isDeleted: false }).countDocuments();

        // Create sort object
        const sortObject: any = {};
        if (sortBy === 'createdAt') {
            sortObject.createdAt = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'likes') {
            sortObject.likes = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'fileName') {
            sortObject.fileName = sortOrder === 'asc' ? 1 : -1;
        } else {
            // Default to createdAt desc
            sortObject.createdAt = -1;
        }

        // Fetch images with pagination if limit and offset are provided
        let imagesQuery = UploadedImage.find({ isDeleted: false }).sort(sortObject);
        if (limit !== null && offset !== null) {
            imagesQuery = imagesQuery.limit(limit).skip(offset);
        }
        const images = await imagesQuery;

        // Return full image objects instead of just URIs
        const resp: ImageResponse = { rows: images, total };
        return resp;
    } catch (e) {
        throw e;
    }
}
