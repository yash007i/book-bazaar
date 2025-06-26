import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { 
    deleteOrder,
    getOrderById,
    getUserOrders, 
    placeOrder, 
    updateOrder,
} from "../controllers/order.controllers.js";

const orderRouter = Router();

orderRouter.route("/placed").post(isLoggedIn, placeOrder);
orderRouter.route("/get-user-orders").get(isLoggedIn, getUserOrders);
orderRouter.route("/get-order/:orderId").get(isLoggedIn, getOrderById);
orderRouter.route("/delete-order/:orderId").delete(isLoggedIn, deleteOrder);
orderRouter.route("/update-order/:orderId").put(isLoggedIn, updateOrder);

export default orderRouter;
