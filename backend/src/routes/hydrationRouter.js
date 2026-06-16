import express from "express";

const hydrationRouter = express.Router();

hydrationRouter.get("/hydration", (req, res) => {
  res.send("Hydration get");
});

hydrationRouter.post("/hydration", (req, res) => {
  res.send("Hydration post");
});

hydrationRouter.patch("/hydration/:id", (req, res) => {
  res.send("Hydration patch");
});

hydrationRouter.delete("/hydration/:id", (req, res) => {
  res.send("Hydration delete");
});

export default hydrationRouter;
