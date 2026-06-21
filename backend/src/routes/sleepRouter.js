import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import Sleep from "../models/sleep.js";
import { getToday, getWeeklyDateRange } from "../utils/getDate.js";

const sleepRouter = express.Router();

sleepRouter.get("/sleep", verifyAuth, async (req, res) => {
  try {
    const today = getToday();
    const sleep = await Sleep.findOne({
      userId: req.user._id,
      date: {
        $gte: today.startDate,
        $lte: today.endDate,
      },
    });
    res.send(sleep);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

sleepRouter.post("/sleep/create", verifyAuth, async (req, res) => {
  try {
    const { duration } = req.body;
    const today = getToday();
    const sleepCreate = new Sleep({
      userId: req.user._id,
      duration,
      date: today.startDate,
      sleepLogged: false,
    });
    const sleep = await sleepCreate.save();
    res.send(sleep);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

sleepRouter.get("/sleep/last-7-days", verifyAuth, async (req, res) => {
  try {
    const weekDates = getWeeklyDateRange();
    const sleepHistory = await Sleep.find({
      userId: req.user._id,
      date: {
        $gte: weekDates.startDate,
        $lte: weekDates.endDate,
      },
    }).sort({ date: 1 });
    res.send(sleepHistory);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

sleepRouter.patch("/sleep/edit", verifyAuth, async (req, res) => {
  try {
    const { duration, sleepLogged } = req.body;
    const today = getToday();
    const sleep = await Sleep.findOneAndUpdate(
      {
        userId: req.user._id,
        date: today.startDate,
      },
      {
        $set: {
          duration,
          sleepLogged,
        },
      },
      {
        returnDocument: true,
      },
    );
    res.send(sleep);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default sleepRouter;
