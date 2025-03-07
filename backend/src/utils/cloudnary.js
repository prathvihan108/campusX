import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs"; //by default in node js//file system

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_APIKEY,
  api_secret: process.env.CLOUDNARY_SECRET,
});

const uploadOnCloudnary = async (localfilepath) => {
  try {
    if (!localfilepath) {
      return null;
    }
    //upload to the cloudnary
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
      folder: "home/learnDummy",
    });

    //file uploads successfully
    console.info("File uploaded :", response.url);
    return response;
  } catch (error) {
    console.log("error while uplading on cloudnary");
    fs.unlinkSync(localfilepath);
  }
};

const updateAvatar = async (oldCloudinaryUrl, localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // Extract public_id from the old Cloudinary URL
    const publicId = oldCloudinaryUrl
      ? oldCloudinaryUrl.split("/").pop().split(".")[0]
      : null;

    // Delete the old avatar
    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("Old avatar deleted:", publicId);
    }

    // Upload the new avatar
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "home/learnDummy",
    });

    console.info("New avatar uploaded:", response.url);
    return response;
  } catch (error) {
    console.error("Error updating avatar:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const updateCoverImage = async (oldCloudinaryUrl, localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // Extract public_id from the old Cloudinary URL
    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    // Delete the old avatar
    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("Old coverImage deleted:", publicId);
    }

    // Upload the new avatar
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "home/learnDummy",
    });

    console.log("New coverImage uploaded:", response.url);
    return response;
  } catch (error) {
    console.error("Error updating coverImage:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteAvatar = async (oldCloudinaryUrl) => {
  try {
    if (!oldCloudinaryUrl) {
      return null;
    }

    // Extract public_id
    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("Avatar deleted:", publicId);
    }

    return true;
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return null;
  }
};

const deleteCoverImage = async (oldCloudinaryUrl) => {
  try {
    if (!oldCloudinaryUrl) {
      return null;
    }

    // Extract public_id
    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("Cover Image deleted:", publicId);
    }

    return true;
  } catch (error) {
    console.error("Error deleting cover image:", error);
    return null;
  }
};

const deleteImage = async (oldCloudinaryUrl) => {
  try {
    if (!oldCloudinaryUrl) {
      return null;
    }

    // Extract public_id
    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("Image deleted:", publicId);
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return null;
  }
};

export {
  uploadOnCloudnary,
  updateAvatar,
  updateCoverImage,
  deleteCoverImage,
  deleteAvatar,
  deleteImage, //post image
};
