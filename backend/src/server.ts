import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import { dbConnection } from "./db/connection";
import taskRoutes from "./routes/taskroutes";
import authRoutes from "./routes/authroutes";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
const startServer = async () => {
  try {
    await dbConnection();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};
startServer();
