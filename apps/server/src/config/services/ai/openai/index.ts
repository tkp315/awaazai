export interface OpenAIConfig {
  apiKey: string;
  chat: {
    model: string;
    maxTokens: number;
    temperature: number;
  };
  whisper: {
    model: string;
    language: string;
  };
}

async function openaiConfig(): Promise<OpenAIConfig> {
  return {
    apiKey: process.env.OPENAI_API_KEY || '',

    // GPT-4 for chat responses
    chat: {
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4',
      maxTokens: 500,
      temperature: 0.7,
    },

    // Whisper for Speech-to-Text
    whisper: {
      model: 'whisper-1',
      language: 'hi', // Hindi + English
    },
  };
}

export default openaiConfig;
