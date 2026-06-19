import express from "express";
import Hydration from "../models/hydration.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const hydrationRouter = express.Router();

hydrationRouter.get("/hydration", verifyAuth, async (req, res) => {
  try {
    const { _id } = req.user;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hydration = await Hydration.findOne({
      userId: _id,
      date: today,
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
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const data = await Hydration.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate,
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

hydrationRouter.post("/hydration", verifyAuth, async (req, res) => {
  try {
    const { target, consumed, date } = req.body;

    const hydration = await Hydration.findOneAndUpdate(
      {
        userId: req.user._id,
        date,
      },
      {
        $setOnInsert: {
          userId: req.user._id,
          target,
          consumed,
          date,
        },
      },
      {
        upsert: true,
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

hydrationRouter.patch("/hydration", verifyAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hydration = await Hydration.findOneAndUpdate(
      {
        userId: req.user._id,
        date: today,
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
