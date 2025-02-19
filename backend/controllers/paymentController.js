import Razorpay from "razorpay";
import Song from "../models/songs.model.js";
import Purchase from "../models/purchase.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Configure Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order for a song
export const createOrder = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user.id;

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    if (!song.price) {
      return res.status(400).json({ error: "Song price is missing" });
    }

    const options = {
      amount: song.price * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Order created successfully", order);

    const purchase = new Purchase({
      user: userId,
      song: song._id,
      orderId: order.id,
      amount: song.price,
      status: "pending",
    });

    await purchase.save();

    res.json({ success: true, order, song });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};

// Verify payment and grant access
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, songId } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const purchase = await Purchase.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, status: "completed" },
      { new: true }
    );

    if (!purchase) return res.status(404).json({ error: "Purchase not found" });

    const user = await User.findByIdAndUpdate(
      purchase.user,
      { $addToSet: { purchasedFiles: songId } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    res.json({ success: true, file_url: song.file_url });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed", details: error.message });
  }
};
