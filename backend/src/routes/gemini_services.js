import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import dotenv from "dotenv";
import { verifyAuth } from "../middleware/verifyAuth.js";

dotenv.config();

const gemini_router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER },
    carbs: { type: Type.NUMBER },
    fats: { type: Type.NUMBER },
  },
  required: ["foodName", "calories", "protein", "carbs", "fats"],
};

// POST: estimate macro breakdown for a free-text meal description via Gemini
gemini_router.post("/gemini-response", verifyAuth, async (req, res) => {
  try {
    const { mealName } = req.body;

    if (!mealName || !mealName.trim()) {
      return res.status(400).json({
        success: false,
        message: "mealName is required.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a nutrition calculator. Estimate the nutrition values for this meal: "${mealName}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: nutritionSchema,
      },
    });

    const nutrition = JSON.parse(response.text);

    res.status(200).json({
      success: true,
      data: nutrition,
    });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default gemini_router;
