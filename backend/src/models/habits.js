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

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    habitTime: {
      type: String,
      required: true,
      trim: true,
      enum: ["morning", "afternoon", "night"]
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
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
