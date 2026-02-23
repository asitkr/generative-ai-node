import 'dotenv/config';
import OpenAI from "openai";
import { writeFileSync } from "fs";

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// generate an image of a white siamese cat using DALL-E 3, image-1-mini (for better image quality)
const main = async () => {
    const response = await openAiClient.images.generate({
        model: "image-1-mini", // "dall-e-3"
        prompt: "a white siamese cat",
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json",
        n: 1,
    });

    console.log(response);
    const rawImage = response?.data?.[0]?.b64_json;
    if(rawImage) {
        const path = "./cat.png";
        writeFileSync(path, Buffer.from(rawImage, "base64"));
        console.log(`Image saved to ${path}`);
    }
}

main();