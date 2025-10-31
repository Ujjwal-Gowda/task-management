import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  user: mongoose.Schema.Types.ObjectId;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  isCompleted: boolean;
  isImportant: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isCompleted: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
