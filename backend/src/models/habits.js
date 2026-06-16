import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastCompletedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
