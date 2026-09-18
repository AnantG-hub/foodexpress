import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
  orderId: String,
  customerName: String,
  customerId: String,
  items: Array,
  total: Number,
  paymentMethod: String,
  status: { type: String, default: "Placed" }
},
{ timestamps: true }
);

export default mongoose.models.Order ||
       mongoose.model("Order", orderSchema);
