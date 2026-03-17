import { getPrisma } from '@lib/services/database/prisma/index.js';
import { Document } from '@langchain/core/documents';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';
import { getLogger } from '@lib/helper/logger/index.js';
import { getClient as getOpenAI } from '@lib/services/ai/openai/client.js';
import { getClient as getQdrantClient } from '@lib/services/ai/qdrant/client.js';
import { downloadFile, deleteTempFile } from '@lib/services/cloudinary/index.js';
import fs from 'fs';

export interface TrainingJobData {
  trainingId: string;
  botId: string;
  capabilityId?: string;
}

const COLLECTION_NAME = 'bot_knowledge';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

const updateTrainingStatus = async (
  trainingId: string,
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED',
  progress?: number
) => {
  const prisma = getPrisma();
  await prisma.botTraining.update({
    where: { id: trainingId },
    data: {
      status,
      ...(progress !== undefined ? { progress } : {}),
    },
  });
};

const getRawDocs = async (knowledge: {
  id: string;
  type: string;
  content: string | null;
  sourceUrl: string | null;
}): Promise<Document[]> => {
  if (knowledge.type === 'NOTE') {
    return [new Document({ pageContent: knowledge.content ?? '' })];

  } else if (knowledge.type === 'URL') {
    const loader = new CheerioWebBaseLoader(knowledge.sourceUrl!);
    return await loader.load();

  } else if (knowledge.type === 'DOCUMENT') {
    const tempPath = await downloadFile(knowledge.sourceUrl!, knowledge.id);
    try {
      const loader = new PDFLoader(tempPath);
      return await loader.load();
    } finally {
      await deleteTempFile(tempPath);
    }

  } else if (knowledge.type === 'AUDIO') {
    const tempPath = await downloadFile(knowledge.sourceUrl!, knowledge.id);
    try {
      const openai = getOpenAI();
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: 'whisper-1',
      });
      return [new Document({ pageContent: transcription.text })];
    } finally {
      await deleteTempFile(tempPath);
    }

  } else if (knowledge.type === 'IMAGE') {
    // GPT-4o can read from URL directly — no download needed
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract and describe all the text, information, and content from this image in detail. Include any handwriting and every minute detail that helps with a personalised user experience.',
          },
          {
            type: 'image_url',
            image_url: { url: knowledge.sourceUrl! },
          },
        ],
      }],
    });
    const description = response.choices[0].message.content ?? '';
    return [new Document({ pageContent: description })];

  } else if (knowledge.type === 'FAQ') {
    const faqs = JSON.parse(knowledge.content ?? '[]') as { q: string; a: string }[];
    return faqs.map(faq => new Document({ pageContent: `Q: ${faq.q}\nA: ${faq.a}` }));
  }

  return [];
};

// ─── Main Processor ──────────────────────────────────────────────────────────

export const processTraining = async (data: TrainingJobData): Promise<void> => {
  const prisma = getPrisma();
  const logger = getLogger();
  const { botId, trainingId, capabilityId } = data;

  await updateTrainingStatus(trainingId, 'PROCESSING', 0);

  try {
    const bot = await prisma.bot.findUnique({ where: { id: botId } });
    if (!bot) throw new Error(`Bot ${botId} not found`);

    const knowledgeList = await prisma.botKnowledge.findMany({
      where: {
        botId,
        status: 'PENDING',
        ...(capabilityId ? { capabilityId } : {}),
      },
    });

    if (knowledgeList.length === 0) {
      await updateTrainingStatus(trainingId, 'COMPLETED', 100);
      return;
    }

    const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });
    const qdrantClient = getQdrantClient();

    for (let i = 0; i < knowledgeList.length; i++) {
      const knowledge = knowledgeList[i];

      try {
        const rawDocs = await getRawDocs(knowledge);

        const chunks = await splitter.splitDocuments(rawDocs);

        const chunksWithMeta = chunks.map((chunk, idx) =>
          new Document({
            pageContent: chunk.pageContent,
            metadata: {
              botId,
              userId: bot.userId,
              knowledgeId: knowledge.id,
              type: knowledge.type,
              title: knowledge.title,
              chunkIndex: idx,
            },
          })
        );

        await QdrantVectorStore.fromDocuments(chunksWithMeta, embeddings, {
          client: qdrantClient,
          collectionName: COLLECTION_NAME,
        });

        // Mark this knowledge item as processed
        await prisma.botKnowledge.update({
          where: { id: knowledge.id },
          data: { status: 'PROCESSED' },
        });

        const progress = Math.round(((i + 1) / knowledgeList.length) * 100);
        await updateTrainingStatus(trainingId, 'PROCESSING', progress);

        logger.info(`Processed knowledge ${knowledge.id}`, {
          type: knowledge.type,
          chunks: chunks.length,
        });

      } catch (err) {
        // Single item failed — mark it, continue with rest
        await prisma.botKnowledge.update({
          where: { id: knowledge.id },
          data: { status: 'FAILED' },
        });
        logger.error(`Failed to process knowledge ${knowledge.id}`, { error: err });
      }
    }

    // All items done — mark training complete
    await updateTrainingStatus(trainingId, 'COMPLETED', 100);
  } catch (err) {
    await updateTrainingStatus(trainingId, 'FAILED', 0);
    throw err; // BullMQ retry ke liye
  }
};
