import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Forgot Password fields
  resetOtp: { type: Number },
  resetOtpExpire: { type: Date }
});

export default mongoose.model("User", userSchema);
