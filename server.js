import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// ROUTES
import ordersRouter from "./routes/order.js";
import paymentRouter from "./routes/payment.js";
import authRouter from "./routes/auth.js";
import feedbackRouter from "./routes/feedback.js";
import foodRouter from "./routes/food.js"; 
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
const app = express();

// HTTP Server
const server = http.createServer(app);

// Socket.io Setup
const io = new IOServer(server, { cors: { origin: "*" } });
app.set("io", io);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// 🔹 Static folder for uploaded images
app.use("/uploads", express.static("uploads"));

app.use("/images", express.static("public/images")); // optional, for existing CSS images

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
app.use("/api/orders", ordersRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/auth", authRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/food", foodRouter); // food routes with multer
app.use("/api", contactRoutes);
// Root
app.get("/", (req, res) => res.send("FoodieExpress API Running"));

// Socket.io Events
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinOrder", (orderId) => socket.join(orderId));

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// PORT
const DEFAULT_PORT = process.env.PORT ? Number(process.env.PORT) : 5006;

// Start server with auto port increment
function startServer(port) {
  server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`⚠️ Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

// Start
startServer(DEFAULT_PORT);

export default app;
