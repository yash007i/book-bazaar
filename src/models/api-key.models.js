import mongoose, { Schema } from "mongoose";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
