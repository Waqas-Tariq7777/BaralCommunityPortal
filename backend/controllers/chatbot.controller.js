import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the Q&A context from V3.json
const possiblePaths = [
  path.join(__dirname, "../V3.json"),
  path.join(process.cwd(), "V3.json"),
  path.join(__dirname, "../../V3.json")
];

let trainingContext = "";

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    try {
      const v3Data = JSON.parse(fs.readFileSync(p, "utf-8"));
      trainingContext = v3Data.map(item => `Question: ${item.question}\nAnswer: ${item.answer}`).join("\n\n");
      break;
    } catch (error) {
      console.error(`Error reading V3.json at ${p}:`, error);
    }
  }
}

export const getChatResponse = async (req, res) => {
  const { message, history, audioData, mimeType } = req.body;

  if (!message && !audioData) {
    return res.status(400).json({ success: false, message: "Message or Audio is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let promptParts = [];
    if (audioData) {
      promptParts.push({
        inlineData: { data: audioData, mimeType: mimeType || "audio/webm" },
      });
    }

    if (message) {
      promptParts.push({ text: message });
    } else if (audioData) {
      promptParts.push({ text: "Listen to this audio, transcribe it, and respond based on community context." });
    }

    const systemPrompt = `
      You are the official Baral Community Portal Assistant. Bilingual (English/Urdu).
      Use the following context for answers.
      
      IMPORTANT:
      1. First, provide the transcription of the user's input (audio or text) preceded by "TRANSCRIPTION:".
      2. Then, provide your response preceded by "RESPONSE:". Use Markdown.
      3. CRITICAL: Detect the language of the user's input. If the user's input (text or transcribed audio) is in English, your RESPONSE must be strictly in English. If the user's input is in Urdu, your RESPONSE must be strictly in Urdu. Do not mix languages in the response.
      
      Context:
      ${trainingContext}
    `;

    const chatHistoryContext = history?.map(msg => 
      `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
    ).join("\n") || "";

    const fullPrompt = `${systemPrompt}\n\nHistory:\n${chatHistoryContext}\n\nInput:`;

    const result = await model.generateContentStream([
      { text: fullPrompt },
      ...promptParts
    ]);

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error("Streaming Error:", error);
    res.status(500).write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

