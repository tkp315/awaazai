import { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/hooks';
import {
  useVoiceStore, LANGUAGE_OPTIONS, RELATION_SUGGESTIONS,
} from '@/modules/voice';
import type { ISampleVoice } from '@/modules/voice';
import { PaywallModal } from '@/components/ui/paywall';


// ─── Step 1: Upload Samples ──────────────────────────────────────────────────

function UploadStep({
  botId,
  sessionId,
  samples,
  onNext,
}: {
  botId: string;
  sessionId: string;
  samples: ISampleVoice[];
  onNext: () => void;
}): React.JSX.Element {
  const { colors, spacing, radius, textStyles, layout } = useTheme();
  const { isUploading, uploadSamples, deleteSample } = useVoiceStore();

  const pickAndUpload = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*'],
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;

    const files = result.assets.map(a => ({
      uri: a.uri,
      name: a.name,
      type: a.mimeType ?? 'audio/mpeg',
    }));

    await uploadSamples(sessionId, files);
  }, [sessionId, uploadSamples]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingBottom: spacing[8],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Info card */}
        <View
          style={{
            backgroundColor: colors.primary[50],
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.primary[200],
            padding: spacing[4],
            marginBottom: spacing[5],
            gap: spacing[2],
          }}
        >
          <Text style={{ ...textStyles.labelMedium, color: colors.primary[700] }}>
            Tips for best results
          </Text>
          {[
            'Upload 3–5 clear audio samples',
            'Each sample: 30 sec to 3 min',
            'Quiet background, natural speech',
            'Use mp3, wav, m4a, or webm',
          ].map(tip => (
            <View key={tip} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[2] }}>
              <Ionicons name="checkmark-circle" size={14} color={colors.primary[500]} style={{ marginTop: 2 }} />
              <Text style={{ ...textStyles.bodySmall, color: colors.primary[700], flex: 1 }}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Upload button */}
        <TouchableOpacity
          onPress={pickAndUpload}
          disabled={isUploading || samples.length >= 5}
          activeOpacity={0.8}
          style={{
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: samples.length >= 5 ? colors.border : colors.primary[300],
            borderRadius: radius.card,
            padding: spacing[6],
            alignItems: 'center',
            gap: spacing[2],
            marginBottom: spacing[4],
            backgroundColor: samples.length >= 5 ? colors.surfaceHover : colors.primary[50],
          }}
        >
          {isUploading ? (
            <ActivityIndicator color={colors.primary[500]} />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={32} color={colors.primary[500]} />
              <Text style={{ ...textStyles.labelMedium, color: colors.primary[600] }}>
                {samples.length >= 5 ? 'Max 5 samples reached' : 'Tap to upload audio files'}
              </Text>
              <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                {samples.length}/5 uploaded
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Uploaded samples list */}
        {samples.map((s, i) => (
          <View
            key={s.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[3],
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[3],
              marginBottom: spacing[2],
            }}
          >
            <View
              style={{
                width: spacing[10],
                height: spacing[10],
                borderRadius: radius.avatar,
                backgroundColor: '#ecfdf5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="musical-note" size={18} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...textStyles.labelSmall, color: colors.text }}>
                Sample {i + 1}
              </Text>
              <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                {s.duration}s · Uploaded
              </Text>
            </View>
            <TouchableOpacity onPress={() => deleteSample(s.id)} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={18} color={colors.error.main} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Next button */}
      <View
        style={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingVertical: spacing[4],
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <TouchableOpacity
          onPress={onNext}
          disabled={samples.length === 0}
          activeOpacity={0.8}
          style={{
            backgroundColor: samples.length === 0 ? colors.border : colors.primary[500],
            borderRadius: radius.button,
            paddingVertical: spacing[4],
            alignItems: 'center',
          }}
        >
          <Text style={{ ...textStyles.labelLarge, color: '#fff' }}>
            Next — Set Voice Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step 2: Voice Metadata ──────────────────────────────────────────────────

function MetadataStep({
  botId,
  sessionId,
  onBack,
}: {
  botId: string;
  sessionId: string;
  onBack: () => void;
}): React.JSX.Element {
  const { colors, spacing, radius, textStyles, layout } = useTheme();
  const router = useRouter();
  const { createVoice, isCreating, limitReached, clearLimitReached } = useVoiceStore();

  const [voiceName, setVoiceName] = useState('');
  const [relation, setRelation] = useState('');
  const [language, setLanguage] = useState('hi');
  const [aiCallUserAs, setAiCallUserAs] = useState('');
  const [slangInput, setSlangInput] = useState('');
  const [slangs, setSlangs] = useState<string[]>([]);

  const addSlang = (): void => {
    const s = slangInput.trim();
    if (s && slangs.length < 20 && !slangs.includes(s)) {
      setSlangs(prev => [...prev, s]);
      setSlangInput('');
    }
  };

  const handleCreate = async (): Promise<void> => {
    if (!voiceName.trim() || !relation.trim()) {
      Alert.alert('Required', 'Voice name and relation are required.');
      return;
    }
    const voice = await createVoice(botId, {
      voiceName: voiceName.trim(),
      relation: relation.trim(),
      language,
      slangs,
      aiCallUserAs: aiCallUserAs.trim() || undefined,
      sessionId,
    });
    if (voice) {
      Alert.alert(
        'Cloning Started!',
        'Your voice is being processed. We\'ll have it ready soon.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/voices') }]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PaywallModal
        visible={limitReached}
        limitKey="VOICE_CLONES"
        onClose={clearLimitReached}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingBottom: spacing[8],
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Voice Name */}
        <Text style={{ ...textStyles.labelMedium, color: colors.text, marginBottom: spacing[2] }}>
          Voice Name *
        </Text>
        <TextInput
          value={voiceName}
          onChangeText={setVoiceName}
          placeholder="e.g. Mom's Voice"
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.input,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            ...textStyles.bodyMedium,
            color: colors.text,
            marginBottom: spacing[5],
          }}
        />

        {/* Relation */}
        <Text style={{ ...textStyles.labelMedium, color: colors.text, marginBottom: spacing[2] }}>
          Relation *
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[3] }}>
          {RELATION_SUGGESTIONS.map(r => (
            <TouchableOpacity
              key={r}
              onPress={() => setRelation(r)}
              activeOpacity={0.8}
              style={{
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1.5],
                borderRadius: radius.badge,
                backgroundColor: relation === r ? colors.primary[500] : colors.surface,
                borderWidth: 1,
                borderColor: relation === r ? colors.primary[500] : colors.border,
              }}
            >
              <Text
                style={{
                  ...textStyles.caption,
                  color: relation === r ? '#fff' : colors.text,
                  fontWeight: '600',
                }}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          value={relation}
          onChangeText={setRelation}
          placeholder="Or type custom relation"
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.input,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            ...textStyles.bodyMedium,
            color: colors.text,
            marginBottom: spacing[5],
          }}
        />

        {/* Language */}
        <Text style={{ ...textStyles.labelMedium, color: colors.text, marginBottom: spacing[2] }}>
          Primary Language
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[5] }}>
          {LANGUAGE_OPTIONS.map(l => (
            <TouchableOpacity
              key={l.value}
              onPress={() => setLanguage(l.value)}
              activeOpacity={0.8}
              style={{
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1.5],
                borderRadius: radius.badge,
                backgroundColor: language === l.value ? colors.primary[500] : colors.surface,
                borderWidth: 1,
                borderColor: language === l.value ? colors.primary[500] : colors.border,
              }}
            >
              <Text
                style={{
                  ...textStyles.caption,
                  color: language === l.value ? '#fff' : colors.text,
                  fontWeight: '600',
                }}
              >
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Call User As */}
        <Text style={{ ...textStyles.labelMedium, color: colors.text, marginBottom: spacing[1] }}>
          AI calls you as
        </Text>
        <Text style={{ ...textStyles.caption, color: colors.textMuted, marginBottom: spacing[2] }}>
          What did this person call you? (e.g. beta, bhai, bro)
        </Text>
        <TextInput
          value={aiCallUserAs}
          onChangeText={setAiCallUserAs}
          placeholder="e.g. beta, dear, bhai"
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.input,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            ...textStyles.bodyMedium,
            color: colors.text,
            marginBottom: spacing[5],
          }}
        />

        {/* Slangs */}
        <Text style={{ ...textStyles.labelMedium, color: colors.text, marginBottom: spacing[1] }}>
          Common slangs / words
        </Text>
        <Text style={{ ...textStyles.caption, color: colors.textMuted, marginBottom: spacing[2] }}>
          Words this person often used (optional)
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: spacing[2],
            marginBottom: spacing[3],
          }}
        >
          <TextInput
            value={slangInput}
            onChangeText={setSlangInput}
            onSubmitEditing={addSlang}
            placeholder="Type and press Add"
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: radius.input,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              ...textStyles.bodyMedium,
              color: colors.text,
            }}
          />
          <TouchableOpacity
            onPress={addSlang}
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.primary[500],
              borderRadius: radius.button,
              paddingHorizontal: spacing[4],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...textStyles.labelSmall, color: '#fff' }}>Add</Text>
          </TouchableOpacity>
        </View>

        {slangs.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[5] }}>
            {slangs.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => setSlangs(prev => prev.filter(x => x !== s))}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[1],
                  paddingHorizontal: spacing[2.5],
                  paddingVertical: spacing[1],
                  borderRadius: radius.badge,
                  backgroundColor: colors.primary[50],
                  borderWidth: 1,
                  borderColor: colors.primary[200],
                }}
              >
                <Text style={{ ...textStyles.caption, color: colors.primary[600], fontWeight: '600' }}>{s}</Text>
                <Ionicons name="close" size={12} color={colors.primary[400]} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      <View
        style={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingVertical: spacing[4],
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          flexDirection: 'row',
          gap: spacing[3],
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.8}
          style={{
            flex: 1,
            borderRadius: radius.button,
            paddingVertical: spacing[4],
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colors.border,
          }}
        >
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={isCreating}
          activeOpacity={0.8}
          style={{
            flex: 2,
            borderRadius: radius.button,
            paddingVertical: spacing[4],
            alignItems: 'center',
            backgroundColor: colors.primary[500],
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing[2],
          }}
        >
          {isCreating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="mic" size={18} color="#fff" />
              <Text style={{ ...textStyles.labelLarge, color: '#fff' }}>Start Cloning</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function CreateVoiceScreen(): React.JSX.Element {
  const { colors, spacing, layout, textStyles, radius } = useTheme();
  const router = useRouter();
  const { botId } = useLocalSearchParams<{ botId: string }>();
  const { samples, clearSamples } = useVoiceStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const STEPS = ['Upload Samples', 'Voice Details'];

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
          onPress={() => {
            clearSamples();
            router.back();
          }}
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
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ ...textStyles.h4, color: colors.text, flex: 1, marginLeft: spacing[3] }}>
          Clone a Voice
        </Text>
      </View>

      {/* Step indicator */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingVertical: spacing[4],
          gap: spacing[3],
          alignItems: 'center',
        }}
      >
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const active = step === idx;
          const done = step > idx;
          return (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <View
                  style={{
                    width: spacing[7],
                    height: spacing[7],
                    borderRadius: spacing[3.5],
                    backgroundColor: done || active ? colors.primary[500] : colors.surface,
                    borderWidth: 1.5,
                    borderColor: done || active ? colors.primary[500] : colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {done ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <Text style={{ ...textStyles.caption, color: active ? '#fff' : colors.textMuted, fontWeight: '700' }}>
                      {idx}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    ...textStyles.caption,
                    color: active ? colors.primary[600] : colors.textMuted,
                    fontWeight: active ? '700' : '400',
                  }}
                >
                  {label}
                </Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={{ flex: 1, height: 1.5, backgroundColor: done ? colors.primary[300] : colors.border, marginLeft: spacing[2] }} />
              )}
            </View>
          );
        })}
      </View>

      {step === 1 ? (
        <UploadStep botId={botId} sessionId={sessionId} samples={samples} onNext={() => setStep(2)} />
      ) : (
        <MetadataStep botId={botId} sessionId={sessionId} onBack={() => setStep(1)} />
      )}
    </SafeAreaView>
  );
}
