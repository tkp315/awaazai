import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

interface MessageSchema extends Document {
  messageContent: string;
  title: string;
  sentBy: string; //  user , ai
  sentAt: Date;
  messageVoiceUrl: string;
  chatId: string;
  chatSession: string;
  status: 'DELIVERED' | 'PENDING' | 'FAILED';
}
const messageSchema: Schema<MessageSchema> = new Schema(
  {
    messageContent: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    sentBy: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    messageVoiceUrl: {
      type: String,
    },
    chatId: {
      type: String,
      required: true,
      index: true,
    },
    chatSession: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['DELIVERED', 'PENDING', 'FAILED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<MessageSchema>('Message', messageSchema);
