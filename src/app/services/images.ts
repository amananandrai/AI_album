import { connect } from 'mongoose';
import UploadedImage, { IFile } from '../models/Files';
import { ImageResponse } from '../types/ExtendNextApiReqeuest';

export async function getImages(limit: number | null, offset: number | null) {
    console.debug("🚀  file: images.ts:11  getImages  limit:", limit, "offset:", offset);
    console.debug("🚀  file: images.ts:11  getImages  process.env.MONGODB_URI:", process.env.MONGODB_URI);
    await connect(process.env.MONGODB_URI || "")
    let total = await UploadedImage.find({ isDeleted: false }).countDocuments();
    let images = [];
    if (limit !== null && offset !== null) {
        images = await UploadedImage.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(limit).skip(offset);
    } else {
        images = await UploadedImage.find({ isDeleted: false }).sort({ createdAt: -1 })
    }
    images = images.map((image: IFile) => image.uri);
    const resp: ImageResponse = { rows: images, total }
    return resp;
}


