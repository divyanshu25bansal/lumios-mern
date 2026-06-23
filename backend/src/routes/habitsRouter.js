import express from "express";
import { verifyAuth } from '../middleware/verifyAuth.js'
import Habit from "../models/habits.js";
import { getDayKey } from "../utils/getDate.js";

const habitsRouter = express.Router();

habitsRouter.get("/habits", verifyAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const habits = await Habit.find({
      userId: _id,
    });
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
    const { _id } = req.user;
    const { title, habitTime, duration } = req.body;
    const newHabit = new Habit({
      userId: _id,
      title,
      duration,
      habitTime,
      currentStreak: 0,
      maxStreak: 0,
      lastCompletedDate: null,
    });

    const habit = await newHabit.save()
    res.send(habit);
  } catch (err) {
    res.status(400).send("There is an error in creating habit record.")
  }
});

habitsRouter.patch("/habit/:id", verifyAuth, async (req, res) => {
  try {
    const { job, habit } = req.body;
    const habitId = req.params.id;
    let updateHabit;
    if (job === "complete") {
      const today = getDayKey(req.user.timezone);
      updateHabit = await Habit.findOneAndUpdate({
        userId: req.user._id,
        _id: habitId,
      }, {
        $set: {
          lastCompletedDate: today,
        }
      }, {
        returnDocument: true,
      });
    } else {

    }
    console.log(updateHabit)
    res.send(updateHabit)
  } catch (err) {
    res.status(400).send("There is an error in updating habit.")
  }
});

habitsRouter.delete("/habit/:id", verifyAuth, async (req, res) => {
  res.send("habits delete");
});

export default habitsRouter;
