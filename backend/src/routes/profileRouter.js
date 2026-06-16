import express from "express";

const profileRouter = express.Router();

sleepRouter.get("/profile/view", (req, res) => {
  res.send("sleep get");
});

sleepRouter.patch("/profile/edit", (req, res) => {
  res.send("sleep post");
});


export default profileRouter;
