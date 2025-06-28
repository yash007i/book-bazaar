import { Router } from "express";
import { isAdmin, isLoggedIn, verifyApiKey } from "../middlewares/auth.middlewares.js";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createBookValidator } from "../validators/book.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";

const bookRouter = Router();

bookRouter.route("/add-book").post(
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "backImage",
      maxCount: 1,
    },
  ]),
  isLoggedIn,
  isAdmin,
  createBookValidator(),
  validate,
  addBook,
);
bookRouter.route("/get-books").get(isLoggedIn, verifyApiKey, getAllBooks);
bookRouter
  .route("/book-by-id/:bookId")
  .get(isLoggedIn, verifyApiKey, getBookById);
bookRouter
  .route("/update-book/:bookId")
  .put(isLoggedIn, verifyApiKey, isAdmin, updateBook);
bookRouter
  .route("/delete-book/:bookId")
  .put(isLoggedIn, verifyApiKey, isAdmin, deleteBook);

export default bookRouter;
