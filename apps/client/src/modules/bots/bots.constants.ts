import type { ICapability, KnowledgeType, TrainingStatus } from './bots.types';

// ==========================================
// CAPABILITY DISPLAY METADATA
// ==========================================

export interface CapabilityDisplay {
  icon: string;
  color: string;
  bg: string;
}

// Maps capability name keywords → display config
export const getCapabilityDisplay = (name: string): CapabilityDisplay => {
  const lower = name.toLowerCase();
  if (lower.includes('voice') || lower.includes('twin')) {
    return { icon: 'mic', color: '#6366f1', bg: '#eef2ff' };
  }
  if (lower.includes('note') || lower.includes('forge')) {
    return { icon: 'document-text', color: '#f59e0b', bg: '#fffbeb' };
  }
  if (lower.includes('study') || lower.includes('mate') || lower.includes('learn')) {
    return { icon: 'book', color: '#10b981', bg: '#ecfdf5' };
  }
  if (lower.includes('journal') || lower.includes('log') || lower.includes('diary')) {
    return { icon: 'journal', color: '#8b5cf6', bg: '#f5f3ff' };
  }
  if (lower.includes('coach') || lower.includes('focus') || lower.includes('goal')) {
    return { icon: 'fitness', color: '#f97316', bg: '#fff7ed' };
  }
  if (lower.includes('chat') || lower.includes('talk') || lower.includes('convers')) {
    return { icon: 'chatbubbles', color: '#06b6d4', bg: '#ecfeff' };
  }
  return { icon: 'cube-outline', color: '#64748b', bg: '#f1f5f9' };
};

// ==========================================
// KNOWLEDGE TYPE DISPLAY
// ==========================================

export const KNOWLEDGE_TYPE_DISPLAY: Record<
  KnowledgeType,
  { icon: string; label: string; color: string; description: string }
> = {
  DOCUMENT: {
    icon: 'document-attach',
    label: 'Document',
    color: '#3b82f6',
    description: 'Upload PDF, DOC, TXT files',
  },
  NOTE: {
    icon: 'create',
    label: 'Note',
    color: '#10b981',
    description: 'Type or paste text directly',
  },
  URL: {
    icon: 'link',
    label: 'Web URL',
    color: '#8b5cf6',
    description: 'Import from a website or article',
  },
  FAQ: {
    icon: 'help-circle',
    label: 'FAQ',
    color: '#f59e0b',
    description: 'Add question-answer pairs',
  },
  AUDIO: {
    icon: 'mic',
    label: 'Audio',
    color: '#8b5cf6',
    description: 'Upload audio recordings',
  },
  IMAGE: {
    icon: 'image',
    label: 'Image',
    color: '#ec4899',
    description: 'Upload images with text or diagrams',
  },
};

// ==========================================
// TRAINING STATUS DISPLAY
// ==========================================

export const TRAINING_STATUS_DISPLAY: Record<
  TrainingStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  QUEUED: { label: 'Queued', color: '#64748b', bg: '#f1f5f9', icon: 'time-outline' },
  PROCESSING: { label: 'Processing', color: '#f59e0b', bg: '#fffbeb', icon: 'sync-outline' },
  COMPLETED: {
    label: 'Completed',
    color: '#10b981',
    bg: '#ecfdf5',
    icon: 'checkmark-circle-outline',
  },
  FAILED: { label: 'Failed', color: '#ef4444', bg: '#fee2e2', icon: 'close-circle-outline' },
};

// ==========================================
// BOT TONE OPTIONS
// ==========================================

export const BOT_TONE_OPTIONS: Array<{ value: string; label: string; emoji: string }> = [
  { value: 'FRIENDLY', label: 'Friendly', emoji: '😊' },
  { value: 'CASUAL', label: 'Casual', emoji: '😎' },
  { value: 'FORMAL', label: 'Formal', emoji: '👔' },
  { value: 'PROFESSIONAL', label: 'Professional', emoji: '💼' },
  { value: 'HUMOROUS', label: 'Humorous', emoji: '😄' },
];

// ==========================================
// MOCK CAPABILITIES (will be replaced by API)
// ==========================================

export const MOCK_CAPABILITIES: ICapability[] = [
  {
    id: 'cap-voice-twin',
    name: 'VoiceTwin',
    description: 'Clone & chat in the voice of your loved ones',
    functions: [
      {
        id: 'fn-1',
        name: 'Voice Chat',
        description: 'Real-time conversation in cloned voice',
        capabilityId: 'cap-voice-twin',
      },
      {
        id: 'fn-2',
        name: 'Voice Cloning',
        description: 'Clone voice from audio samples',
        capabilityId: 'cap-voice-twin',
      },
    ],
  },
  {
    id: 'cap-note-forge',
    name: 'NoteForge',
    description: 'AI note maker that learns your writing style',
    functions: [
      {
        id: 'fn-3',
        name: 'Smart Notes',
        description: 'AI-powered structured note creation',
        capabilityId: 'cap-note-forge',
      },
      {
        id: 'fn-4',
        name: 'Summarize',
        description: 'Summarize documents and content',
        capabilityId: 'cap-note-forge',
      },
    ],
  },
  {
    id: 'cap-study-mate',
    name: 'StudyMate',
    description: 'Your personalized AI study companion',
    functions: [
      {
        id: 'fn-5',
        name: 'Quiz Me',
        description: 'Personalized quizzes from your material',
        capabilityId: 'cap-study-mate',
      },
      {
        id: 'fn-6',
        name: 'Explain',
        description: 'Explain concepts in simple language',
        capabilityId: 'cap-study-mate',
      },
      {
        id: 'fn-7',
        name: 'Flashcards',
        description: 'Auto-generate study flashcards',
        capabilityId: 'cap-study-mate',
      },
    ],
  },
];

// ==========================================
// EMOJI AVATARS FOR BOTS
// ==========================================

export const BOT_AVATAR_EMOJIS = [
  '🤖',
  '🧠',
  '✨',
  '🌟',
  '🎯',
  '🚀',
  '💡',
  '🎓',
  '📚',
  '🎤',
  '🦋',
  '🌈',
  '🔮',
  '⚡',
  '🌙',
  '🦁',
  '🐉',
  '🦄',
  '🌺',
  '🏆',
];
