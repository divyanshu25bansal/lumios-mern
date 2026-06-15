import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("____CONNECTED____");
  } catch (err) {
    console.log("There is an error in connecting to database!!");
  }
}
