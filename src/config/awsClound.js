const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.S3_ENDPOINT_URL,
  forcePathStyle: true, //with supase
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

async function deleteMediaFromCloud(mediaKey) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: mediaKey,
      })
    );
    return 200
} catch (error) {
    return 400
  }
}

const storage = multer.memoryStorage();

module.exports = { s3Client, storage, deleteMediaFromCloud };
