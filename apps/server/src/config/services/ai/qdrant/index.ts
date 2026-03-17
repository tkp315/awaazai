export interface QdrantConfig {
  endpoint: string;
  apiKey: string;
  collections: {
    botKnowledge: string;
  };
}

async function qdrantConfig(): Promise<QdrantConfig> {
  return {
    endpoint: process.env.QDRANT_DB_ENDPOINT || '',
    apiKey: process.env.QDRANT_DB_API_KEY || '',
    collections: {
      botKnowledge: 'bot_knowledge',
    },
  };
}

export default qdrantConfig;
