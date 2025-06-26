import mongoose, { Schema } from "mongoose";

const deliveryPartnerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One delivery profile per user
    },
    vehicle: {
      number: {
        type: String,
        required: [true, "Vehicle number is required"],
        trim: true,
      },
      type: {
        type: String,
        enum: ["Bike", "Scooter", "Car", "Van", "Other"],
        default: "Bike",
      },
    },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    deliveredOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    currentOrder: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        customer: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        order: {
          type: Schema.Types.ObjectId,
          ref: "Order",
        },
        comment: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema,
);
