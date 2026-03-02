import { QueryClient } from '@tanstack/react-query';

// ============================================
// QUERY client
// ============================================

export const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ============================================
// QUERY KEYS
// ============================================

export const QUERY_KEYS = {
  // Auth
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },

  // User
  user: {
    profile: ['user', 'profile'],
  },

  // Bots
  bots: {
    all: ['bots'],
    list: (filters?: Record<string, unknown>) => ['bots', 'list', filters],
    detail: (id: string) => ['bots', 'detail', id],
  },

  // Voices
  voices: {
    all: ['voices'],
    list: (filters?: Record<string, unknown>) => ['voices', 'list', filters],
    detail: (id: string) => ['voices', 'detail', id],
    samples: (voiceId: string) => ['voices', voiceId, 'samples'],
  },

  // Chats
  chats: {
    all: ['chats'],
    list: (filters?: Record<string, unknown>) => ['chats', 'list', filters],
    detail: (id: string) => ['chats', 'detail', id],
    messages: (chatId: string) => ['chats', chatId, 'messages'],
  },

  // Subscription
  subscription: {
    plans: ['subscription', 'plans'],
    current: ['subscription', 'current'],
    usage: ['subscription', 'usage'],
    invoices: ['subscription', 'invoices'],
  },

  // Notifications
  notifications: {
    all: ['notifications'],
    list: (filters?: Record<string, unknown>) => ['notifications', 'list', filters],
    unreadCount: ['notifications', 'unread-count'],
  },
} as const;
