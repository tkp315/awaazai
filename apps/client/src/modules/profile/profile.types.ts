export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type TalkType = 'CASUAL' | 'FORMAL' | 'FRIENDLY' | 'MOTIVATIONAL' | 'STORYTELLING';
export type TalkingTone = 'CALM' | 'WARM' | 'ENERGETIC' | 'SERIOUS' | 'HUMOROUS';
export type Emotion = 'HAPPY' | 'NEUTRAL' | 'EMPATHETIC' | 'ENCOURAGING' | 'RELAXED';
export type ResponseLength = 'SHORT' | 'MEDIUM' | 'DETAILED';
export type VoiceSpeed = 'SLOW' | 'NORMAL' | 'FAST';

export interface IProfile {
  id: string;
  age: number | null;
  gender: Gender;
  avatar: string | null;
  totalPlansPurchased: number;
}

export interface IPreferences {
  id: string;
  talkType: TalkType;
  talkingTone: TalkingTone;
  emotion: Emotion;
  responseLength: ResponseLength;
  preferredLanguage: string;
  voiceSpeed: VoiceSpeed;
  topicsOfInterest: string[];
  avoidTopics: string[];
  reminderEnabled: boolean;
  reminderTime: string | null;
  dailyGoalMinutes: number | null;
}

export interface IMe {
  id: string;
  fullName: string | null;
  email: string;
  isVerified: boolean;
  userStatus: string;
  accountType: string;
  createdAt: string;
  profile: IProfile | null;
}

export interface UpdateProfilePayload {
  gender?: Gender;
  age?: number;
}

export interface UpsertPreferencesPayload {
  talkType?: TalkType;
  talkingTone?: TalkingTone;
  emotion?: Emotion;
  responseLength?: ResponseLength;
  preferredLanguage?: string;
  voiceSpeed?: VoiceSpeed;
  topicsOfInterest?: string[];
  avoidTopics?: string[];
  reminderEnabled?: boolean;
  reminderTime?: string;
  dailyGoalMinutes?: number;
}
