# Git difference logs according to the branch and date


# Nutrition Feature

## Goal

Provide daily nutrition insights without requiring users to manually log every meal on the Nutrition page.

---

## User Flow

1. User opens the Nutrition page.
2. If no nutrition data exists for today, a message is displayed:

> No nutrition data available for today. Visit your AI Companion to complete today's nutrition check-in.

3. User is redirected to the AI Companion.
4. The AI asks a fixed set of nutrition questions.
5. Once all questions are answered, nutrition data is generated automatically.
6. The Nutrition page displays:

   * Daily Calories
   * Protein
   * Carbohydrates
   * Fats
   * Weekly averages

---

## AI Question Templates

### Morning Check-In

1. Did you have any junk food today or are you planning to?
2. What will you have for breakfast?
3. What will you have for lunch?
4. What will you have for dinner?

### Afternoon Check-In

1. Did you have any junk food today?
2. What did you have for breakfast?
3. What will you have for lunch?
4. What will you have for dinner?

### Evening / Night Check-In

1. Did you have any junk food today?
2. What did you have for breakfast?
3. What did you have for lunch?
4. What will you have for dinner?

---

## Data Processing

The AI analyzes the user's responses and estimates:

* Calories
* Protein
* Carbohydrates
* Fats

The calculated values are stored as the user's nutrition record for the day.

---

## Validation Rule

Nutrition data is generated only after all required questions have been answered.

Incomplete responses do not produce nutrition statistics.

---

## Nutrition Page

### Daily Summary

* Total Calories
* Total Protein
* Total Carbohydrates
* Total Fats

### Weekly Insights

* Average Daily Calories
* Average Daily Protein
* Average Daily Carbohydrates
* Average Daily Fats

### Empty State

If today's nutrition record does not exist:

> No nutrition data available for today. Complete your nutrition check-in with the AI Companion.
