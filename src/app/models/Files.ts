import mongoose, { model, Schema } from "mongoose";


export interface IFile {
    _id: string;
    fileName: string;
    createdAt: Date;
    likes?: number;
    isDeleted?: boolean,
    uri: string
}

const fileSchema = new Schema<IFile>({
    fileName: { type: String, required: true },
    uri: { type: String, required: true },
    createdAt: { type: Date, required: true },
    likes: { type: Number, required: false, default: 0 },
    isDeleted: { type: Boolean, required: false, default: false }
})

export default mongoose.models.UploadedImage || mongoose.model('UploadedImage', fileSchema);