import { connect, Connection, Mongoose } from 'mongoose';
import UploadedImage, { IFile } from '../models/Files';
import { ImageResponse } from '../types/ExtendNextApiReqeuest';

let dbConnection: Mongoose | null = null;

export async function getImages(limit: number | null, offset: number | null) {
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

        // Fetch images with pagination if limit and offset are provided
        let imagesQuery = UploadedImage.find({ isDeleted: false }).sort({ createdAt: -1 });
        if (limit !== null && offset !== null) {
            imagesQuery = imagesQuery.limit(limit).skip(offset);
        }
        const images = await imagesQuery;

        // Map the images to their URI
        const imageUris = images.map((image: IFile) => image.uri);

        // Prepare the response
        const resp: ImageResponse = { rows: imageUris, total };
        return resp;
    } catch (e) {
        throw e;
    }
}
