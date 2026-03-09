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
            <input type="text" placeholder="Enter image description" name="imageText" />
            <button>Send Text</button>
        </form>
    `);
});

app.post("/generate", async (req, res) => {
    const { imageText } = req.body;
    res.send(await main(imageText));
});

async function main(imageText) {
    const response = await genAI.models.generateImages({
        model: "imagen-4.0-generate-001", // this is for paid plan
        prompt: imageText,
        config: {
            numberOfImages: 1,
        }
    });

    // console.log(response.generatedImages[0].image.imageBytes); // for single image show
    const imageBase64 = response.generatedImages[0].image.imageBytes;
    const buffer = Buffer.from(imageBase64, 'base64');
    const imagePath = 'generated_image.png';
    writeFileSync(imagePath, buffer);
}

app.listen(3400);
