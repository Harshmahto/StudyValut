import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
      const uploadOptions = {
        resource_type: "auto", // Automatically detect resource type
        headers: {
          "X-Robots-Tag": "noindex", // Prevent indexing by search engines
        },
      };
      if (!localFilePath) return null
      //upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, uploadOptions)
      // file has been uploaded successfull
      // console.log("file is uploaded on cloudinary ", response.url);
      fs.unlinkSync(localFilePath)
      return response;

  } catch (error) {
      fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
      return null;
  }
}



export {
  uploadOnCloudinary,
}