 import { getPrisma } from
  '@lib/services/database/prisma/index.js';
import {MessageModel} from '../models/message.model.js';

  interface SaveMessageInput {
    chatId: string;
    sessionId: string;
    sentBy: 'user' | 'ai';
    messageContent: string;
    messageVoiceUrl?: string;
  }

  export const messageService = {

    saveMessage: async (input: SaveMessageInput) => {
      const message = await MessageModel.create({
        chatId: input.chatId,
        chatSession: input.sessionId,
        sentBy: input.sentBy,
        messageContent: input.messageContent,
        messageVoiceUrl: input.messageVoiceUrl ?? '',
        status: 'DELIVERED',
      });

      // Session ke messages[] array mein push karo
      const prisma = getPrisma();
      await prisma.session.update({
        where: { id: input.sessionId },
        data: {
          messages: { push: message._id.toString() },
        },
      });

      // Chat ka lastMessage update karo
      await prisma.chat.update({
        where: { id: input.chatId },
        data: { lastMessage: message._id.toString() },
      });

      return message;
    },

    updateMessageStatus: async (
      messageId: string,
      status: 'DELIVERED' | 'PENDING' | 'FAILED',
    ) => {
      return MessageModel.findByIdAndUpdate(messageId, { status
  }, { new: true });
    },
  };