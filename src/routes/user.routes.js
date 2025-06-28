import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshUniqueToken,
  registerUser,
  updateUserRole,
} from "../controllers/user.controllers.js";
import {
  isAdmin,
  isLoggedIn,
  verifyApiKey,
} from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  userForgotPasswordValidator,
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/user.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";

const userRouter = Router();
userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  userRegistrationValidator(),
  validate,
  registerUser,
);
userRouter.route("/login").post(userLoginValidator(), validate, loginUser);
userRouter
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPassword);

userRouter.route("/logout").get(isLoggedIn, verifyApiKey, logoutUser);
userRouter.route("/get-user").get(isLoggedIn, verifyApiKey, getCurrentUser);
userRouter.route("/refresh-token").get(isLoggedIn, refreshUniqueToken);

userRouter.route("/role").patch(isLoggedIn, isAdmin, updateUserRole);

export default userRouter;
