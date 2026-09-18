import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String
}, { timestamps: true });

export default mongoose.model("Food", FoodSchema);


