import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 🔹 GET ALL ORDERS (Admin)
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// 🔹 GET ORDERS BY USER
router.get("/user/:name", async (req, res) => {
  try {
    const orders = await Order.find({ customerName: req.params.name })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 CREATE ORDER (Checkout)
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 UPDATE ORDER STATUS (Admin)
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 DELETE ORDER
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Order deleted" });
});

export default router;
