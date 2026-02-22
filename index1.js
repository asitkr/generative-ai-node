import 'dotenv/config';
import OpenAI from 'openai';
// import { encoding_for_model } from "tiktoken";

const openAi_Key = process.env.OPENAI_KEY;

const openAiClient = new OpenAI({ apiKey: openAi_Key });

// const response = await openAiClient.responses.create({
//     instructions: "Generate an image description based on the input text.",
//     input: "Generate Image of human being happy like with a broad smile, their eyes sparkling with joy.",
//     model: "gpt-4o-mini",
// })

// Role-based response generation
// const response = await openAiClient.responses.create({
//     input: [
//         { role: "system", content: "output should be in hindi language in 10 words" }, // role: system always starts or on top
//         // { role: "developer", content: "with basic examples in javascript" },
//         { role: "user", content: "what is  coding?" }
//     ],
//     model: "gpt-4o-mini",
// })

// console.log(response.usage);

// token calculation
// const prompt = "What is artificial intelligence?";
// const model = "gpt-4o-mini";

// const response = await openAiClient.responses.create({
//     input: [
//         { role: "user", content: prompt }
//     ],
//     model,
// })

// console.log(response.usage);

// const calculateTokens = () => {
//     const encoder = encoding_for_model(model);
//     const tokenData = encoder.encode(prompt);
//     console.log("Total tokens used:", tokenData);
// }

// calculateTokens();



// Temperature value varies from 0 to 2
const prompt = "What is artificial intelligence?";
const model = "gpt-4o-mini";

const response = await openAiClient.responses.create({
    input: [
        { role: "user", content: prompt }
    ],
    model,
    // temperature: 0,
    // max_output_tokens: 16,
    store: true,
    
})

// console.log(response.output_text);
const oldResponse = await openAiClient.responses.retrieve(response.id);
console.log(oldResponse.output_text);
