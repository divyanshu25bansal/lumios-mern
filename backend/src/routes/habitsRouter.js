import express from "express";
import { verifyAuth } from '../middleware/verifyAuth.js'
import {
  completeHabit,
  uncompleteHabit,
  getHabitsWithFreshStreaks,
  createHabit,
} from "../services/habitService.js";

const habitsRouter = express.Router();

habitsRouter.get("/habits", verifyAuth, async (req, res) => {
  try {
    const habits = await getHabitsWithFreshStreaks(req.user._id, req.user.timezone);
    const habitsTOSend = habits.map((habit) => ({
      title: habit.title,
      duration: habit.duration,
      habitTime: habit.habitTime,
      lastCompletedDate: habit.lastCompletedDate,
      currentStreak: habit.currentStreak,
      maxStreak: habit.maxStreak,
      _id: habit._id,
    }))
    res.send(habitsTOSend)
  } catch (err) {
    res.status(400).send("There is an error in fetching habit records.")
  }
});

habitsRouter.post("/habit/create", verifyAuth, async (req, res) => {
  try {
    const { title, habitTime, duration } = req.body;
    const habit = await createHabit(req.user._id, { title, duration, habitTime });
    res.send(habit);
  } catch (err) {
    res.status(400).send("There is an error in creating habit record.")
  }
});

habitsRouter.patch("/habit/:id", verifyAuth, async (req, res) => {
  try {
    const { job } = req.body;
    const habitId = req.params.id;

    let updateHabit;
    if (job === "complete") {
      updateHabit = await completeHabit(req.user._id, habitId, req.user.timezone);
    } else if (job === "uncomplete") {
      updateHabit = await uncompleteHabit(req.user._id, habitId, req.user.timezone);
    } else {
      return res.status(400).send("Invalid job type.");
    }

    if (!updateHabit) {
      return res.status(404).send("Habit not found.");
    }

    res.send(updateHabit);
  } catch (err) {
    res.status(400).send("There is an error in updating habit.")
  }
});

habitsRouter.delete("/habit/:id", verifyAuth, async (req, res) => {
  res.send("habits delete");
});

export default habitsRouter;
