export type MessageSentBy = 'user' | 'ai';
export type MessageStatus = 'PENDING' | 'DELIVERED' | 'FAILED';

export interface IMessage {
  _id: string;
  chatId: string;
  chatSession: string;
  sentBy: MessageSentBy;
  messageContent: string;
  messageVoiceUrl: string;
  status: MessageStatus;
  sentAt: string;
}

export interface IChat {
  id: string;
  name: string | null;
  lastMessage: string | null;
  botVoiceId: string;
  botVoice: {
    id: string;
    voiceName: string | null;
    relation: string | null;
    status: string;
    language: string;
    generatedVoiceSample: string | null;
    bot: { id: string; name: string | null; avatar: string | null };
  };
  chatSession: { id: string; startedAt: string; endedAt: string | null }[];
  _count: { chatSession: number };
  createdAt: string;
  updatedAt: string;
}

export interface ISession {
  id: string;
  chatId: string;
  messages: string[];
  startedAt: string;
  endedAt: string | null;
  userFeedback: { rating?: number; comment?: string } | null;
}

// Socket event payloads
export interface TranscribingPayload {
  text: string;
}

export interface TextChunkPayload {
  chunk: string;
  full: string;
}

export interface AudioChunkPayload {
  chunk: string; // base64
}

export interface MessageSavedPayload {
  userMessage: Pick<IMessage, 'sentBy' | 'messageContent' | 'messageVoiceUrl'>;
  aiMessage: Pick<IMessage, 'sentBy' | 'messageContent' | 'messageVoiceUrl'>;
}
