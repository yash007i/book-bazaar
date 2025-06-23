import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

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
export { isLoggedIn };
