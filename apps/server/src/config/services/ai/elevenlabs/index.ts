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
    speed: number;
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
      modelId: 'eleven_turbo_v2_5',
      stability: 0.3, // kam = zyada natural variation, pauses, emotion
      similarityBoost: 0.85, // cloned voice ke zyada close
      style: 0.6, // expressive delivery
      speed: 0.85, // thoda slow — 1.0 default, 0.7 min, 1.2 max
    },
  };
}

export default elevenlabsConfig;
