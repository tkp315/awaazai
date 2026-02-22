import { getClient, getConfig } from './client.js';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { Readable } from 'stream';
import fs from 'fs';

// ============================================
// CHAT COMPLETION
// ============================================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const client = getClient();
  const config = getConfig();

  const response = await client.chat.completions.create({
    model: options?.model || config.chat.model,
    messages: messages as ChatCompletionMessageParam[],
    max_tokens: options?.maxTokens || config.chat.maxTokens,
    temperature: options?.temperature || config.chat.temperature,
  });

  return response.choices[0]?.message?.content || '';
}

export async function* chatStream(
  messages: ChatMessage[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): AsyncGenerator<string> {
  const client = getClient();
  const config = getConfig();

  const stream = await client.chat.completions.create({
    model: options?.model || config.chat.model,
    messages: messages as ChatCompletionMessageParam[],
    max_tokens: options?.maxTokens || config.chat.maxTokens,
    temperature: options?.temperature || config.chat.temperature,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

export async function generateResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory?: ChatMessage[]
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...(conversationHistory || []),
    { role: 'user', content: userMessage },
  ];

  return chat(messages);
}

// ============================================
// SPEECH-TO-TEXT (Whisper)
// ============================================

export async function transcribeAudio(
  audioFilePath: string,
  options?: {
    language?: string;
    prompt?: string;
  }
): Promise<string> {
  const client = getClient();
  const config = getConfig();

  const response = await client.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: config.whisper.model,
    language: options?.language || config.whisper.language,
    prompt: options?.prompt,
  });

  return response.text;
}

export async function transcribeAudioBuffer(
  audioBuffer: Buffer,
  fileName: string,
  options?: {
    language?: string;
    prompt?: string;
  }
): Promise<string> {
  const client = getClient();
  const config = getConfig();

  // Create a File-like object from the buffer
  const uint8Array = new Uint8Array(audioBuffer);
  const file = new File([uint8Array], fileName, { type: 'audio/webm' });

  const response = await client.audio.transcriptions.create({
    file: file,
    model: config.whisper.model,
    language: options?.language || config.whisper.language,
    prompt: options?.prompt,
  });

  return response.text;
}

// ============================================
// EMBEDDINGS
// ============================================

export async function createEmbedding(text: string): Promise<number[]> {
  const client = getClient();

  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const client = getClient();

  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });

  return response.data.map(d => d.embedding);
}

// ============================================
// MODERATION
// ============================================

export async function checkModeration(text: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
}> {
  const client = getClient();

  const response = await client.moderations.create({
    input: text,
  });

  const result = response.results[0];

  return {
    flagged: result.flagged,
    categories: result.categories as unknown as Record<string, boolean>,
  };
}
