import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateUserData } from "../utils/validation.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateUserData(req);
    const { firstName, lastName, email, password } = req.body.authDetails;
    const passwordHash = await bcrypt.hash(password, 10); // hashing password

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });

    await newUser.save();
    res.json({
      success: true,
      message: "New user has been created.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body.authDetails;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 7 * 24 * 3600000),
      });
      res.send("Successfully Logged In");
    } else {
      throw new Error("Credential not found!");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.send("Logout successfully!");
});

export default authRouter;
