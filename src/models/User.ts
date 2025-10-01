import mongoose from "mongoose";

// User schema - stores information about the user
const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true },
    username: String,
    email: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
