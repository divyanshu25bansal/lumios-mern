import express from "express";
import Hydration from "../models/hydration.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { getToday, getWeeklyDateRange } from "../utils/getDate.js";

const hydrationRouter = express.Router();

hydrationRouter.get("/hydration", verifyAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const today = getToday();
    const hydration = await Hydration.findOne({
      userId: _id,
      date: today.startDate,
    });

    res.send(hydration);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

hydrationRouter.get("/hydration/last-7-days", verifyAuth, async (req, res) => {
  try {
    const weekDates = getWeeklyDateRange();
    const data = await Hydration.find({
      userId: req.user._id,
      date: {
        $gte: weekDates.startDate,
        $lte: weekDates.endDate,
      },
    }).sort({ date: 1 });

    res.send(data);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

hydrationRouter.post("/hydration/create", verifyAuth, async (req, res) => {
  try {
    const { target, consumed } = req.body;
    const today = getToday();
    const hydration = await Hydration.create({
      userId: req.user._id,
      target,
      consumed,
      date: today.startDate,
    });

    res.send(hydration);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

hydrationRouter.patch("/hydration/edit", verifyAuth, async (req, res) => {
  try {
    const today = getToday();
    const hydration = await Hydration.findOneAndUpdate(
      {
        userId: req.user._id,
        date: today.startDate,
      },
      {
        $inc: {
          consumed: req.body.amount,
        },
      },
      {
        returnDocument: true,
      },
    );

    res.send(hydration);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

hydrationRouter.delete("/hydration/:id", (req, res) => {
  res.send("Hydration delete");
});

export default hydrationRouter;
