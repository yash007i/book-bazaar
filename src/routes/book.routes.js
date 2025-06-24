import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controllers.js";

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
  addBook,
);
bookRouter.route("/get-books").get(isLoggedIn, getAllBooks);
bookRouter.route("/book-by-id/:bookId").get(isLoggedIn, getBookById);
bookRouter.route("/update-book/:bookId").put(isLoggedIn, updateBook);
bookRouter.route("/delete-book/:bookId").put(isLoggedIn, deleteBook);

export default bookRouter;
