import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const URI = process.env.MONGO_URI as string;

export const dbConnection = async (): Promise<void> => {
  try {
    if (!URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    console.log("🟡 Connecting to MongoDB...");
    await mongoose.connect(URI);
    console.log("🟢 MongoDB connected successfully");
  } catch (error) {
    console.error("🔴 MongoDB connection failed:", (error as Error).message);
    process.exit(1);
  }
};
