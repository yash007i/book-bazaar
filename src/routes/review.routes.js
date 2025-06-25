import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewByUser,
} from "../controllers/review.controllers.js";

const reviewRouter = Router();

reviewRouter.route("/create-review/:bookId").post(isLoggedIn, createReview);
reviewRouter.route("/get-book-reviews/:bookId").get(isLoggedIn, getAllReviews);
reviewRouter.route("/get-review-user").get(isLoggedIn, getReviewByUser);
reviewRouter.route("/delete-review/:reviewId").delete(isLoggedIn, deleteReview);

export default reviewRouter;
