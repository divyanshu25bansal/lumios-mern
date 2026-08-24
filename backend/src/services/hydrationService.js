import Hydration from "../models/hydration.js";

const DEFAULT_TARGET_ML = 2000;

export async function getToday(userId, dayKey) {
  return Hydration.findOne({ userId, dayKey });
}

export async function getLastNDays(userId, n = 7) {
  return Hydration.find({ userId }).sort({ dayKey: -1 }).limit(n);
}

// Used by the AI assistant's log_water tool: logging water via chat should work
// on the very first message of the day too, so this upserts instead of requiring
// a separate "create" step like the Hydration page's UI does.
export async function logWater(userId, dayKey, amountMl) {
  const existing = await Hydration.findOne({ userId, dayKey });
  if (!existing) {
    return Hydration.create({
      userId,
      dayKey,
      target: DEFAULT_TARGET_ML,
      consumed: amountMl,
    });
  }

  return Hydration.findOneAndUpdate(
    { userId, dayKey },
    { $inc: { consumed: amountMl } },
    { new: true },
  );
}
