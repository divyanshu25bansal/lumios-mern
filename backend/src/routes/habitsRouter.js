import express from "express";

const habitsRouter = express.Router();

habitsRouter.get("/habits", (req, res) => {
  res.send("habits get");
});

habitsRouter.post("/habits", (req, res) => {
  res.send("habits post");
});

habitsRouter.patch("/habits/:id", (req, res) => {
  res.send("habits patch");
});

habitsRouter.delete("/habits/:id", (req, res) => {
  res.send("habits delete");
});

export default habitsRouter;
