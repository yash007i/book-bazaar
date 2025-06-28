import { body } from "express-validator";

createBookValidator = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string")
      .trim()
      .toLowerCase(),

    body("author")
      .notEmpty()
      .withMessage("Author (User ID) is required")
      .isMongoId()
      .withMessage("Author must be a valid MongoDB ObjectId"),

    body("publisher")
      .notEmpty()
      .withMessage("Publisher (User ID) is required")
      .isMongoId()
      .withMessage("Publisher must be a valid MongoDB ObjectId"),

    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be a string")
      .trim()
      .toLowerCase(),

    body("langauage")
      .optional()
      .isArray()
      .withMessage("Language must be an array of strings")
      .custom((arr) => arr.every((lang) => typeof lang === "string"))
      .withMessage("Each language must be a string"),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("pages")
      .notEmpty()
      .withMessage("Pages count is required")
      .isInt({ min: 1 })
      .withMessage("Pages must be a positive integer"),

    body("isAvailable")
      .optional()
      .isBoolean()
      .withMessage("isAvailable must be a boolean"),

    body("genres")
      .optional()
      .isArray()
      .withMessage("Genres must be an array of strings")
      .custom((arr) => arr.every((g) => typeof g === "string"))
      .withMessage("Each genre must be a string"),
  ];
};

export { createBookValidator };
