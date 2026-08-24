import Habit from "../models/habits.js";
import { getDayKey } from "../utils/getDate.js";
import {
  completeHabit,
  createHabit,
  getHabitsWithFreshStreaks,
} from "./habitService.js";
import { getOrCreateToday, getLastNDays as getNutritionHistory, addMeal } from "./nutritionService.js";
import { getToday as getTodayHydration, getLastNDays as getHydrationHistory, logWater } from "./hydrationService.js";
import { getToday as getTodaySleep, getLastNDays as getSleepHistory, logSleep } from "./sleepService.js";

// Every tool the assistant is allowed to call. Deliberately read/create-only —
// no delete or edit tools, so a misfired chat message can't destroy user data.
export const toolDeclarations = [
  {
    name: "get_overview",
    description:
      "Get the user's full picture for today: habits with streaks, hydration progress, sleep, and nutrition totals. Use this whenever the user asks a general question about how they're doing.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
  {
    name: "list_habits",
    description: "List all of the user's habits with their current/max streaks and whether each was completed today.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
  {
    name: "create_habit",
    description: "Create a new habit for the user to track.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short name of the habit, e.g. 'Morning walk'." },
        duration: { type: "string", description: "How long/how much, e.g. '30 minutes' or '2 litres'." },
        habitTime: { type: "string", enum: ["morning", "afternoon", "night"] },
      },
      required: ["title", "duration", "habitTime"],
    },
  },
  {
    name: "complete_habit",
    description: "Mark one of the user's existing habits as completed for today, updating its streak.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "The habit's title, or a close match to it." },
      },
      required: ["title"],
    },
  },
  {
    name: "log_water",
    description: "Log water the user drank today.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        amountMl: { type: "number", description: "Amount of water in millilitres." },
      },
      required: ["amountMl"],
    },
  },
  {
    name: "log_sleep",
    description: "Log or update how much the user slept last night.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        durationHours: { type: "number", description: "Hours slept." },
        quality: { type: "number", description: "Optional sleep quality rating from 1 (poor) to 5 (excellent)." },
      },
      required: ["durationHours"],
    },
  },
  {
    name: "log_meal",
    description:
      "Log a meal the user ate today. Estimate realistic macro values yourself from the meal description, the way a nutrition calculator would, before calling this tool.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        mealName: { type: "string" },
        mealType: { type: "string", enum: ["Breakfast", "Lunch", "Dinner", "Snack"] },
        calories: { type: "number" },
        protein: { type: "number", description: "Grams of protein." },
        carbs: { type: "number", description: "Grams of carbohydrates." },
        fats: { type: "number", description: "Grams of fat." },
      },
      required: ["mealName", "mealType", "calories", "protein", "carbs", "fats"],
    },
  },
  {
    name: "get_weekly_summary",
    description: "Get the user's last 7 days of hydration, sleep, and nutrition history, for questions about trends over the week.",
    parametersJsonSchema: { type: "object", properties: {} },
  },
];

async function handleGetOverview(user) {
  const today = getDayKey(user.timezone);

  const [habits, hydration, sleep, nutrition] = await Promise.all([
    getHabitsWithFreshStreaks(user._id, user.timezone),
    getTodayHydration(user._id, today),
    getTodaySleep(user._id, today),
    getOrCreateToday(user._id, today),
  ]);

  return {
    date: today,
    profileGoal: user.goal || null,
    habits: habits.map((h) => ({
      title: h.title,
      habitTime: h.habitTime,
      currentStreak: h.currentStreak,
      maxStreak: h.maxStreak,
      completedToday: h.lastCompletedDate === today,
    })),
    hydration: hydration
      ? { consumedMl: hydration.consumed, targetMl: hydration.target }
      : { message: "No water logged yet today." },
    sleep: sleep
      ? { durationHours: sleep.duration, quality: sleep.quality ?? null }
      : { message: "No sleep logged yet today." },
    nutrition: {
      totalCalories: nutrition.totalCalories,
      totalProtein: nutrition.totalProtein,
      totalCarbs: nutrition.totalCarbs,
      totalFats: nutrition.totalFats,
      mealsLoggedToday: nutrition.meals.length,
    },
  };
}

async function handleListHabits(user) {
  const today = getDayKey(user.timezone);
  const habits = await getHabitsWithFreshStreaks(user._id, user.timezone);
  return habits.map((h) => ({
    title: h.title,
    habitTime: h.habitTime,
    duration: h.duration,
    currentStreak: h.currentStreak,
    maxStreak: h.maxStreak,
    completedToday: h.lastCompletedDate === today,
  }));
}

async function handleCreateHabit(user, args) {
  const habit = await createHabit(user._id, args);
  return {
    title: habit.title,
    habitTime: habit.habitTime,
    duration: habit.duration,
    currentStreak: habit.currentStreak,
  };
}

async function handleCompleteHabit(user, { title }) {
  const habits = await Habit.find({ userId: user._id });
  const needle = title.trim().toLowerCase();
  const matches = habits.filter((h) => h.title.toLowerCase().includes(needle));

  if (matches.length === 0) {
    return { error: `No habit found matching "${title}".` };
  }
  if (matches.length > 1) {
    return {
      error: `Multiple habits match "${title}", ask the user to be more specific.`,
      matches: matches.map((h) => h.title),
    };
  }

  const updated = await completeHabit(user._id, matches[0]._id, user.timezone);
  return {
    title: updated.title,
    currentStreak: updated.currentStreak,
    maxStreak: updated.maxStreak,
  };
}

async function handleLogWater(user, { amountMl }) {
  if (!amountMl || amountMl <= 0) {
    return { error: "amountMl must be a positive number." };
  }
  const today = getDayKey(user.timezone);
  const hydration = await logWater(user._id, today, amountMl);
  return { consumedMl: hydration.consumed, targetMl: hydration.target };
}

async function handleLogSleep(user, { durationHours, quality }) {
  if (!durationHours || durationHours <= 0) {
    return { error: "durationHours must be a positive number." };
  }
  const today = getDayKey(user.timezone);
  const sleep = await logSleep(user._id, today, durationHours, quality);
  return { durationHours: sleep.duration, quality: sleep.quality ?? null };
}

async function handleLogMeal(user, args) {
  const today = getDayKey(user.timezone);
  const nutrition = await addMeal(user._id, today, args);
  return {
    totalCalories: nutrition.totalCalories,
    totalProtein: nutrition.totalProtein,
    totalCarbs: nutrition.totalCarbs,
    totalFats: nutrition.totalFats,
    mealsLoggedToday: nutrition.meals.length,
  };
}

async function handleGetWeeklySummary(user) {
  const [hydration, sleep, nutrition] = await Promise.all([
    getHydrationHistory(user._id, 7),
    getSleepHistory(user._id, 7),
    getNutritionHistory(user._id, 7),
  ]);

  return {
    hydration: hydration.map((d) => ({ dayKey: d.dayKey, consumedMl: d.consumed, targetMl: d.target })),
    sleep: sleep.map((d) => ({ dayKey: d.dayKey, durationHours: d.duration, quality: d.quality ?? null })),
    nutrition: nutrition.map((d) => ({ dayKey: d.dayKey, totalCalories: d.totalCalories })),
  };
}

const handlers = {
  get_overview: handleGetOverview,
  list_habits: handleListHabits,
  create_habit: handleCreateHabit,
  complete_habit: handleCompleteHabit,
  log_water: handleLogWater,
  log_sleep: handleLogSleep,
  log_meal: handleLogMeal,
  get_weekly_summary: handleGetWeeklySummary,
};

export async function executeTool(name, args, user) {
  const handler = handlers[name];
  if (!handler) {
    return { error: `Unknown tool "${name}".` };
  }

  try {
    return await handler(user, args || {});
  } catch (err) {
    return { error: err.message };
  }
}
