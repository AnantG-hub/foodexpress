import express from "express";
import Order from "../models/Order.js";


const router = express.Router();

// POST /api/payment/pay
router.post("/pay", async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
      return res.status(400).json({ message: "Order ID and Payment Method required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    order.status = "Paid";
    order.paymentMethod = paymentMethod;
    await order.save();

    req.app.get("io")?.to(orderId).emit("paymentDone", order);

    res.status(200).json({ message: "Payment successful", order });

  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


export default router;
