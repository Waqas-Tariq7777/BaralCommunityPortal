// imports
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { User } from '../models/user.model.js'
import { sendLoginNotification } from "../utils/NodeMailer.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "../utils/NodeMailer.js";
// login user controller
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
};

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "User not found/Incorrect Email")
    }

    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(400, "Password is Incorrect")
    }

    const { accessToken } = await generateToken(user._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    }
      sendLoginNotification(user.email, user.userName);
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {
                id: user._id,
                userName: user.userName,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePicture: user.profilePicture,
                designation: user.designation,
                houseNumber: user.houseNumber,
                mobileNumber: user.mobileNumber,
                joinedAt: user.createdAt,
                accessToken
            }, "User logged in successfully")
        );
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const resetToken = jwt.sign(
        { _id: user._id },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: process.env.RESET_TOKEN_EXPIRY }
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return res.status(200).json(
        new ApiResponse(200, {}, "Reset link sent to email")
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        throw new ApiError(400, "All fields required");
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(400, "Invalid or expired token");
    }

    const user = await User.findById(decoded._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.password = password;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successful")
    );
});

export { loginUser }
