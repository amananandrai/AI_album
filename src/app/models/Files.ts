import mongoose, { model, Schema } from "mongoose";

export interface IFile {
    _id: string;
    fileName: string;
    title?: string;
    prompts?: string;
    description?: string;
    createdAt: Date;
    likes?: number;
    isDeleted?: boolean;
    uri: string;
    tags?: string[];
    aiModel?: string;
}

const fileSchema = new Schema<IFile>({
    fileName: { type: String, required: true },
    title: { type: String, required: false, default: '' },
    prompts: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' },
    uri: { type: String, required: true },
    createdAt: { type: Date, required: true },
    likes: { type: Number, required: false, default: 0 },
    isDeleted: { type: Boolean, required: false, default: false },
    tags: { type: [String], required: false, default: [] },
    aiModel: { type: String, required: false, default: '' }
})

export default mongoose.models.UploadedImage || mongoose.model('UploadedImage', fileSchema);