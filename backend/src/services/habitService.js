import Habit from "../models/habits.js";
import { getDayKey, parseDayKey, diffInDays } from "../utils/getDate.js";

// Shared by habitsRouter (PATCH /habit/:id) and the AI assistant's complete_habit tool,
// so streak math can never drift between the two entry points.
export async function completeHabit(userId, habitId, timezone) {
  const habit = await Habit.findOne({ userId, _id: habitId });
  if (!habit) return null;

  const today = getDayKey(timezone);
  if (habit.lastCompletedDate === today) {
    return habit;
  }

  let newCurrentStreak = 1;
  if (habit.lastCompletedDate) {
    const gapDays = diffInDays(parseDayKey(today), parseDayKey(habit.lastCompletedDate));
    newCurrentStreak = gapDays === 1 ? habit.currentStreak + 1 : 1;
  }
  const newMaxStreak = Math.max(habit.maxStreak, newCurrentStreak);

  return Habit.findOneAndUpdate(
    { userId, _id: habitId },
    {
      $set: {
        lastCompletedDate: today,
        currentStreak: newCurrentStreak,
        maxStreak: newMaxStreak,
      },
    },
    { new: true },
  );
}

export async function uncompleteHabit(userId, habitId, timezone) {
  const habit = await Habit.findOne({ userId, _id: habitId });
  if (!habit) return null;

  const today = getDayKey(timezone);
  if (habit.lastCompletedDate !== today) {
    return habit;
  }

  return Habit.findOneAndUpdate(
    { userId, _id: habitId },
    {
      $set: {
        lastCompletedDate: null,
        currentStreak: Math.max(habit.currentStreak - 1, 0),
      },
    },
    { new: true },
  );
}

// Lazily resets currentStreak to 0 for habits whose streak broke (>1 day gap)
// since the last completion, and persists that correction. Used by GET /habits
// and by the assistant whenever it needs an accurate view of the user's habits.
export async function getHabitsWithFreshStreaks(userId, timezone) {
  const habits = await Habit.find({ userId });
  const today = getDayKey(timezone);

  return Promise.all(
    habits.map(async (habit) => {
      if (habit.lastCompletedDate && habit.lastCompletedDate !== today) {
        const gapDays = diffInDays(parseDayKey(today), parseDayKey(habit.lastCompletedDate));
        if (gapDays > 1 && habit.currentStreak !== 0) {
          habit.currentStreak = 0;
          await Habit.updateOne({ _id: habit._id }, { $set: { currentStreak: 0 } });
        }
      }
      return habit;
    }),
  );
}

export async function createHabit(userId, { title, duration, habitTime }) {
  return Habit.create({
    userId,
    title,
    duration,
    habitTime,
    currentStreak: 0,
    maxStreak: 0,
    lastCompletedDate: null,
  });
}
