import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// POST: Save contact message
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

export default router;
