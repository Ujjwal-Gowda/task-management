import express from "express";
import { protect, adminOnly } from "../middleware/authmiddleware";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markImportant,
  markCompleted,
} from "../controllers/taskcontroller";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, adminOnly, deleteTask);

router.put("/:id/important", protect, adminOnly, markImportant);

router.put("/:id/completed", protect, markCompleted);
export default router;
