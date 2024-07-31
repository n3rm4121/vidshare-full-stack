import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to extract the public ID from the Cloudinary URL
const extractPublicId = (url) => {
  const urlParts = url.split('/');
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split('.')[0];
  return publicId;
};

const deleteMedia = async (mediaUrl, mediaType, mediaName) => {
  try {
    const publicId = extractPublicId(mediaUrl);
    let result;

    // Check media type to determine Cloudinary method
    if (mediaType === 'image') {
      result = await cloudinary.uploader.destroy(publicId);
    } else if (mediaType === 'video') {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    } else {
      console.error(`Unsupported media type: ${mediaType}`);
      return;
    }

    if (result.result === 'ok') {
      console.log(`Successfully deleted old ${mediaType} : ${mediaName} from Cloudinary`);
    } else {
      console.error(`Failed to delete old ${mediaType} ${mediaName} from Cloudinary`, result);
    }
  } catch (error) {
    console.error(`Error deleting old ${mediaType}:  ${mediaName} from Cloudinary`, error);
  }
};

export default deleteMedia;
