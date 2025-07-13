import { NextRequest } from 'next/server';
import mongoose, { Schema } from 'mongoose';
import archiver from 'archiver';
import axios from 'axios';
import { PassThrough } from 'stream';

const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_connection_string';
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || '';

const fileSchema = new Schema({
  fileName: String,
  uri: String,
  createdAt: Date,
  likes: Number,
  isDeleted: Boolean,
  tags: [String],
  aiModel: String,
});

const UploadedImage = mongoose.models.UploadedImage || mongoose.model('UploadedImage', fileSchema);

export async function GET(request: NextRequest) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      user: MONGODB_USER,
      pass: MONGODB_PASS,
      dbName: MONGODB_DBNAME,
    });
  }

  const images = await UploadedImage.find({ isDeleted: false });

  // Create a streamable response
  const stream = new PassThrough();
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.on('error', (err: any) => {
    stream.destroy(err);
  });

  archive.pipe(stream);

  // Download and append each image to the archive
  for (const img of images) {
    try {
      const response = await axios.get(img.uri, { responseType: 'arraybuffer' });
      const ext = img.uri.split('.').pop().split('?')[0] || 'jpg';
      const filename = `${img.fileName || img._id}.${ext}`;
      archive.append(Buffer.from(response.data), { name: filename });
    } catch (err) {
      // Skip failed downloads
      continue;
    }
  }

  await archive.finalize();

  // Return a streamable response
  return new Response(stream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="all_images.zip"',
    },
  });
} 