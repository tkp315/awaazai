export interface ElevenLabsConfig {
  apiKey: string;
  voiceClone: {
    maxSamples: number;
    minSampleDuration: number;
    maxSampleDuration: number;
  };
  tts: {
    modelId: string;
    stability: number;
    similarityBoost: number;
    style: number;
  };
}

async function elevenlabsConfig(): Promise<ElevenLabsConfig> {
  return {
    apiKey: process.env.ELEVENLABS_API_KEY || '',

    // Voice cloning settings
    voiceClone: {
      maxSamples: 5,
      minSampleDuration: 30, // 30 seconds minimum
      maxSampleDuration: 180, // 3 minutes max
    },

    // Text-to-Speech settings
    tts: {
      modelId: 'eleven_multilingual_v2',
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
    },
  };
}

export default elevenlabsConfig;
