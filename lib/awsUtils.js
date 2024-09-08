const crypto = require('crypto');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const {
  getImageById,
  addImage,
  updateImageById,
  deleteImageByKey,
} = require('../models/image');

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketUrl = process.env.AWS_BUCKET_URL;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const cdnDomainName = process.env.AWS_CDN_DOMAIN_NAME;
const cdnPrivateKey = process.env.AWS_CDN_PRIVATE_KEY;
const cdnKeyPairId = process.env.AWS_CDN_KEY_PAIR_ID;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

// Function to generate a random image name
const randomString = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Function to delete an image from S3 and database
async function deleteImage(image_key) {
  const params = {
    Bucket: bucketName,
    Key: image_key,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);
  await deleteImageByKey(image_key);
}

// Function to get a signed URL for an image
function getImageSignedUrl(image_key) {
  return getSignedUrl({
    url: cdnDomainName + image_key,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toString(),
    privateKey: cdnPrivateKey || "",
    keyPairId: cdnKeyPairId || "",
  });
}

// Function to add an image to S3 and save metadata in the database
async function addImageToBucket(buffer, mimetype, originalName) {
  const imageKey = randomString();

  const params = {
      Bucket: bucketName,
      Key: imageKey,
      Body: buffer,
      ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  await addImage({ 
    name: `${originalName}-${imageKey}`, 
    key: imageKey, 
    //url: `${cdnDomainName}${imageKey}`,
    url: `${bucketUrl}${imageKey}`,
  });

  return imageKey;
}

async function updateImage(image_id, image) {
  const existingImage = await getImageById(image_id);
  if (!existingImage) {
    throw new Error('Image not found');
  }

  await deleteImage(existingImage.key);

  const params = {
      Bucket: bucketName,
      Key: existingImage.key,
      Body: buffer,
      ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  await updateImageById(image_id, {
    name: `${image.name}-${existingImage.key}`,
    key: existingImage.key,
  });
};

module.exports = { addImageToBucket, getImageSignedUrl, deleteImage, updateImage };
