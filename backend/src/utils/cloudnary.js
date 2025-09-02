import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_APIKEY,
  api_secret: process.env.CLOUDNARY_SECRET,
});

// 🔹 Helper to safely delete local files
const deleteLocalFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err) console.error("❌ Error deleting local file:", err);
  });
};

// 🔹 Upload any file to Cloudinary
const uploadOnCloudnary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "home/learnDummy",
    });

    console.info("✅ File uploaded:", response.url);
    deleteLocalFile(localFilePath); // cleanup after success
    return response;
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);
    deleteLocalFile(localFilePath); // cleanup after failure
    return null;
  }
};

// 🔹 Update avatar (delete old → upload new)
const updateAvatar = async (oldCloudinaryUrl, localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Extract public_id from old URL
    const publicId = oldCloudinaryUrl
      ? oldCloudinaryUrl.split("/").pop().split(".")[0]
      : null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("🗑️ Old avatar deleted:", publicId);
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "home/learnDummy",
    });

    console.info("✅ New avatar uploaded:", response.url);
    deleteLocalFile(localFilePath);
    return response;
  } catch (error) {
    console.error("❌ Error updating avatar:", error);
    deleteLocalFile(localFilePath);
    return null;
  }
};

// 🔹 Update cover image
const updateCoverImage = async (oldCloudinaryUrl, localFilePath) => {
  try {
    if (!localFilePath) return null;

    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("🗑️ Old cover image deleted:", publicId);
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "home/learnDummy",
    });

    console.log("✅ New cover image uploaded:", response.url);
    deleteLocalFile(localFilePath);
    return response;
  } catch (error) {
    console.error("❌ Error updating cover image:", error);
    deleteLocalFile(localFilePath);
    return null;
  }
};

// 🔹 Delete avatar
const deleteAvatar = async (oldCloudinaryUrl) => {
  try {
    if (!oldCloudinaryUrl) return null;

    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("🗑️ Avatar deleted:", publicId);
    }

    return true;
  } catch (error) {
    console.error("❌ Error deleting avatar:", error);
    return null;
  }
};

// 🔹 Delete cover image
const deleteCoverImage = async (oldCloudinaryUrl) => {
  try {
    if (!oldCloudinaryUrl) return null;

    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("🗑️ Cover image deleted:", publicId);
    }

    return true;
  } catch (error) {
    console.error("❌ Error deleting cover image:", error);
    return null;
  }
};

// 🔹 Delete any image
const deleteImage = async (oldCloudinaryUrl) => {
  try {
    if (!oldCloudinaryUrl) return null;

    const publicId =
      oldCloudinaryUrl?.split("/")?.pop()?.split(".")?.[0] || null;

    if (publicId) {
      await cloudinary.uploader.destroy(`home/learnDummy/${publicId}`);
      console.info("🗑️ Image deleted:", publicId);
    }

    return true;
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    return null;
  }
};

export {
  uploadOnCloudnary,
  updateAvatar,
  updateCoverImage,
  deleteCoverImage,
  deleteAvatar,
  deleteImage,
};
