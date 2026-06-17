import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";
import User from "../models/user.js";

const profileRouter = express.Router();

profileRouter.get("/profile", verifyAuth, (req, res) => {
  res.status(200).send(req.user);
});

profileRouter.patch("/profile/edit", verifyAuth, async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "gender",
      "age",
      "height",
      "weight",
      "profilePicture",
      "goal",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default profileRouter;
