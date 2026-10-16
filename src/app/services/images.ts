import { connect, Mongoose } from "mongoose";
import UploadedImage from "../models/Files";
import { ImageResponse } from "../types/ExtendNextApiReqeuest";

let dbConnection: Mongoose | null = null;

export async function connectDb() {
    if (!dbConnection) {
        dbConnection = await connect(process.env.MONGODB_URI || "", {
            user: process.env.MONGODB_USER,
            pass: process.env.MONGODB_PASS,
            dbName: process.env.MONGODB_DBNAME,
        });
    }
    return dbConnection;
}

export type ImageUpdate = {
    title?: string;
    description?: string;
    aiModel?: string;
    prompts?: string;
    tags?: string[];
};

export async function getImages(limit: number | null, offset: number | null, sortBy: string = "createdAt", sortOrder: string = "desc") {
    await connectDb();

    const total = await UploadedImage.find({ isDeleted: false }).countDocuments();

    const sortObject: Record<string, 1 | -1> = {};
    if (sortBy === "createdAt") {
        sortObject.createdAt = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "likes") {
        sortObject.likes = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "fileName") {
        sortObject.fileName = sortOrder === "asc" ? 1 : -1;
    } else {
        sortObject.createdAt = -1;
    }

    let imagesQuery = UploadedImage.find({ isDeleted: false }).sort(sortObject);
    if (limit !== null && offset !== null) {
        imagesQuery = imagesQuery.limit(limit).skip(offset);
    }
    const images = await imagesQuery;

    const resp: ImageResponse = { rows: images, total };
    return resp;
}

export async function updateImage(id: string, fields: ImageUpdate) {
    await connectDb();
    return UploadedImage.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: fields },
        { new: true }
    );
}

export async function softDeleteImage(id: string) {
    await connectDb();
    return UploadedImage.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
    );
}
