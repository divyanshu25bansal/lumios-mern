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
  },
  {
    timestamps: true,
  }
);

const Hydration = mongoose.model("Hydration", hydrationSchema);

export default Hydration;