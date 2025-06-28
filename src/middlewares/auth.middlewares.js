import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { AvailableUserRoles } from "../constants/userRole.js";
import { ApiKey } from "../models/api-key.models.js";

const isLoggedIn = async (req, res, next) => {
  const { uniqueToken } = req.cookies;

  if (!uniqueToken) {
    throw new ApiError(403, "Unauthorized user.");
  }

  try {
    const decodedToken = jwt.verify(
      uniqueToken,
      process.env.UNIQUE_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken._id).select(
      "-password -uniqueToken",
    );

    if (!user) {
      throw new ApiError(404, "User not found, Please register first.");
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired access token."));
  }
};

// middlewares/isAdmin.js
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === AvailableUserRoles.ADMIN) {
    return next(); // Authorized
  }
  throw new ApiError(403, "Access denied. Admins only.");
};

// verify API key
const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    throw new ApiError(401, "API Key required in x-api-key header");
  }

  try {
    const keyRecord = await ApiKey.findOne({ key: apiKey, active: true });

    if (!keyRecord) {
      throw new ApiError(403, "Invalid or inactive API Key");
    }

    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      // Optionally deactivate it now
      keyRecord.active = false;
      await keyRecord.save();

      throw new ApiError(403, "API Key has expired");
    }

    // Attach the API key owner to the request if needed
    req.apiKeyOwner = keyRecord.owner;
    next();
  } catch (err) {
    console.error("API Key verification failed:", err);
    throw new ApiError(500, "Server error verifying API Key");
  }
};

export { isLoggedIn, isAdmin, verifyApiKey };
