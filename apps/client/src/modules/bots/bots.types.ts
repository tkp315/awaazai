export type BotStatus = 'ACTIVE' | 'INACTIVE' | 'TRAINED';
export type KnowledgeMode = 'AI_ONLY' | 'RAG' | 'HYBRID';
export type BotMessageRole = 'USER' | 'BOT' | 'SYSTEM';
export type TrainingStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type TrainingTrigger = 'USER' | 'SYSTEM';
export type KnowledgeType = 'DOCUMENT' | 'NOTE' | 'URL' | 'FAQ' | 'AUDIO' | 'IMAGE';
export type KnowledgeStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
export type BotTone = 'FORMAL' | 'CASUAL' | 'FRIENDLY' | 'PROFESSIONAL' | 'HUMOROUS';
export type ResponseLength = 'SHORT' | 'MEDIUM' | 'DETAILED';
export type ResponseFormat = 'TEXT_ONLY' | 'TEXT_WITH_EMOJI' | 'MARKDOWN' | 'RICH_TEXT';
export type VoiceSpeed = 'SLOW' | 'NORMAL' | 'FAST';

export interface ICapabilityFunction {
  id: string;
  name: string;
  description: string;
  capabilityId: string;
}

export interface ICapability {
  id: string;
  name: string;
  description: string;
  functions: ICapabilityFunction[];
}

export interface IAvailableBot {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  isActive: boolean;
  isVoiceBot: boolean;
  sortOrder: number;
  capabilities: ICapability[];
}

export type VoiceStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface IBotVoice {
  id: string;
  voiceName: string | null;
  relation: string | null;
  status: VoiceStatus;
  language: string;
  elvenlabsVoiceId: string | null;
}

export interface IBotCapability {
  id: string;
  capabilityId: string;
  capability: ICapability;
  isEnabled: boolean | null;
  settings: Record<string, unknown>;
}

export interface IBotTraining {
  id: string;
  status: TrainingStatus;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  capabilityId: string | null;
  createdAt: string;
}

export interface IBotKnowledge {
  id: string;
  type: KnowledgeType;
  title: string;
  content: string | null;
  sourceUrl: string | null;
  status: KnowledgeStatus;
  capabilityId: string | null;
  createdAt: string;
}

export interface IBotConfig {
  id: string;
  tone: BotTone;
  personality: { traits: string[]; style: string } | null;
  customPrompt: string | null;
  primaryLanguage: string;
  secondaryLanguage: string | null;
  languageMixing: boolean;
  responseLength: ResponseLength;
  responseFormat: ResponseFormat;
  useEmoji: boolean;
  welcomeMessage: string | null;
  fallbackMessage: string | null;
  voiceSpeed: VoiceSpeed;
  voicePitch: string | null;
  voiceVolume: number | null;
  typingDelay: number | null;
  autoGreet: boolean;
  rememberContext: boolean;
}

export interface IBot {
  id: string;
  name: string | null;
  purpose: string | null;
  status: BotStatus;
  avatar: string | null;
  lastUsedAt: string | null;
  isPublic: boolean;
  knowledgeMode: KnowledgeMode;
  selectedVoiceId: string | null;
  selectedVoice: Pick<IBotVoice, 'id' | 'voiceName' | 'relation' | 'status' | 'language'> | null;
  botVoices: IBotVoice[];
  userId: string;
  availableBotId: string;
  availableBot: IAvailableBot;
  capability: IBotCapability[];
  trainings: IBotTraining[];
  config: IBotConfig | null;
  _count: { knowledge: number; trainings: number };
  createdAt: string;
  updatedAt: string;
}

// ─── Bot Chat Types ───────────────────────────────────────────────────────────

export interface IBotMessage {
  id: string;
  role: BotMessageRole;
  content: string;
  voiceUrl: string | null;
  ragUsed: boolean;
  ragSources: unknown | null;
  createdAt: string;
}

export interface IBotSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  summary: string | null;
  messages: IBotMessage[];
}

export interface IBotChat {
  id: string;
  title: string | null;
  botId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  sessions?: IBotSession[];
  _count?: { sessions: number };
}

export interface SendBotMessageResponse {
  userMessage: IBotMessage;
  botMessage: IBotMessage;
  sessionId: string;
}

export interface CreateBotPayload {
  name: string;
  purpose?: string;
  avatar?: string;
  isPublic?: boolean;
  availableBotId: string;
  knowledgeMode?: KnowledgeMode;
  selectedVoiceId?: string | null;
}

export interface AddKnowledgePayload {
  type: KnowledgeType;
  title: string;
  content?: string;
  sourceUrl?: string;
  capabilityId?: string;
}

export interface CreateBotChatPayload {
  title?: string;
}

export interface SendBotMessagePayload {
  content: string;
}
