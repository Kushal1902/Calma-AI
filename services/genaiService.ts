import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

class GenAIService {
  private client: GoogleGenAI;
  private chat: Chat | null = null;
  private modelName = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
    }
    // Initialize the client. Note: We assume the key is valid as per guidelines.
    this.client = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  public initializeChat() {
    try {
      this.chat = this.client.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7, // Slightly creative but balanced for empathy
          topK: 40,
          topP: 0.95,
        },
      });
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  }

  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      this.initializeChat();
    }

    if (!this.chat) {
      throw new Error("Chat session could not be initialized.");
    }

    try {
      const resultStream = await this.chat.sendMessageStream({ message });
      
      for await (const chunk of resultStream) {
        // Cast to appropriate type if needed, though usually automatic in modern TS
        const responseChunk = chunk as GenerateContentResponse;
        if (responseChunk.text) {
          yield responseChunk.text;
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

// Singleton instance
export const genAIService = new GenAIService();
