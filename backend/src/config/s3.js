const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generatePresignedUrls = async (count = 1, contentType = 'image/jpeg') => {
  const urls = [];
  const keys = [];

  for (let i = 0; i < count; i++) {
    const key = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    urls.push(url);
    keys.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`);
  }

  return { signedUrls: urls, publicUrls: keys };
};

module.exports = { s3Client, generatePresignedUrls };
