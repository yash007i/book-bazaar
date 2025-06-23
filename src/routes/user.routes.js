import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshUniqueToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const userRouter = Router();
userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser,
);
userRouter.route("/login").post(loginUser);
userRouter.route("/forgot-password").post(forgotPassword);

userRouter.route("/logout").get(isLoggedIn, logoutUser);
userRouter.route("/get-user").get(isLoggedIn, getCurrentUser);
userRouter.route("/refresh-token").get(isLoggedIn, refreshUniqueToken);

export default userRouter;
