import 'dotenv/config';
import path from 'path';
import express from "express";
import { GoogleGenAI } from "@google/genai";

// Gemini Basic Config Params Explained

const app = express();
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

// app.get("/", async (req, res) => {
//         const response = await genAI.models.generateContentStream({
//             // model: "gemini-3-flash-preview",
//             model: "gemini-2.5-flash",
//             contents: "Tell me about AI in detail",
//         });

//         for await (const chunk of response) {
//             const text = chunk.text;

//             // console.log(text);
//             if(text) {
//                 res.write(text);
//             }
//         }

//         res.end("--------------------------------- Content Generation Completed ---------------------------------");
// });

// app.listen(3400);


app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

function cleanText(text) {
  return text
    .replace(/#{1,6}\s?/g, "")                 // remove headings ##
    .replace(/\*\*/g, "")                      // remove **
    .replace(/^\s*[\*\-\•]\s+/gm, "");         // remove bullets *, -, •
}

// stream AI response
app.post("/", async (req, res) => {

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const response = await genAI.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: "Tell me about AI in detail",
    });

    for await (const chunk of response) {
        if (chunk.text) {
            res.write(cleanText(chunk.text));
        }
    }

    res.end("\n\n----- Completed -----");
});

app.listen(3400, () => {
    console.log("Server running at http://localhost:3400");
});