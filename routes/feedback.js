import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback({
      name: req.body.name,
      rating: req.body.rating,
      experience: req.body.experience
    });

    await feedback.save();

    res.json({ message: "Feedback submitted successfully!" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

