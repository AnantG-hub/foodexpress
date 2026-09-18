import express from "express";
import Food from "../models/food.js";

const router = express.Router();

// Get all foods
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new food
router.post("/add", async (req, res) => {
  const { name, description, price, image } = req.body;
  try {
    const newFood = new Food({ name, description, price, image });
    await newFood.save();
    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete food
router.delete("/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
