import 'dotenv/config';
import OpenAI from "openai";

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const context = [
    { role: "system", content: "keep answer short and concise" },
]
const aiAnswer = async (question) => {
    context.push({ role: "user", content: question });
    const response = await openAiClient.responses.create({
        model: "gpt-4o-mini",
        input: context,
    });

    context.push({ role: "assistant", content: response.output_text });
    console.log(context);
    console.log(response.output_text);
}

// aiAnswer();
process.stdout.write("Ask your question: ");
process.stdin.on("data", (data) => {
    // console.log(data.toString().trim()); // to show actual input without buffer

    const question = data.toString().trim();
    if(question.toLowerCase() === "exit") {
        console.log("process is exiting...");
        process.exit();
    } else {
        aiAnswer(question);
    }
})