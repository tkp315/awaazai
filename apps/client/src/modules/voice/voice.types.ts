export type VoiceStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
export type SampleStatus = 'UPLOADED' | 'PROCESSING' | 'TRANSCRIBED' | 'FAILED';

export interface ISampleVoice {
  id: string;
  url: string | null;
  status: SampleStatus;
  duration: number;
  transcription: string | null;
  sessionId: string;
  botVoiceId: string | null;
  createdAt: string;
}

export interface IBotVoice {
  id: string;
  voiceName: string | null;
  relation: string | null;
  status: VoiceStatus;
  language: string;
  slangs: string[];
  aiCallUserAs: string | null;
  generatedVoiceSample: string | null;
  elvenlabsVoiceId: string | null;
  aiObservations: Record<string, unknown> | null;
  sessionId: string;
  botId: string;
  sampleVoices: ISampleVoice[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoicePayload {
  voiceName: string;
  relation: string;
  language?: string;
  slangs?: string[];
  aiCallUserAs?: string;
  sessionId: string;
}
