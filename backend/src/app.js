import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConfig.js";
import authRouter from "./routes/authRouter.js";
import sleepRouter from "./routes/sleepRouter.js";
import hydrationRouter from "./routes/hydrationRouter.js";
import nutritionRouter from "./routes/nutritionRouter.js";
import habitsRouter from "./routes/habitsRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", authRouter);
app.use("/", habitsRouter);
app.use("/", hydrationRouter);
app.use("/", nutritionRouter);
app.use("/", sleepRouter);

app.get("/", (req, res) => {
  res.send("Hello Divyanshu!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
