import { body } from "express-validator";

export const createReviewValidator = () => {
  [
    body("owner")
      .notEmpty()
      .withMessage("Owner (User ID) is required")
      .isMongoId()
      .withMessage("Owner must be a valid MongoDB ObjectId"),

    body("book")
      .notEmpty()
      .withMessage("Book ID is required")
      .isMongoId()
      .withMessage("Book must be a valid MongoDB ObjectId"),

    body("comment")
      .notEmpty()
      .withMessage("Comment is required")
      .isString()
      .withMessage("Comment must be a string")
      .trim()
      .toLowerCase(),

    body("rating")
      .notEmpty()
      .withMessage("Rating is required")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ];
};
