const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { Schema } = mongoose;

// --- CONFIGURE THESE ---
const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_connection_string';
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || '';
const DOWNLOAD_DIR = path.join(__dirname, 'downloaded_images');
// -----------------------

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

const fileSchema = new Schema({
  fileName: String,
  uri: String,
  createdAt: Date,
  likes: Number,
  isDeleted: Boolean,
  tags: [String],
  aiModel: String,
});

const UploadedImage = mongoose.model('UploadedImage', fileSchema);

async function downloadImage(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const dest = fs.createWriteStream(path.join(DOWNLOAD_DIR, filename));
  return new Promise((resolve, reject) => {
    res.body.pipe(dest);
    res.body.on('error', reject);
    dest.on('finish', resolve);
    dest.on('error', reject);
  });
}

async function main() {
  await mongoose.connect(MONGODB_URI, {
    user: MONGODB_USER,
    pass: MONGODB_PASS,
    dbName: MONGODB_DBNAME,
  });

  const images = await UploadedImage.find({ isDeleted: false });
  console.log(`Found ${images.length} images.`);

  for (const img of images) {
    const url = img.uri;
    const ext = path.extname(url).split('?')[0] || '.jpg';
    const filename = `${img.fileName || img._id}${ext}`;
    try {
      await downloadImage(url, filename);
      console.log(`Downloaded: ${filename}`);
    } catch (err) {
      console.error(`Failed to download ${url}:`, err.message);
    }
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 