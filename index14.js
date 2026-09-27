import 'dotenv/config';
import express from "express";
import multer from 'multer';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer({ dest: "uploads" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

const data = ['dog', 'cat', 'bird', 'fish', 'hamster', 'rabbit', 'turtle', 'lizard', 'snake'];

// Example of generating embeddings for a list of words and saving them to a JSON file
async function main() {
    const response = await genAI.models.embedContent({
        model: 'gemini-embedding-2',
        contents: data,
    });

    console.log(response.embeddings); // This will log the embeddings for the word "dog"

    const manageEmbeddings = response?.embeddings?.map((item, index) => {

        return {
            [data[index]]: item?.values,
        }
    })
    // Define folder and file path
    const folderPath = './json';
    const filePath = join(folderPath, 'embedding.json');

    // Create the directory if it doesn't already exist
    mkdirSync(folderPath, { recursive: true });

    // Save the JSON string inside the folder
    writeFileSync(filePath, JSON.stringify(manageEmbeddings, null, 2), 'utf-8');

    console.log(`Saved embeddings to ${filePath}`);
}

main();

app.listen(3400);
