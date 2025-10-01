import mongoose from "mongoose";
import { CONFIG, logger } from "../config";

// Connect to MongoDB
export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(CONFIG.MONGODB_URI);
  logger.info("MongoDB connected");
}
