import mongoose from "mongoose";

const sleepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 0,
    },

    sleepLogged: {
      type: Boolean,
    },

    quality: {
      type: Number,
      // required: true,
      min: 1,
      max: 5,
    },

    bedtime: {
      type: Date,
      // required: true,
    },

    wakeupTime: {
      type: Date,
      // required: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    dayKey: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

sleepSchema.index(
  { userId: 1, daykey: 1 },
  { unique: true }
)

const Sleep = mongoose.model("Sleep", sleepSchema);

export default Sleep;
