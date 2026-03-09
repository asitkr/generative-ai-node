import 'dotenv/config';
import express from "express";
import multer from 'multer';
import { writeFileSync } from 'fs';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer({ dest: "uploads" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

app.get("/", (req, res) => {
    res.send(`
        <form action="/generate" method="post">
            <input type="text" placeholder="Enter video description" name="video" />
            <button>Generate Video</button>
        </form>
    `);
});

app.post("/generate", async (req, res) => {
    const { video } = req.body;
    res.send(await main(video));
});

async function main(videoText) {
    let operation = await genAI.models.generateVideos({
        model: "veo-3.0-generate-001", // this is for paid plan
        prompt: videoText,
        config: {
            numberOfImages: 1,
        }
    });

    while(!operation.done) {
        console.log("Waiting for operation to complete...");

        await new Promise(resolve => setTimeout(resolve, 1000));
        operation = await genAI.operations.getVideosOperation({
            operation: operation.name,
        });
    }

    await genAI.files.download({
        file: operation.response.generatedVideos[0].video,
        downloadPath: "video.mp4",
    })

    return "video.mp4"
}

app.listen(3400);
