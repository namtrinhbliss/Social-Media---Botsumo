import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

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

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const initializeChat = () => {
  try {
    const ai = getAiClient();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster responses
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    // We don't throw here to allow the UI to handle the error when sending a message instead
    chatSession = null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // Try to initialize if not exists
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    // If still null, it means initialization failed (likely no API key)
    throw new Error("AI Assistant is not available. Please check if the API Key is configured.");
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