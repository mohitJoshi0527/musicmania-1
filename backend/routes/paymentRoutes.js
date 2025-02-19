import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Order creation: Accepts `songId` from request body
router.post("/order", authMiddleware, createOrder);

// Payment verification: Ensures user authentication
router.post("/verify", authMiddleware, verifyPayment);

export default router;
