import dotenv from 'dotenv';
dotenv.config();

export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export default {
  isCloudinaryConfigured,
};
