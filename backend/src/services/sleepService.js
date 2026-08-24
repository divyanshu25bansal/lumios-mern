import Sleep from "../models/sleep.js";

export async function getToday(userId, dayKey) {
  return Sleep.findOne({ userId, dayKey });
}

export async function getLastNDays(userId, n = 7) {
  return Sleep.find({ userId }).sort({ dayKey: -1 }).limit(n);
}

// Used by the AI assistant's log_sleep tool: logging sleep via chat should work
// whether or not today's entry already exists, so this upserts.
export async function logSleep(userId, dayKey, duration, quality) {
  const update = { duration, sleepLogged: true };
  if (quality !== undefined && quality !== null) {
    update.quality = quality;
  }

  return Sleep.findOneAndUpdate(
    { userId, dayKey },
    { $set: update },
    { upsert: true, new: true, runValidators: true },
  );
}
