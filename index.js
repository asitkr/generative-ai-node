import 'dotenv/config';
import { readFileSync } from 'fs';
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function main() {
    const base64Img = readFileSync("lavender.png", { encoding: "base64" });

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: "read text from this image" },
                    { text: "tell me the color combination" },
                    {
                        inlineData: {
                            mimeType: "image/png",
                            data: base64Img,
                        }
                    }
                ]
            }
        ],
    });

    console.log(response.text);
}

main();
