import DailyNutrition from "../models/nutrition.js";

export async function getOrCreateToday(userId, dayKey) {
  let nutrition = await DailyNutrition.findOne({ userId, dayKey });
  if (!nutrition) {
    nutrition = await DailyNutrition.create({ userId, dayKey });
  }
  return nutrition;
}

export async function getLastNDays(userId, n = 7) {
  return DailyNutrition.find({ userId }).sort({ dayKey: -1 }).limit(n);
}

// Shared by nutritionRouter (POST /nutrition/meal-create) and the AI assistant's
// log_meal tool, so a meal is logged (and totals updated) the same way everywhere.
export async function addMeal(userId, dayKey, { mealName, mealType, calories, protein, carbs, fats }) {
  const parsedCalories = Number(calories) || 0;
  const parsedProtein = Number(protein) || 0;
  const parsedCarbs = Number(carbs) || 0;
  const parsedFats = Number(fats) || 0;

  return DailyNutrition.findOneAndUpdate(
    { userId, dayKey },
    {
      $push: {
        meals: {
          mealName,
          mealType,
          calories: parsedCalories,
          protein: parsedProtein,
          carbs: parsedCarbs,
          fats: parsedFats,
        },
      },
      $inc: {
        totalCalories: parsedCalories,
        totalProtein: parsedProtein,
        totalCarbs: parsedCarbs,
        totalFats: parsedFats,
      },
    },
    { upsert: true, new: true, runValidators: true },
  );
}

export async function removeMeal(userId, dayKey, mealId) {
  const nutrition = await DailyNutrition.findOne({ userId, dayKey });
  if (!nutrition) return null;

  const meal = nutrition.meals.find((m) => m._id.toString() === mealId);
  if (!meal) return null;

  return DailyNutrition.findOneAndUpdate(
    { userId, dayKey },
    {
      $pull: { meals: { _id: meal._id } },
      $inc: {
        totalCalories: -meal.calories,
        totalProtein: -meal.protein,
        totalCarbs: -meal.carbs,
        totalFats: -meal.fats,
      },
    },
    { new: true },
  );
}
