import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    coverImage: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placeholder.co/600x400`,
        localPath: "",
      },
    },
    backImage: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placeholder.co/600x400`,
        localPath: "",
      },
    },
    langauage: [String],
    price: {
      type: Number,
      required: true,
      default: 0.0,
      trim: true,
    },
    pages: {
      type: Number,
      required: true,
      default: 0.0,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      requires: true,
      default: true,
    },
    genres: [String],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true },
);

export const Book = mongoose.model("Book", bookSchema);
