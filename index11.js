import 'dotenv/config';
import express from "express";
import multer from 'multer';
import { readFileSync } from 'fs';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer({ dest: "uploads" });
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

app.get("/", (req, res) => {
    res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="image" />
            <button>Read Image</button>
        </form>
    `);
});

app.post("/upload", upload.single("image"), async (req, res) => {
    const path = req.file.path;
    res.send(await main(path));
});

async function main(path) {
    const base64Img = readFileSync(path, { encoding: "base64" });

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    // { text: "read text from this image" },
                    { text: "tell me the color combination of this image" },
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

    // console.log(response.text);
    return response.text;
}

app.listen(3400);
