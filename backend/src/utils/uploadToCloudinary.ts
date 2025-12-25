import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (filepath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder,
      resource_type: "auto",
    });

    fs.unlinkSync(filepath);
    return result.secure_url;
  } catch (error: any) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};
