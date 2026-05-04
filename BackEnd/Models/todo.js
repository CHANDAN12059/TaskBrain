import { text } from "express";
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = new mongoose.model("Todo", todoSchema);

export default Todo;
