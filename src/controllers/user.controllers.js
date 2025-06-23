import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateUniqueToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const uniqueToken = user.generateUniqueToken();

    user.uniqueToken = uniqueToken;
    await user.save({ validateBeforeSave: false });

    return { uniqueToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong, while generated tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone } = req.body;

  if (
    [fullname, email, password, phone].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User is alredy exist with this credentials.");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Avatar file is must under 1MB.");
    }
  }

  const user = await User.create({
    fullname,
    avatar: {
      url: avatar?.url || "",
      localPath: avatarLocalPath || "",
    },
    email,
    password,
    phone,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -uniqueToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong, while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User rigister successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found, Please register first.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credential.");
  }

  const { uniqueToken } = await generateUniqueToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -uniqueToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("uniqueToken", uniqueToken, options)
    .json(new ApiResponse(200, loggedInUser, "User loggin successfully."));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).updateOne({
    uniqueToken: "",
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .cookie("uniqueToken", "")
    .json(new ApiResponse(200, "User logout successfully."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).select("-password -uniqueToken ");

  if (!user) {
    throw new ApiError(404, "User not found while getting a user.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User data found successfully", user));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, password, conformPassword } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (password !== conformPassword) {
    throw new ApiError(402, "Credentials are not match.");
  }

  user.password = conformPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully."));
});

const refreshUniqueToken = asyncHandler(async (req, res) => {
  const { uniqueToken } = req.cookies;

  if (!uniqueToken) {
    throw new ApiError(401, "Unauthorisezed User.");
  }

  try {
    const decodedToken = jwt.verify(
      uniqueToken,
      process.env.UNIQUE_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.uniqueToken !== uniqueToken) {
      throw new ApiError(
        403,
        "Refresh token does not match. Possible token reuse detected.",
      );
    }

    const { uniqueToken } = await generateUniqueToken(user._id);

    user.uniqueToken = uniqueToken;
    await user.save();

    const cookieOption = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("uniqueToken", uniqueToken, cookieOption);
    return res
      .status(200)
      .json(new ApiResponse(200, "Token refresh successfully."));
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  refreshUniqueToken,
};
