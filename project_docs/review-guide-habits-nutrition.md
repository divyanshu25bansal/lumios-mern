# Review Guide: Habits, Nutrition & AI Companion (Aurora) Changes

This is a **reading order**, not a feature explanation (see `feature-flow-habits-nutrition.md` for that).
Read the files in this order and each one will make sense using only what came before it.

There are three parts: habit streaks, nutrition/Gemini macro estimation, and the AI companion
(Aurora) that sits on top of both of them plus hydration and sleep.

---

## Part 1 — Habit Streaks

### 1. `backend/src/utils/getDate.js`
Start here. This file defines the date primitives everything else depends on:

- `getDayKey(timezone)` — already existed. Converts "now" into a `"YYYY/MM/DD"` string in the user's timezone.
- `parseDayKey(dayKey)` — **new**. Turns that string back into a JS `Date`.
- `diffInDays(laterDate, earlierDate)` — **new**. Whole-day difference between two dates.

These three functions are the only tool the streak logic uses to answer "was this consecutive?".

### 2. `backend/src/models/habits.js`
Not changed, but read it for context. Note the three fields that matter:
`lastCompletedDate` (string day-key or `null`), `currentStreak`, `maxStreak`.

### 3. `backend/src/services/habitService.js` + `backend/src/routes/habitsRouter.js`
The core of the streak logic now lives in the service, and the router just calls it:

- `completeHabit(userId, habitId, timezone)` — the actual "complete" click. Computes
  `currentStreak`/`maxStreak` using `parseDayKey`/`diffInDays` from step 1.
- `uncompleteHabit(userId, habitId, timezone)` — undoes today's completion.
- `getHabitsWithFreshStreaks(userId, timezone)` — handles the case where the user comes back after
  **missing a day** without clicking anything. Lazily detects a broken streak and resets
  `currentStreak` to `0`.
- `createHabit(userId, { title, duration, habitTime })` — creates a new habit doc.

`habitsRouter.js`'s `PATCH /habit/:id`, `GET /habits`, and `POST /habit/create` routes are now thin
wrappers around these four functions. The reason they were pulled out of the router: the AI
companion (Part 3) needs to run the exact same completion logic when the user says "mark X done" in
chat, and duplicating the streak math in two places would risk them drifting apart.

### 4. `frontend/src/pages/Habits.jsx`
Look at `handleCompleteHabit`. It now sends `job: "complete"` or `job: "uncomplete"` depending on
whether today is already marked done, and — important — it overwrites local state with the
**server's response** rather than trusting its own optimistic guess, because only the server knows
the real computed streak.

---

## Part 2 — Nutrition & Gemini

### 5. `backend/src/models/nutrition.js`
One document per user per day (same pattern as `sleep.js` / `hydration.js`). The only change here
is a bug fix: the unique index was written against a field (`dateString`) that doesn't exist on the
schema — it should be `dayKey`. Without this fix, nothing actually stopped duplicate daily documents.

### 6. `backend/src/services/nutritionService.js` + `backend/src/routes/nutritionRouter.js`
Same split as habits: the router matches the `sleepRouter.js` / `hydrationRouter.js` layout, and
delegates to the service. Four operations, read top to bottom:

- `getOrCreateToday(userId, dayKey)` — today's document (auto-created if it doesn't exist yet). Used by `GET /nutrition`.
- `getLastNDays(userId, n)` — the last N daily documents, for the weekly chart. Used by `GET /nutrition/last-7-days`.
- `addMeal(userId, dayKey, meal)` — appends one meal and increments the day's running totals. Used by `POST /nutrition/meal-create`.
- `removeMeal(userId, dayKey, mealId)` — removes one meal and rolls back the totals. Used by `DELETE /nutrition/meal/:mealId`.

Same reason as habits: Aurora's `log_meal` tool (Part 3) calls `addMeal` directly, so a meal logged
via chat and a meal logged via the "Add Meal" modal go through identical code.

### 7. `backend/src/routes/gemini_services.js`
The AI macro estimator. This file existed but was broken (wrong model id, and it never sent a
response body back to the client). Now it calls Gemini with a `responseSchema` that forces the
model to return strict JSON: `{ foodName, calories, protein, carbs, fats }`.

### 8. `frontend/src/pages/Nutrition.jsx`
This is where steps 6 and 7 get connected. Read `createMeal` — it calls `/gemini-response` first to
get estimated macros, then calls `/nutrition/meal-create` with those macros to actually persist the
meal. Also note `getWeeklyTrends`, which feeds the trend chart from real data instead of the
previous hardcoded mock array.

### 9. `backend/src/app.js` (context only, not changed by us)
Confirms `gemini_router` and `nutritionRouter` are both mounted at `/`, so their routes are
reachable at `/nutrition`, `/nutrition/meal-create`, `/gemini-response`, etc.

---

## Part 3 — AI Companion (Aurora)

Aurora is a chat assistant that can read and write the user's real data across all four trackers by
calling backend "tools" (Gemini's function-calling feature). Read in this order:

### 10. `backend/src/services/hydrationService.js` and `sleepService.js`
Two small new files, read together. Unlike the habit/nutrition services, these weren't extracted
from an existing router — `hydrationRouter.js` and `sleepRouter.js` are untouched. They exist purely
so Aurora can log water/sleep from a single chat message:

- `hydrationService.logWater(userId, dayKey, amountMl)` — **upserts**. If today's hydration doc
  doesn't exist yet, it creates one with a default 2000ml target instead of requiring a separate
  "create" step the way the Hydration page's UI does.
- `sleepService.logSleep(userId, dayKey, duration, quality)` — same idea, upserts today's sleep entry.

### 11. `backend/src/services/assistantTools.js`
This is the heart of the feature. Two things live here:

- `toolDeclarations` — an array of 8 tool definitions (`get_overview`, `list_habits`,
  `create_habit`, `complete_habit`, `log_water`, `log_sleep`, `log_meal`, `get_weekly_summary`),
  each with a JSON Schema describing its parameters. This is what gets handed to Gemini so it knows
  what it's allowed to call.
- `executeTool(name, args, user)` — the dispatcher. When Gemini decides to call a tool, this is what
  actually runs, calling into `habitService` / `nutritionService` / `hydrationService` /
  `sleepService` from steps 3, 6, and 10. Notice there are **no delete or edit tools** — Aurora can
  only read and create/log, so a misfired chat message can't destroy data.

### 12. `backend/src/routes/assistantRouter.js`
`POST /assistant/chat`. Read the loop inside the route handler:

1. Sends the user's message (plus prior `history`) to Gemini with the tool declarations from step 11.
2. If Gemini's response contains `functionCalls`, runs each one through `executeTool` and feeds the
   results back to Gemini as `functionResponse` parts.
3. Repeats until Gemini replies with plain text instead of more function calls (capped at
   `MAX_TOOL_ROUNDS = 5` as a safety net).
4. Returns `{ reply, toolCalls, history }` — `history` is the full conversation transcript so far,
   which the frontend stores and sends back on the next message to keep context (including what
   tools were already called) without needing a database-backed chat history.

### 13. `frontend/src/pages/Companion.jsx`
The chat UI, mounted at `/companion` (a route the sidebar already linked to, but which didn't exist
yet). Read `sendMessage`: it pushes the user's text into the visible `messages` list, POSTs to
`/assistant/chat` with the current `chatHistory`, then updates both `messages` (to show Aurora's
reply, plus small badges naming any tools that fired) and `chatHistory` (Gemini's returned
`history`, so the next message continues the same conversation).

---

## Quick file map

| File | What changed |
|---|---|
| `backend/src/utils/getDate.js` | Added `parseDayKey`, `diffInDays` |
| `backend/src/services/habitService.js` | **New.** Streak logic extracted so the router and Aurora share it |
| `backend/src/routes/habitsRouter.js` | Now delegates to `habitService`; behavior unchanged (real streaks + lazy reset) |
| `frontend/src/pages/Habits.jsx` | Sends `complete`/`uncomplete`; syncs UI from server response |
| `backend/src/models/nutrition.js` | Fixed unique index field name |
| `backend/src/services/nutritionService.js` | **New.** Meal/day logic extracted so the router and Aurora share it |
| `backend/src/routes/nutritionRouter.js` | Now delegates to `nutritionService`; behavior unchanged (today / weekly / create-meal / delete-meal) |
| `backend/src/routes/gemini_services.js` | Fixed model id, added structured JSON output, actually sends a response |
| `frontend/src/pages/Nutrition.jsx` | Wired Gemini → meal-create → UI; real weekly chart; removed dead state |
| `backend/src/services/hydrationService.js` | **New.** Upsert-based `logWater`, for Aurora only |
| `backend/src/services/sleepService.js` | **New.** Upsert-based `logSleep`, for Aurora only |
| `backend/src/services/assistantTools.js` | **New.** Aurora's 8 tool declarations + the dispatcher that executes them |
| `backend/src/routes/assistantRouter.js` | **New.** `POST /assistant/chat` — the Gemini tool-calling loop |
| `backend/src/app.js` | Mounted `assistantRouter` |
| `frontend/src/pages/Companion.jsx` | **New.** Chat UI at `/companion` |
| `frontend/src/routes/AuthLoader.jsx` | Registered the `/companion` route |
