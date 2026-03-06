import 'dotenv/config';
import express from "express";
import { writeFileSync } from 'fs';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function main() {
    const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "table of 20 and 30",
    });

    console.log(response.text);
}

main();