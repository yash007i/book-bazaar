import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Review } from "../models/review.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReview = asyncHandler(async (req, res) => {
  const user = req.user;
  const { comment, rating } = req.body;
  const { bookId } = req.params;

  if (!bookId || !comment || !rating) {
    throw new ApiError(400, "Please provide a valid credentials for review.");
  }

  const review = await Review.create({
    comment,
    owner: user?._id,
    book: bookId,
    rating,
  });

  if (!review) {
    throw new ApiError(400, "Failed to create comment or review.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        review,
        " Thank you! Your review has been submitted successfully.",
      ),
    );
});

const getAllReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const reviews = await Review.find({
    book: bookId,
  })
    .populate("owner", "fullname email phone avatar")
    .populate("book", "author title description publisher pages price");

  if (!reviews) {
    throw new ApiError(404, "Reviews not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully."));
});

const getReviewByUser = asyncHandler(async (req, res) => {
  const user = req.user;

  const userReviews = await Review.aggregate([
    {
      $match: {
        owner: user._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $lookup: {
        from: "users",
        localField: "book.author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "users",
        localField: "book.publisher",
        foreignField: "_id",
        as: "publisher",
      },
    },
    { $unwind: "$publisher" },
    {
      $project: {
        _id: 1,
        rating: 1,
        comment: 1,
        owner: {
          fullname: "$owner.fullname",
          email: "$owner.email",
          phone: "$owner.phone",
          avatar: "$owner.avatar",
        },
        book: {
          title: "$book.title",
          description: "$book.description",
          pages: "$book.pages",
          price: "$book.price",
          author: {
            fullname: "$author.fullname",
            email: "$author.email",
            phone: "$author.phone",
            avatar: "$author.avatar",
          },
          publisher: {
            fullname: "$publisher.fullname",
            email: "$publisher.email",
            phone: "$publisher.phone",
            avatar: "$publisher.avatar",
          },
        },
      },
    },
  ]);

  if (!userReviews || userReviews.length === 0) {
    throw new ApiError(404, "Reviews not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userReviews, "Review fetched successfully."));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!reviewId) {
    throw new ApiError(400, "Missing or Invalid Review ID.");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "No such review not found.");
  }

  if (!review.owner.equals(userId)) {
    throw new ApiError(403, "You are not allowed to delete this review.");
  }

  const deletedReview = await Review.findByIdAndDelete(reviewId);

  if (!deletedReview) {
    throw new ApiError(400, "Failed to delete the review.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedReview, "review deleted successfully."));
});
export { 
    createReview, 
    getAllReviews, 
    getReviewByUser, 
    deleteReview 
};
