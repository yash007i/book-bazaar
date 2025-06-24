import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Book } from "../models/book.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { UserRolesEnum } from "../constants/userRole.js";
import mongoose from "mongoose";

const addBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    publisher,
    description,
    langauage,
    price,
    pages,
    isAvailable,
    genres,
  } = req.body;

  if (
    [
      title,
      author,
      publisher,
      description,
      langauage,
      price,
      pages,
      isAvailable,
      genres,
    ].some((field) => req.body[field]?.trim())
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedBook = await Book.findOne({ title });
  if (existedBook) {
    throw new ApiError(409, "Book is alredy exist with this credentials.");
  }

  const coverImageLocalPath = req.files?.avatar[0]?.path;
  const backImageLocalPath = req.files?.coverImage[0]?.path;

  if (!coverImageLocalPath || !backImageLocalPath) {
    throw new ApiError(400, "Both images are required.");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  const backImage = await uploadOnCloudinary(backImageLocalPath);

  if (!coverImage || !backImage) {
    throw new ApiError(400, "Images file are required.");
  }

  const book = await Book.create({
    title,
    author,
    publisher,
    description,
    langauage,
    price,
    pages,
    isAvailable,
    genres,
    coverImage: {
      url: coverImage?.url || "",
      localPath: coverImageLocalPath || "",
    },
    backImage: {
      url: backImage?.url || "",
      localPath: backImageLocalPath || "",
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, book, "Book register successfully."));
});

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find()
    .populate("author", "fullname email phone avatar") //Populate author field
    .populate("publisher", "fullname email phone avatar"); //Populate author field with required data

  if (!books) {
    throw new ApiError(404, "Books not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, books, "Books found successfully."));
});

const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(bookId),
      },
    },
    // Lookup for author data
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    // Lookup for publisher data
    {
      $lookup: {
        from: "users",
        localField: "publisher",
        foreignField: "_id",
        as: "publisher",
      },
    },
    { $unwind: "$publisher" },
    {
      $project: {
        title: 1,
        description: 1,
        price: 1,
        genres: 1,
        isAvailable: 1,
        langauage: 1,
        pages: 1,
        reviews: 1,
        createdAt: 1,
        updatedAt: 1,
        coverImage: 1,
        backImage: 1,

        author: {
          fullname: 1,
          email: 1,
          phone: 1,
          avatar: 1,
        },

        publisher: {
          fullname: 1,
          email: 1,
          phone: 1,
          avatar: 1,
        },
      },
    },
  ]);

  if (!book) {
    throw new ApiError(404, "Book was not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, book, "Book found successfully."));
});

const updateBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const user = req.user;
  const {
    title,
    author,
    publisher,
    description,
    langauage,
    price,
    pages,
    isAvailable,
    genres,
  } = req.body;

  if (user.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(401, "Unauthorized request.");
  }
  const book = await Book.findById({ _id: bookId });
  if (!book) {
    throw new ApiError(404, "Book not found for update.");
  }
  if (
    [
      title,
      author,
      publisher,
      description,
      langauage,
      price,
      pages,
      isAvailable,
      genres,
    ].some((field) => req.body[field]?.trim())
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const coverImageLocalPath = req.files?.avatar[0]?.path;
  const backImageLocalPath = req.files?.coverImage[0]?.path;

  if (!coverImageLocalPath || !backImageLocalPath) {
    throw new ApiError(400, "Both images are required.");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  const backImage = await uploadOnCloudinary(backImageLocalPath);

  if (!coverImage || !backImage) {
    throw new ApiError(400, "Images file are required.");
  }

  const updatedBook = await Book.findByIdAndUpdate(
    {
      _id: bookId,
    },
    {
      title,
      author,
      publisher,
      description,
      langauage,
      price,
      pages,
      isAvailable,
      genres,
      coverImage: {
        url: coverImage?.url || "",
        localPath: coverImageLocalPath || "",
      },
      backImage: {
        url: backImage?.url || "",
        localPath: backImageLocalPath || "",
      },
    },
    {
      new: true, // return the updated document
      runValidators: true, // validate before update
    },
  );

  return res
    .status(201)
    .json(new ApiResponse(200, updatedBook, "Book update successfully."));
});

const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const deletedBook = await Book.findByIdAndDelete({
    _id: bookId,
  });

  if (!deletedBook) {
    throw new ApiError(404, "Book not found for delete.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedBook, "Book deleted successfully."));
});
export { 
    addBook, 
    getAllBooks, 
    getBookById, 
    updateBook,
    deleteBook,
 };
