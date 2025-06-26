import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { Book } from "../models/book.models.js";
import { DeliveryPartner } from "../models/deliveryPartner.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AvailableOrderStatus } from "../constants/orderStatus.js";
import { AvailablePaymentStatus } from "../constants/paymentStatus.js";

const placeOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { items } = req.body;
  if (!items || items.length === 0) {
    throw new ApiError(400, "Order items are required.");
  }
  // Find all books id uniquely
  const books = await Book.find({
    _id: { $in: items.map((item) => item.book) },
  });
  console.log(books);

  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
    // Travers in books and find book (Improve security)
    const book = books.find((b) => b._id.toString() === item.book?.toString());
    if (!book) {
      throw new ApiError(404, "Book not found", item.book);
    }

    if (!book.isAvailable) {
      throw new ApiError(
        400,
        "Sorry! Book is not available in stock currently.",
      );
    }

    const quantity = item.quantity || 1;
    const itemTotal = book.price * quantity;
    totalAmount += itemTotal;

    validatedItems.push({
      book: book._id,
      quantity,
    });
  }

  const newOrder = await Order.create({
    customer: user._id,
    items: validatedItems,
    totalAmount,
    orderStatus: AvailableOrderStatus.PENDING,
    paymentStatus: AvailablePaymentStatus.PENDING,
    deliveryAddress: user?.address,
  });

  if (!newOrder) {
    throw new ApiError(500, "Error while placing order.");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, newOrder, "Order placed successfully."));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User must be required.");
  }

  const orders = await Order.find({ customer: userId })
    .populate("customer", "fullname email phone avatar")
    .populate("items.book", "title price") // show book title and price
    .populate("deliveryAddress") // show address details
    .populate("deliveryPartner", "name") // show delivery partner name
    .sort({ createdAt: -1 });

  if (!orders) {
    throw new ApiError(404, "Orders not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully."));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order Id must be required.");
  }

  const order = await Order.findById(orderId)
    .populate("customer", "fullname email phone avatar")
    .populate("items.book", "title price")
    .populate("deliveryAddress")
    .populate("deliveryPartner", "name");

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order found successfully."));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order Id must be required.");
  }

  const deletedOrder = await Order.findByIdAndDelete(orderId);

  if (!deletedOrder) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedOrder, "Order deleted successfully."));
});

const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const updatedData = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order Id must be required.");
  }

  if (!updatedData) {
    throw new ApiError(400, "Data is required for updating order.");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!order.customer.equals(userId)) {
    throw new ApiError(403, "You are not allowed to update this order.");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    {
      _id: orderId,
    },
    {
      $set: updatedData,
    },
    {
      new: true,
    },
  )
    .populate("customer", "name email")
    .populate("items.book", "title price")
    .populate("deliveryAddress")
    .populate("deliveryPartner", "fullname email phone");

  if (!updateOrder) {
    throw new ApiError(500, "Error while updating order.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, "Order updated successfully."));
});
export { placeOrder, getUserOrders, getOrderById, deleteOrder, updateOrder };
