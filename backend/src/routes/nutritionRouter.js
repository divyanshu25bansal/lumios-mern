import express from "express";
import { getDayKey } from "../utils/getDate.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import {
  getOrCreateToday,
  getLastNDays,
  addMeal,
  removeMeal,
} from "../services/nutritionService.js";

const nutritionRouter = express.Router();

// GET: today's summary document (auto-creates an empty one if missing)
nutritionRouter.get("/nutrition", verifyAuth, async (req, res) => {
  try {
    const today = getDayKey(req.user.timezone);
    const nutrition = await getOrCreateToday(req.user._id, today);
    res.status(200).send(nutrition);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

// GET: last 7 daily documents, most recent first (for weekly trend charts)
nutritionRouter.get("/nutrition/last-7-days", verifyAuth, async (req, res) => {
  try {
    const history = await getLastNDays(req.user._id, 7);
    res.status(200).send(history);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

// POST: append a meal to today's document, creating it first if this is the day's first meal
nutritionRouter.post("/nutrition/meal-create", verifyAuth, async (req, res) => {
  try {
    const today = getDayKey(req.user.timezone);
    const { mealName, mealType, calories, protein, carbs, fats } = req.body;

    if (!mealName || !mealType) {
      return res.status(400).send({
        success: false,
        message: "Meal Name and Meal Type are required to log an entry.",
      });
    }

    const updatedNutrition = await addMeal(req.user._id, today, {
      mealName,
      mealType,
      calories,
      protein,
      carbs,
      fats,
    });

    res.status(200).send(updatedNutrition);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

// DELETE: remove a single meal from today's document and roll back its totals
nutritionRouter.delete("/nutrition/meal/:mealId", verifyAuth, async (req, res) => {
  try {
    const today = getDayKey(req.user.timezone);
    const updatedNutrition = await removeMeal(req.user._id, today, req.params.mealId);

    if (!updatedNutrition) {
      return res.status(404).send({
        success: false,
        message: "Meal not found in today's log.",
      });
    }

    res.status(200).send(updatedNutrition);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

export default nutritionRouter;
