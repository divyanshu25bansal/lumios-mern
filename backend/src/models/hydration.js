import mongoose from "mongoose";

const hydrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    target: {
      type: Number,
      required: true,
      min: 0,
    },

    consumed: {
      type: Number,
      default: 0,
      min: 0,
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
  }
);

hydrationSchema.index(
  { userId: 1, dayKey: 1 },
  { unique: true }
);


const Hydration = mongoose.model("Hydration", hydrationSchema);

export default Hydration;