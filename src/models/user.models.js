import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placeholder.co/600x400`,
        localPath: "",
      },
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.CUSTOMER,
    },
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    uniqueToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
