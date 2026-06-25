import mongoose from "mongoose";

// Sub-schema for individual meals
const mealSchema = new mongoose.Schema({
  mealName: {
    type: String,
    required: true,
    trim: true,
  },
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack"], // Aligned with your frontend UI select options
    required: true,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
  protein: {
    type: Number,
    default: 0,
    min: 0,
  },
  carbs: {
    type: Number,
    default: 0,
    min: 0,
  },
  fats: {
    type: Number,
    default: 0,
    min: 0,
  },
  timeLogged: {
    type: Date,
    default: Date.now,
  }
});

// Main schema: One document per user per day
const dailyNutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Stored as a string format (YYYY-MM-DD) to easily enforce uniqueness per day per user
    dayKey: {
      type: String,
      required: true,
    },
    // Running running totals for the day
    totalCalories: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCarbs: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalFats: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Array containing each individual meal item
    meals: [mealSchema],
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Compound index ensuring a user can only have ONE document per specific day string
dailyNutritionSchema.index({ userId: 1, dateString: 1 }, { unique: true });

const DailyNutrition = mongoose.model("DailyNutrition", dailyNutritionSchema);

export default DailyNutrition;