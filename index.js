import 'dotenv/config';
import express from "express";
import multer from 'multer';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer({ dest: "uploads" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

const generateEmbeddings = async (dataToArray) => {
    const response = await genAI.models.embedContent({
        model: 'gemini-embedding-2',
        contents: dataToArray,
    });

    console.log(response.embeddings);

    return response.embeddings; // This will log the embeddings
}

const createFileForEmbeddings = (data) => {
    const fileData = JSON.stringify(data);

    const folderPath = './json';
    const filePath = join(folderPath, 'embeddingCreated.json');

    mkdirSync(folderPath, { recursive: true });
    writeFileSync(filePath, fileData, 'utf-8');

    console.log(`Embedding file created: ${filePath}`);
}

const readFile = async () => {
    const data = readFileSync(join(process.cwd(), "json", "data.json"), 'utf-8');
    const dataToArray = JSON.parse(data.toString());
    console.log(dataToArray);
    let responseData = await generateEmbeddings(dataToArray);
    // Embeddings are returned as an array of objects, each containing the embedding values for the corresponding input data. We can map over the responseData to create a new array of objects that associates each input data item with its corresponding embedding values.
    // const embeddingData = responseData.map((item, index) => ({
    //     [dataToArray[index]]: item.values
    // }));


    // We can also create a new array of objects that associates each input data item with its corresponding embedding values, but instead of using the input data item as the key, we can use a more descriptive key name like "name" and "embedding". This will make it easier to work with the data later on.
    // const embeddingData = responseData.map((item, index) => {
    //     return {
    //         name: dataToArray[index],
    //         embedding: item?.values
    //     };
    // });


    const embeddingData = responseData.map((item, index) => {
        return {
            input: dataToArray[index],
            embedding: item?.values
        };
    });
    createFileForEmbeddings(embeddingData);
}

readFile();

// async function main() {
//     const response = await genAI.models.embedContent({
//         model: 'gemini-embedding-2',
//         contents: readFile(),
//     });

//     console.log(response.embeddings); // This will log the embeddings for the word "dog"

//     const manageEmbeddings = response?.embeddings?.map((item, index) => {

//         return {
//             [animals[index]]: item?.values,
//         }
//     })
//     // Define folder and file path
//     const folderPath = './json';
//     const filePath = join(folderPath, 'embeddingAnimals.json');

//     // Create the directory if it doesn't already exist
//     mkdirSync(folderPath, { recursive: true });

//     // Save the JSON string inside the folder
//     writeFileSync(filePath, JSON.stringify(manageEmbeddings, null, 2), 'utf-8');

//     console.log(`Saved embeddings to ${filePath}`);
// }

// main();

app.listen(3400);
