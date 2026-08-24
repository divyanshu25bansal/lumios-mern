import express from "express";
import Hydration from "../models/hydration.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { getDayKey } from "../utils/getDate.js";

const hydrationRouter = express.Router();

hydrationRouter.get("/hydration", verifyAuth, async (req, res) => {
  try {
    const { _id, timezone } = req.user;
    const dayKey = getDayKey(timezone);  // get today date like 2026-02-21

    const hydration = await Hydration.findOne({
      userId: _id,
      dayKey,
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
    const data = await Hydration.find({
      userId: req.user._id,
    }).sort({ dayKey: -1 }).limit(7)

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
    const dayKey = getDayKey(req.user.timezone);
    const hydration = await Hydration.create({
      userId: req.user._id,
      target,
      consumed,
      dayKey,
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
    const dayKey = getDayKey(req.user.timezone);
    const hydration = await Hydration.findOneAndUpdate(
      {
        userId: req.user._id,
        dayKey,
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
