import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const QUERY_KEYS = {
  // Auth
  user: ['user'] as const,
  session: ['session'] as const,

  // Voices
  voices: ['voices'] as const,
  voice: (id: string) => ['voice', id] as const,
  voiceSamples: (voiceId: string) => ['voice', voiceId, 'samples'] as const,

  // Conversations
  conversations: ['conversations'] as const,
  conversation: (id: string) => ['conversation', id] as const,
  messages: (conversationId: string) => ['conversation', conversationId, 'messages'] as const,
} as const;
