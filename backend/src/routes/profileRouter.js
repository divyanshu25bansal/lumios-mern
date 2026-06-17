import express from "express";
import { verifyAuth } from "../middleware/verifyAuth.js";

const profileRouter = express.Router();

profileRouter.get("/profile", verifyAuth, (req, res) => {
  res.status(200).send(req.user);
});

profileRouter.patch("/profile/edit", (req, res) => {
  res.send("sleep post");
});

export default profileRouter;
