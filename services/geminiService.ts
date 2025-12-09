import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// We use a chat session to maintain context about the user's questions
let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are SheetMaster AI, an expert Google Sheets consultant. 
Your goal is to help users working inside a Google Sheet.
You cannot directly see the sheet content due to browser security restrictions (CORS), but you can answer any question about:
1. Formulas (SUM, VLOOKUP, INDEX/MATCH, QUERY, REGEX, etc.)
2. Google Apps Script helpers.
3. Data organization and pivot table best practices.
4. Troubleshooting common errors (#REF!, #N/A, etc.).

When providing formulas:
- Be concise.
- Explain how the formula works briefly.
- Provide copy-pasteable examples.

If a user asks you to "analyze this data", kindly remind them to paste the data headers or a sample row into the chat so you can understand the structure.
`;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster, simple responses
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message,
    });
    return result.text || "I couldn't generate a response.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An error occurred while communicating with AI.");
  }
};