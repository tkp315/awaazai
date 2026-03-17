import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks';
import { useProfileStore, upsertPreferences } from '@/modules/profile';
import { toast } from '@/components/ui/toast';
import type { TalkType, TalkingTone, Emotion, ResponseLength, VoiceSpeed } from '@/modules/profile';

// ─── option maps ────────────────────────────────────────────────────────────

const TALK_TYPE: { label: string; value: TalkType; desc: string }[] = [
  { label: 'Casual', value: 'CASUAL', desc: 'Chill baatein' },
  { label: 'Formal', value: 'FORMAL', desc: 'Professional' },
  { label: 'Friendly', value: 'FRIENDLY', desc: 'Dost jaisa' },
  { label: 'Motivational', value: 'MOTIVATIONAL', desc: 'Pumped up' },
  { label: 'Storytelling', value: 'STORYTELLING', desc: 'Kahaniya' },
];

const TALKING_TONE: { label: string; value: TalkingTone }[] = [
  { label: 'Calm', value: 'CALM' },
  { label: 'Warm', value: 'WARM' },
  { label: 'Energetic', value: 'ENERGETIC' },
  { label: 'Serious', value: 'SERIOUS' },
  { label: 'Humorous', value: 'HUMOROUS' },
];

const EMOTIONS: { label: string; value: Emotion }[] = [
  { label: 'Happy', value: 'HAPPY' },
  { label: 'Neutral', value: 'NEUTRAL' },
  { label: 'Empathetic', value: 'EMPATHETIC' },
  { label: 'Encouraging', value: 'ENCOURAGING' },
  { label: 'Relaxed', value: 'RELAXED' },
];

const RESPONSE_LENGTHS: { label: string; value: ResponseLength; desc: string }[] = [
  { label: 'Short', value: 'SHORT', desc: '1-2 lines' },
  { label: 'Medium', value: 'MEDIUM', desc: '3-5 lines' },
  { label: 'Detailed', value: 'DETAILED', desc: 'Full explanation' },
];

const VOICE_SPEEDS: { label: string; value: VoiceSpeed }[] = [
  { label: 'Slow', value: 'SLOW' },
  { label: 'Normal', value: 'NORMAL' },
  { label: 'Fast', value: 'FAST' },
];

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hinglish', value: 'hinglish' },
];

// ─── chip component ──────────────────────────────────────────────────────────

function Chip({
  label,
  desc,
  selected,
  onPress,
}: {
  label: string;
  desc?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, radius, textStyles } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: radius.chip,
        borderWidth: 1,
        borderColor: selected ? colors.primary[500] : colors.border,
        backgroundColor: selected ? colors.primary[50] : colors.surface,
        marginRight: spacing[2],
        marginBottom: spacing[2],
      }}
    >
      <Text
        style={{
          ...textStyles.labelSmall,
          color: selected ? colors.primary[600] : colors.textMuted,
        }}
      >
        {label}
      </Text>
      {desc ? (
        <Text
          style={{
            ...textStyles.caption,
            color: selected ? colors.primary[400] : colors.border,
            marginTop: 1,
          }}
        >
          {desc}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors, spacing, textStyles } = useTheme();
  return (
    <View style={{ gap: spacing[2] }}>
      <Text style={{ ...textStyles.labelMedium, color: colors.text }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{children}</View>
    </View>
  );
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function VoicePreferencesScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { preferences, fetchPreferences } = useProfileStore();

  const [talkType, setTalkType] = useState<TalkType>(preferences?.talkType ?? 'FRIENDLY');
  const [talkingTone, setTalkingTone] = useState<TalkingTone>(preferences?.talkingTone ?? 'WARM');
  const [emotion, setEmotion] = useState<Emotion>(preferences?.emotion ?? 'NEUTRAL');
  const [responseLength, setResponseLength] = useState<ResponseLength>(
    preferences?.responseLength ?? 'MEDIUM'
  );
  const [voiceSpeed, setVoiceSpeed] = useState<VoiceSpeed>(preferences?.voiceSpeed ?? 'NORMAL');
  const [language, setLanguage] = useState(preferences?.preferredLanguage ?? 'en');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await upsertPreferences({
      talkType,
      talkingTone,
      emotion,
      responseLength,
      voiceSpeed,
      preferredLanguage: language,
    });
    setIsSaving(false);

    if (result.success) {
      await fetchPreferences();
      toast.success('Voice preferences saved');
      router.back();
    } else {
      toast.error(result.message || 'Failed to save preferences');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingVertical: spacing[4],
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: spacing[10],
            height: spacing[10],
            borderRadius: radius.avatar,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="arrow-back" size={layout.iconMedium} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ ...textStyles.h4, color: colors.text, marginLeft: spacing[3] }}>
          Voice Preferences
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[6],
          paddingBottom: spacing[10],
          gap: spacing[6],
        }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Talk Type">
          {TALK_TYPE.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              desc={opt.desc}
              selected={talkType === opt.value}
              onPress={() => setTalkType(opt.value)}
            />
          ))}
        </Section>

        <Section title="Talking Tone">
          {TALKING_TONE.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={talkingTone === opt.value}
              onPress={() => setTalkingTone(opt.value)}
            />
          ))}
        </Section>

        <Section title="Emotion">
          {EMOTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={emotion === opt.value}
              onPress={() => setEmotion(opt.value)}
            />
          ))}
        </Section>

        <Section title="Response Length">
          {RESPONSE_LENGTHS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              desc={opt.desc}
              selected={responseLength === opt.value}
              onPress={() => setResponseLength(opt.value)}
            />
          ))}
        </Section>

        <Section title="Voice Speed">
          {VOICE_SPEEDS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={voiceSpeed === opt.value}
              onPress={() => setVoiceSpeed(opt.value)}
            />
          ))}
        </Section>

        <Section title="Language">
          {LANGUAGES.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={language === opt.value}
              onPress={() => setLanguage(opt.value)}
            />
          ))}
        </Section>

        {/* Save */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.85}
          style={{
            backgroundColor: isSaving ? colors.primary[300] : colors.primary[500],
            borderRadius: radius.button,
            height: layout.buttonHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
              Save Preferences
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
