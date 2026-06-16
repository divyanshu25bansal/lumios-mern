import express from "express";

const sleepRouter = express.Router();

sleepRouter.get("/sleep", (req, res) => {
  res.send("sleep get");
});

sleepRouter.post("/sleep", (req, res) => {
  res.send("sleep post");
});

sleepRouter.patch("/sleep/:id", (req, res) => {
  res.send("sleep patch");
});

sleepRouter.delete("/sleep/:id", (req, res) => {
  res.send("sleep delete");
});

export default sleepRouter;
