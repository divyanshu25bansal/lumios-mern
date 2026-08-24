# Feature Flow: Habits, Nutrition & AI Companion (Aurora)

This explains **what happens, end to end**, when a user interacts with these features.
For "which file to read in what order", see `review-guide-habits-nutrition.md`.

---

## 1. Habit Streaks

### Data model
Each habit document (`backend/src/models/habits.js`) stores:
- `lastCompletedDate` — a `"YYYY/MM/DD"` string, or `null` if never completed.
- `currentStreak` — consecutive days completed, ending at `lastCompletedDate`.
- `maxStreak` — the highest `currentStreak` ever reached (never decreases).

### Flow A — user clicks a habit to mark it complete
1. **Frontend** (`Habits.jsx` → `handleCompleteHabit`): checks if `habit.lastCompletedDate` equals
   today. Since it doesn't, this is a "complete" action. It optimistically flips the checkbox in the
   UI, then sends `PATCH /habit/:id` with `{ job: "complete" }`.
2. **Backend** (`habitsRouter.js`): loads the habit, computes `today` via `getDayKey`.
   - If `lastCompletedDate` was already today → no-op (idempotent).
   - If `lastCompletedDate` is `null` (first ever completion) → `currentStreak = 1`.
   - Otherwise, compute the gap in days between today and `lastCompletedDate` using `diffInDays`:
     - gap `=== 1` (completed yesterday) → `currentStreak = currentStreak + 1`.
     - gap `> 1` (streak was broken) → `currentStreak` resets to `1`.
   - `maxStreak = max(maxStreak, newCurrentStreak)`.
   - Saves `lastCompletedDate = today`, `currentStreak`, `maxStreak` to the DB.
3. **Backend → Frontend**: returns the updated habit document.
4. **Frontend**: overwrites that habit in local state with the server's response, so the
   "Current Streak" / "Max Streak" numbers shown in the expanded card are the real computed values,
   not just the optimistic guess.

### Flow B — user clicks an already-completed habit to undo it
1. **Frontend**: detects `lastCompletedDate === today`, sends `{ job: "uncomplete" }` instead.
2. **Backend**: only reverts if `lastCompletedDate` is still today (safety check) — sets
   `lastCompletedDate = null` and `currentStreak = max(currentStreak - 1, 0)`. `maxStreak` is left
   untouched, since it's a historical record of the best streak ever, not the current one.

### Flow C — user simply opens the Habits page after missing a day (no click at all)
This is the case that a naive "update on complete only" implementation misses: if you skip a day and
never click anything, the stored `currentStreak` would stay stale forever (still showing the old
number) until the next completion.

1. **Frontend**: calls `GET /habits` on page load.
2. **Backend**: for each habit, if `lastCompletedDate` is not `null` and not today, it checks the gap
   via `diffInDays`. If the gap is more than 1 day, the streak is broken — the response (and the DB
   record) get `currentStreak` corrected to `0` right there, without waiting for the user to click
   "complete" again.
3. **Frontend**: renders the corrected `0`.

This means `currentStreak` is always accurate whether the user actively completes something or just
comes back and looks at the page.

---

## 2. Nutrition & Gemini (AI macro estimation)

### Data model
`backend/src/models/nutrition.js` — one `DailyNutrition` document per user per day (`dayKey`), each
holding `totalCalories/Protein/Carbs/Fats` running totals and an embedded `meals[]` array. A unique
index on `(userId, dayKey)` guarantees only one document per day.

### Flow A — page load
1. **Frontend** (`Nutrition.jsx`, on mount): fires two requests in parallel:
   - `GET /nutrition` → today's document (auto-created empty if this is the first visit today).
     Populates the macro rings (`currentIntake`) and the "Recent Meals" list.
   - `GET /nutrition/last-7-days` → the last 7 daily documents, newest first. The frontend reverses
     them to chronological order and turns each `dayKey` into a weekday label (`Mon`, `Tue`, ...) for
     the trend chart, computing each bar's height as `totalCalories / goals.calories`.

### Flow B — user adds a meal
This is the interesting one — it's a two-hop request, not one:

1. **User** types a meal name (e.g. `"2 boiled eggs and toast"`) and picks a meal type, then submits.
2. **Frontend → Backend hop 1**: `POST /gemini-response` with `{ mealName }`.
   - **Backend** (`gemini_services.js`) calls the Gemini API (`gemini-2.5-flash`) with a
     `responseSchema` that forces the model to answer in strict JSON:
     `{ foodName, calories, protein, carbs, fats }`. This is Gemini's *estimate* based on the meal
     description — not a lookup against a verified nutrition database.
   - Returns `{ success: true, data: { calories, protein, carbs, fats, foodName } }`.
3. **Frontend → Backend hop 2**: takes those estimated macros and calls
   `POST /nutrition/meal-create` with `{ mealName, mealType, calories, protein, carbs, fats }`.
   - **Backend** (`nutritionRouter.js`) pushes a new entry into today's `meals[]` array and
     increments the day's running totals (`$inc`), upserting the day's document if this is the
     first meal logged today.
   - Returns the full updated `DailyNutrition` document.
4. **Frontend**: replaces `meals` and `currentIntake` from that response, refreshes the weekly
   trend chart, clears the form, and closes the modal.

### Flow C — deleting a meal (backend only, no UI wired yet)
`DELETE /nutrition/meal/:mealId` finds the meal inside today's document, removes it (`$pull`), and
decrements the day's totals by exactly that meal's values. There's no delete button in the UI yet —
this route exists and works, but nothing calls it.

---

## 3. AI Companion (Aurora)

Aurora is a chat assistant, at `/companion`, that can both **answer questions using the user's real
data** and **write new data** (log a meal, log water, log sleep, create a habit, complete a habit) —
all from one free-text chat message. It does this using Gemini's function-calling feature: Gemini
decides which "tool" (a backend function) to call and with what arguments, the backend actually runs
it against MongoDB, and the result is fed back to Gemini to produce a natural-language reply.

### Data model
No new collection. Aurora reads/writes the same `Habit`, `Hydration`, `Sleep`, and `DailyNutrition`
documents the other four pages use — there's a single source of truth per tracker, not a separate
"chat" copy of the data.

### Flow A — user asks a question ("How am I doing today?")
1. **Frontend** (`Companion.jsx` → `sendMessage`): shows the user's message immediately, then POSTs
   `{ message, history }` to `POST /assistant/chat` (`history` is the prior conversation, empty on
   the first message).
2. **Backend** (`assistantRouter.js`): sends the message + a system prompt (defining Aurora's
   persona and rules) + the 8 tool declarations from `assistantTools.js` to Gemini.
3. Gemini decides it needs real data before it can answer, and returns a `functionCall` for
   `get_overview` instead of text.
4. **Backend**: runs `executeTool("get_overview", {}, req.user)`, which calls
   `getHabitsWithFreshStreaks`, `hydrationService.getToday`, `sleepService.getToday`, and
   `nutritionService.getOrCreateToday` in parallel, and returns one combined object (today's
   habits/streaks, hydration progress, sleep, nutrition totals, and the user's profile goal).
5. **Backend**: sends that result back to Gemini as a `functionResponse`.
6. Gemini now has the real numbers and replies with actual text, e.g. "You're at 1400/2000 kcal today
   and your Morning Walk streak is 5 days."
7. **Backend → Frontend**: returns `{ reply, toolCalls, history }`. The frontend renders `reply`, and
   stores `history` for the next message (so Aurora remembers this exchange without a database-backed
   chat history table).

### Flow B — user asks Aurora to log something ("I drank 500ml of water")
1. Same request shape as Flow A, but this time Gemini recognizes an action, not a question, and
   returns a `functionCall` for `log_water` with `{ amountMl: 500 }` — Gemini itself extracted the
   number from the sentence.
2. **Backend**: `executeTool` calls `hydrationService.logWater(userId, today, 500)`, which upserts
   today's hydration document (creating it with a default 2000ml target if this is the first log of
   the day) and increments `consumed`.
3. The result (`{ consumedMl, targetMl }`) goes back to Gemini, which replies with something like
   "Logged 500ml — you're at 500/2000ml today."
4. **Frontend**: shows the reply, plus a small "log water" badge under it (from `toolCalls`) so the
   user can see an action actually happened, not just a text response.

This same pattern (extract structured arguments from a sentence → call a tool → confirm in plain
English) is how `log_sleep`, `create_habit`, and `complete_habit` work too. `complete_habit` matches
the habit by a case-insensitive substring of its title (since the user won't know the habit's
database id) — if zero or more than one habit matches, the tool returns an error message that Gemini
relays back asking the user to clarify.

### Flow C — user asks Aurora to log a meal ("I had 2 boiled eggs and toast")
This reuses the same macro-estimation idea as the Nutrition page's "Add Meal" flow, but in a single
hop instead of two: because Aurora *is* the Gemini model, the system prompt instructs it to estimate
realistic calories/protein/carbs/fats itself and pass them as arguments when it calls `log_meal` —
there's no separate call to `/gemini-response` needed. `executeTool` then runs
`nutritionService.addMeal` (the exact same function `POST /nutrition/meal-create` uses), so a meal
logged via chat and one logged via the modal are indistinguishable in the database afterward.

### Safety choices worth knowing about
- Aurora's tool set is **read + create/log only** — there's no `delete_habit`, `edit_habit`, or
  similar. A misinterpreted chat message can add a duplicate entry at worst; it can't wipe data.
- The tool-calling loop is capped at `MAX_TOOL_ROUNDS = 5` (`assistantRouter.js`) so a confused model
  can't loop on tool calls forever.

---

## Known limitations / things to be aware of

- Gemini's macro numbers (both in Nutrition's "Add Meal" flow and Aurora's `log_meal`) are an
  **estimate**, not verified nutrition data — accuracy depends on how specific the meal description is.
- Both the Gemini nutrition endpoint and Aurora require a valid `GEMINI_API_KEY` in `backend/.env`.
  If it's missing or invalid, `/gemini-response` and `/assistant/chat` return errors instead of a reply.
- Nutrition goals (`goals` state in `Nutrition.jsx`) are still **local-only** — editing them is not
  persisted to the backend, so they reset on page reload. Aurora doesn't know about them either.
- Aurora's conversation `history` lives only in the browser tab's state (`Companion.jsx`) — refreshing
  the page starts a new conversation. There's no chat history persisted per user in the database.
- `complete_habit` resolves a habit by matching its title from the sentence — if two habits have
  very similar titles, Aurora will ask the user to be more specific rather than guessing.
