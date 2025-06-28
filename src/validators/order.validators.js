import { body } from "express-validator";
import { AvailableOrderStatus } from "../constants/orderStatus.js";
import { AvailablePaymentStatus } from "../constants/paymentStatus.js";

createOrderValidator = () => {
  return [
    body("customer")
      .notEmpty()
      .withMessage("Customer ID is required")
      .isMongoId()
      .withMessage("Customer must be a valid MongoDB ObjectId"),

    body("deliveryPartner")
      .optional()
      .isMongoId()
      .withMessage("Delivery partner must be a valid MongoDB ObjectId"),

    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),

    body("items.*.book")
      .notEmpty()
      .withMessage("Book ID is required in each item")
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ObjectId"),

    body("items.*.quantity")
      .notEmpty()
      .withMessage("Quantity is required in each item")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),

    body("totalAmount")
      .notEmpty()
      .withMessage("Total amount is required")
      .isFloat({ min: 0 })
      .withMessage("Total amount must be a positive number"),

    body("orderStatus")
      .optional()
      .isIn(AvailableOrderStatus)
      .withMessage(
        `Order status must be one of: ${AvailableOrderStatus.join(", ")}`,
      ),

    body("paymentStatus")
      .optional()
      .isIn(AvailablePaymentStatus)
      .withMessage(
        `Payment status must be one of: ${AvailablePaymentStatus.join(", ")}`,
      ),

    body("deliveryAddress")
      .optional()
      .isMongoId()
      .withMessage("Delivery address must be a valid MongoDB ObjectId"),
  ];
};

export { createOrderValidator };
