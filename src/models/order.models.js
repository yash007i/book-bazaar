import mongoose, { Schema } from "mongoose";
import { AvailableOrderStatus } from "../constants/orderStatus.js";
import { AvailablePaymentStatus } from "../constants/paymentStatus.js";

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryPartner: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
    items: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      trim: true,
    },
    orderStatus: {
      type: String,
      enum: AvailableOrderStatus,
    },
    paymentStatus: {
      type: String,
      enum: AvailablePaymentStatus,
    },
    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
