import express from "express";
import { OrderController } from "../controllers/orderControllers";
import { checkAuthentication } from "../middleware/auth";

const router = express.Router();

// All order routes require authentication
router.use(checkAuthentication);

// Get all orders for a user
router.get("/", OrderController.getAllOrders);

// Get user's order history
router.get("/history", OrderController.getUserOrderHistory);

// Create a new order
router.post("/", OrderController.createOrder);

// Get order details by ID
router.get("/:id", OrderController.getOrderById);

export default router;
