import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", (req, res) => {
  res.send("signup");
});

authRouter.post("/login", (req, res) => {
  res.send("login");
});

authRouter.post("/logout", (req, res) => {
  res.send("logout");
});

export default authRouter;