import cloudinary from "cloudinary";
import fs from "fs";

// Ensure environment variables are loaded
// Ensure environment variables are loaded
import dotenv from 'dotenv'
dotenv.config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify environment variables are set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary environment variables are not set. Please check your .env file.');
}


const uploadImage = async (localPath) => {
  try {
    if (!localPath) return null + "local path not found";

    const response = await cloudinary.v2.uploader.upload(localPath, {
      resource_type: "auto",
    });

    // File upload successfully completed
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath); // Delete the local file
    }

    console.log(response)

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Upload Error:", error);

    // Ensure the local file is deleted if it exists
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    return null + "error"; // Consider returning error details instead
  }
};

export default uploadImage;
