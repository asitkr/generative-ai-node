import 'dotenv/config';
import OpenAI from "openai";
import express from "express";
import multer from 'multer';
import path from 'path';
import { createReadStream } from 'fs';

const app = express();
const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.get("/", (req, res) => {
    res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="audio" accept="audio/*">
            <button>Upload Audio</button>
        </form>
    `);
});

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + "-" + file.fieldname + ext);
    }
});

const upload = multer({ storage });

app.post("/upload", upload.single("audio"), async (req, res) => {
    const textResponse = await openAiClient.audio.transcriptions.create({
            model: "whisper-1", // whisper-1, gpt-4o-mini-transcribe, gpt-4o-transcribe, gpt-4o-transcribe-diarize
            file: createReadStream(req.file.path),
            language: "en",
        });
    console.log(textResponse); // Uploaded file details
    res.send(`<h1>Audio file received and transcribed successfully!</h1><p>${textResponse.text}</p>`);
});

app.listen(3200, () => {
    console.log("Server is running on port 3200");
});
