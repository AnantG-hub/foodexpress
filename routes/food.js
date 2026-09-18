import express from "express";
import multer from "multer";
import Food from "../models/Food.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
     const uploadPath = "D:/food/backend/uploads"; // absolute path
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ================= GET all foods =================
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= POST add food =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Name and price are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const food = new Food({
      name,
      description: description || "",
      price: parseFloat(price),
      image: req.file.filename
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully!", food });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add food" });
  }
});

// ================= DELETE food =================
router.delete("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    // Delete image file from uploads folder
    if (food.image) {
      const imgPath = path.join("./uploads", food.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Food deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete food" });
  }
});

export default router;
