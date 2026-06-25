import express from "express";
import { getDayKey } from "../utils/getDate.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import DailyNutrition from "../models/nutrition.js";

const nutritionRouter = express.Router();

// GET: Fetch today's single summary document (Initializes a clean document if missing)
nutritionRouter.get("/nutrition", verifyAuth, async (req, res) => {
  try {
    const today = getDayKey(req.user.timezone);

    let nutrition = await DailyNutrition.findOne({
      userId: req.user._id,
      dayKey: today
    });

    // If it doesn't exist yet, we create a completely empty base layout
    if (!nutrition) {
      nutrition = new DailyNutrition({
        userId: req.user._id,
        dayKey: today,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        meals: [] // Enforces absolute empty array initialization
      });
      await nutrition.save();
    }

    res.status(200).send(nutrition);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

// POST: Explicitly add a new meal item (Only logs exactly what the user sent)
nutritionRouter.post("/nutrition", verifyAuth, async (req, res) => {
  try {
    const today = getDayKey(req.user.timezone);
    const { mealName, mealType, calories, protein, carbs, fats } = req.body;

    // Guard Clause: Prevent creating phantom blank meals if name/type are completely omitted
    if (!mealName || !mealType) {
      return res.status(400).send({
        success: false,
        message: "Meal Name and Meal Type are required to log an entry."
      });
    }

    // Safely parse number parameters to prevent NaN pollution
    const parsedCalories = Number(calories) || 0;
    const parsedProtein = Number(protein) || 0;
    const parsedCarbs = Number(carbs) || 0;
    const parsedFats = Number(fats) || 0;

    const updatedNutrition = await DailyNutrition.findOneAndUpdate(
      {
        userId: req.user._id,
        dayKey: today
      },
      {
        // 1. Appends ONLY the genuine meal details input by the client
        $push: {
          meals: {
            mealName,
            mealType,
            calories: parsedCalories,
            protein: parsedProtein,
            carbs: parsedCarbs,
            fats: parsedFats
          }
        },
        // 2. Increments the daily metrics using clean numerical numbers
        $inc: {
          totalCalories: parsedCalories,
          totalProtein: parsedProtein,
          totalCarbs: parsedCarbs,
          totalFats: parsedFats
        }
      },
      {
        upsert: true, // Safety fallback layer if initialized out-of-order
        returnDocument: "after", // Replaces older deprecated returnDocument variants 
        runValidators: true
      }
    );

    res.status(200).send(updatedNutrition);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

nutritionRouter.patch("/nutrition/meal-create", verifyAuth, async (req, res) => {
  res.send("nutrition patch");
});

nutritionRouter.delete("/nutrition/:id", verifyAuth, async (req, res) => {
  res.send("nutrition delete");
});

export default nutritionRouter;