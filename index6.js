import 'dotenv/config';
import OpenAI from "openai";
import express from "express";
import { writeFileSync} from 'fs';

const app = express();
app.use(express.urlencoded({ extended: true }));

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.get("/", (req, res) => {
    res.send(`
        <form action="/audio" method="post">
            <input type="text" name="inputData" placeholder="Enter text to convert to speech">
            <br />
            <br />
            <button>Generate Speech</button>
        </form>
        `);
});

app.post("/audio", async (req, res) => {
    const inputData = req?.body?.inputData;
    if (!inputData) {
        return res.status(400).send("Input data is required");
    }
    res.send(inputData);

    const response = await openAiClient.audio.speech.create({
        model: "gpt-4o-mini-tts", // gpt-4o-mini-tts, gpt-4o-tts
        input: inputData,
        voice: "coral", // coral, daphne, jason, lucia, marcel, mia, oscar, rachel, sam, taylor
        language: "en", // en, es, fr, de, it, pt, ja, ko, zh, hi
    });

    const baseResponse = Buffer.from(await response.arrayBuffer());
    writeFileSync("output.mp3", baseResponse);
    console.log(baseResponse);

    res.send("Text converted to audio");
});

// async function main() {
//     const response = await openAiClient.audio.speech.create({
//         model: "gpt-4o-mini-tts", // gpt-4o-mini-tts, gpt-4o-tts
//         input: "Hello, how are you doing today?",
//         voice: "coral", // coral, daphne, jason, lucia, marcel, mia, oscar, rachel, sam, taylor
//     });

//     const baseResponse = Buffer.from(await response.arrayBuffer());
//     writeFileSync("output.mp3", baseResponse);
//     console.log(baseResponse);
// }

// main();

app.listen(3200, () => {
    console.log("Server is running on port 3200");
});