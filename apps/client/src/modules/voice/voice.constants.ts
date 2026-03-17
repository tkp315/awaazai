import type { VoiceStatus, SampleStatus } from './voice.types';

export const VOICE_STATUS_DISPLAY: Record<
  VoiceStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  PENDING: { label: 'Pending', color: '#d97706', bg: '#fffbeb', icon: 'time-outline' },
  PROCESSING: { label: 'Processing', color: '#6366f1', bg: '#eef2ff', icon: 'sync-outline' },
  READY: { label: 'Ready', color: '#059669', bg: '#ecfdf5', icon: 'checkmark-circle-outline' },
  FAILED: { label: 'Failed', color: '#dc2626', bg: '#fff1f2', icon: 'close-circle-outline' },
};

export const SAMPLE_STATUS_DISPLAY: Record<SampleStatus, { label: string; color: string }> = {
  UPLOADED: { label: 'Uploaded', color: '#6b7280' },
  PROCESSING: { label: 'Processing', color: '#6366f1' },
  TRANSCRIBED: { label: 'Transcribed', color: '#059669' },
  FAILED: { label: 'Failed', color: '#dc2626' },
};

export const LANGUAGE_OPTIONS = [
  { label: 'Hindi', value: 'hi' },
  { label: 'English', value: 'en' },
  { label: 'Hinglish', value: 'hi-en' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Marathi', value: 'mr' },
];

export const RELATION_SUGGESTIONS = [
  'Mom',
  'Dad',
  'Brother',
  'Sister',
  'Best Friend',
  'Grandma',
  'Grandpa',
  'Partner',
  'Friend',
  'Mentor',
];
