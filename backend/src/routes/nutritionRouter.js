import express from "express";

const nutritionRouter = express.Router();

nutritionRouter.get("/nutrition", (req, res) => {
  res.send("nutrition get");
});

nutritionRouter.post("/nutrition", (req, res) => {
  res.send("nutrition post");
});

nutritionRouter.patch("/nutrition/:id", (req, res) => {
  res.send("nutrition patch");
});

nutritionRouter.delete("/nutrition/:id", (req, res) => {
  res.send("nutrition delete");
});

export default nutritionRouter;
