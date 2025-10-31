import { Request, Response } from "express";
import { Task } from "../models/task";

interface AuthRequest extends Request {
  user?: any;
}

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      user: req.user.id,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};
    console.log(filter);
    const { priority, isCompleted, isImportant, sortBy } = req.query;

    if (priority) filter.priority = priority;
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === "true";
    if (isImportant !== undefined) filter.isImportant = isImportant === "true";

    let sortOption: any = {};
    switch (sortBy) {
      case "dueDate":
        sortOption = { dueDate: 1 };
        break;
      case "priority":
        sortOption = { priority: -1 };
        break;
      case "createdAt":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { updatedAt: -1 };
        break;
    }

    const tasks = await Task.find(filter)
      .populate("user", "name email")
      .sort(sortOption);

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!req.user.isAdmin && task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!req.user.isAdmin && task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};

export const markImportant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.isImportant = !task.isImportant;
    await task.save();

    res.status(200).json({
      message: `Task marked as ${task.isImportant ? "important" : "not important"}`,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark task", error });
  }
};

export const markCompleted = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!req.user.isAdmin && task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    res.status(200).json({
      message: `Task marked as ${task.isCompleted ? "completed" : "incomplete"}`,
      task,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mark task as completed", error });
  }
};
