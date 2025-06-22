import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: String,
        required: true,
        trim: true,
      },
      lng: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model("Address", addressSchema);
