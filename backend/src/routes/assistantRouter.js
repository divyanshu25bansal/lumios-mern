import express from "express";
import {
  GoogleGenAI,
  createUserContent,
  createModelContent,
  createPartFromFunctionResponse,
} from "@google/genai";
import dotenv from "dotenv";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { toolDeclarations, executeTool } from "../services/assistantTools.js";

dotenv.config();

const assistantRouter = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-2.5-flash";
const MAX_TOOL_ROUNDS = 5;

const SYSTEM_INSTRUCTION = `You are Aurora, the AI health companion built into the Lumios app.

You can see and update the current user's real habits, hydration, sleep, and nutrition data through
the tools you've been given. Rules:
- Never guess at the user's data. If a question needs their data, call a tool first.
- If the user asks you to log or track something (a meal, water, sleep, completing a habit, creating
  a habit), call the matching tool instead of only replying in text.
- For log_meal, estimate realistic calories/protein/carbs/fats for the food described yourself,
  the way a nutrition calculator would - the user won't provide these numbers.
- Keep replies short, warm, and specific to the user's actual numbers instead of generic advice.`;

const config = {
  systemInstruction: SYSTEM_INSTRUCTION,
  tools: [{ functionDeclarations: toolDeclarations }],
};

assistantRouter.post("/assistant/chat", verifyAuth, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "message is required.",
      });
    }

    const contents = [...(Array.isArray(history) ? history : []), createUserContent(message)];

    const toolCalls = [];
    let response = await ai.models.generateContent({ model: MODEL, contents, config });

    let rounds = 0;
    while (response.functionCalls?.length && rounds < MAX_TOOL_ROUNDS) {
      contents.push(createModelContent(response.candidates[0].content.parts));

      const responseParts = [];
      for (const call of response.functionCalls) {
        const result = await executeTool(call.name, call.args, req.user);
        toolCalls.push({ name: call.name, args: call.args, result });
        responseParts.push(
          createPartFromFunctionResponse(call.id ?? call.name, call.name, { result }),
        );
      }
      contents.push({ role: "user", parts: responseParts });

      response = await ai.models.generateContent({ model: MODEL, contents, config });
      rounds += 1;
    }

    contents.push(createModelContent(response.candidates[0].content.parts));

    res.status(200).json({
      success: true,
      reply: response.text,
      toolCalls,
      history: contents,
    });
  } catch (err) {
    console.error("Assistant Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default assistantRouter;
