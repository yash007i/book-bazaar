import { Router } from "express";
import { isLoggedIn, verifyApiKey } from "../middlewares/auth.middlewares.js";
import {
  deleteOrder,
  getOrderById,
  getUserOrders,
  placeOrder,
  updateOrder,
} from "../controllers/order.controllers.js";
import { createOrderValidator } from "../validators/order.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";

const orderRouter = Router();

orderRouter
  .route("/placed")
  .post(isLoggedIn, verifyApiKey, createOrderValidator(), validate, placeOrder);
orderRouter
  .route("/get-user-orders")
  .get(isLoggedIn, verifyApiKey, getUserOrders);
orderRouter
  .route("/get-order/:orderId")
  .get(isLoggedIn, verifyApiKey, getOrderById);
orderRouter
  .route("/delete-order/:orderId")
  .delete(isLoggedIn, verifyApiKey, deleteOrder);
orderRouter
  .route("/update-order/:orderId")
  .put(isLoggedIn, verifyApiKey, updateOrder);

export default orderRouter;
