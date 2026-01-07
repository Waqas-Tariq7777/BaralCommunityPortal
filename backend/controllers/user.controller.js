import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import cloudinary from "../utils/cloudinary.js";

const uploadProfilePicture = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "User ID is required");

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (!req.file) throw new ApiError(400, "No file uploaded");

  if (user.profilePicture?.publicId) {
    await cloudinary.uploader.destroy(user.profilePicture.publicId);
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "profile_pictures", resource_type: "image" },
    async (error, result) => {
      if (error) throw new ApiError(500, error.message);

      user.profilePicture = { url: result.secure_url, publicId: result.public_id };
      await user.save();

      res.status(200).json(
        new ApiResponse(200, user.profilePicture, "Profile picture updated successfully")
      );
    }
  );

  uploadStream.end(req.file.buffer);
});

const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.isPasswordCorrect(currentPassword);
  if (!isValid) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

export { uploadProfilePicture, changePassword };
