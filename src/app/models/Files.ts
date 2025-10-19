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
    createdAt: { type: Date, required: true, index: true },
    likes: { type: Number, required: false, default: 0, index: true },
    isDeleted: { type: Boolean, required: false, default: false, index: true },
    tags: { type: [String], required: false, default: [], index: true },
    aiModel: { type: String, required: false, default: '', index: true }
})

// Add compound indexes for better query performance
fileSchema.index({ isDeleted: 1, createdAt: -1 });
fileSchema.index({ isDeleted: 1, likes: -1 });
fileSchema.index({ isDeleted: 1, fileName: 1 });
fileSchema.index({ isDeleted: 1, aiModel: 1 });
fileSchema.index({ isDeleted: 1, tags: 1 });

export default mongoose.models.UploadedImage || mongoose.model('UploadedImage', fileSchema);