import 'dotenv/config';
import express from "express";
import { writeFileSync } from 'fs';
import { GoogleGenAI } from "@google/genai";

// Gemini Basic Config Params Explained

const app = express();
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function main() {
    const response = await genAI.models.generateContent({
        // model: "gemini-3-flash-preview",
        model: "gemini-2.5-flash",
        contents: "write basic example of javascript",
        config: {
            // systemInstruction: "explain the code in detail in 30 words",
            thinkingConfig: {
                includeThoughts: true,
                thinkingBudget: 100,
            }
        },
    });

    // console.log(response.text);
    console.log(response.candidates[0].content); // for checking thinkingConfig
}

main();