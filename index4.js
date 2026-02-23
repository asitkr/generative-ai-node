import 'dotenv/config';
import OpenAI from "openai";
import { createReadStream, writeFileSync } from "fs";

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// audio to text generation using whisper-1, gpt-4o-mini-transcribe, gpt-4o-transcribe, gpt-4o-transcribe-diarize
const main = async () => {
    const textResponse = await openAiClient.audio.transcriptions.create({
        model: "whisper-1", // whisper-1, gpt-4o-mini-transcribe, gpt-4o-transcribe, gpt-4o-transcribe-diarize
        file: createReadStream("./audio.mp3"),
        language: "en",
    });

    console.log(textResponse);
    console.log(textResponse?.text);
    const rawText = textResponse.text;

    writeFileSync("audioToText.txt", rawText, "utf-8");
}

main();