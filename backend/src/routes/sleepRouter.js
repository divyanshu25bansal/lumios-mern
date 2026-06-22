import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import Sleep from "../models/sleep.js";
import { getDayKey } from "../utils/getDate.js";

const sleepRouter = express.Router();

sleepRouter.get("/sleep", verifyAuth, async (req, res) => {
  try {
    const dayKey = getDayKey(req.user.timezone);
    const sleep = await Sleep.findOne({
      userId: req.user._id,
      dayKey,
    });
    res.send(sleep);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

sleepRouter.post("/sleep/create", verifyAuth, async (req, res) => {
  try {
    const { duration } = req.body;
    const dayKey = getDayKey(req.user.timezone);
    const sleepCreate = new Sleep({
      userId: req.user._id,
      duration,
      dayKey,
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
    const dayKey = getDayKey(req.user.timezone);
    const sleepHistory = await Sleep.find({
      userId: req.user._id,
    }).sort({ dayKey: -1 }).limit(7);
    res.send(sleepHistory);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

sleepRouter.patch("/sleep/edit", verifyAuth, async (req, res) => {
  try {
    const { duration, sleepLogged } = req.body;
    const dayKey = getDayKey(req.user.timezone);
    const sleep = await Sleep.findOneAndUpdate(
      {
        userId: req.user._id,
        dayKey,
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
