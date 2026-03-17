import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useTheme } from '@/hooks';
import { useVoiceStore, VOICE_STATUS_DISPLAY, SAMPLE_STATUS_DISPLAY } from '@/modules/voice';
import type { IBotVoice } from '@/modules/voice';

function StatusBadge({ status }: { status: IBotVoice['status'] }): React.JSX.Element {
  const { textStyles, spacing, radius } = useTheme();
  const d = VOICE_STATUS_DISPLAY[status];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1.5],
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: radius.badge,
        backgroundColor: d.bg,
        alignSelf: 'flex-start',
      }}
    >
      <Ionicons name={d.icon as any} size={14} color={d.color} />
      <Text style={{ ...textStyles.caption, color: d.color, fontWeight: '700' }}>{d.label}</Text>
    </View>
  );
}

export default function VoiceDetailScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { botId, voiceId } = useLocalSearchParams<{ botId: string; voiceId: string }>();
  const { voices, fetchVoices, deleteVoice, retryCloning } = useVoiceStore();
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (botId) fetchVoices(botId);
  }, [botId]);

  // Poll every 5s while cloning is in progress
  useEffect(() => {
    if (!voice || voice.status === 'READY' || voice.status === 'FAILED') return;
    const interval = setInterval(() => {
      if (botId) fetchVoices(botId);
    }, 5000);
    return () => clearInterval(interval);
  }, [voice?.status, botId]);

  const voice = voices.find(v => v.id === voiceId);

  const handlePlayPreview = async (): Promise<void> => {
    if (!voice?.generatedVoiceSample) return;

    if (isPlaying) {
      await soundRef.current?.pauseAsync();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      if (soundRef.current) {
        await soundRef.current.playAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          { uri: voice.generatedVoiceSample },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
      setIsPlaying(true);
    } catch {
      Alert.alert('Error', 'Could not play the audio preview.');
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleDelete = (): void => {
    Alert.alert(
      'Delete Voice',
      `Delete "${voice?.voiceName ?? 'this voice'}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await deleteVoice(voiceId);
            setLoading(false);
            router.back();
          },
        },
      ]
    );
  };

  const handleRetry = async (): Promise<void> => {
    setLoading(true);
    await retryCloning(voiceId);
    setLoading(false);
    Alert.alert('Retry started', 'Cloning has been re-queued.');
    if (botId) fetchVoices(botId);
  };

  if (!voice) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  const statusDisplay = VOICE_STATUS_DISPLAY[voice.status];
  const observations = voice.aiObservations as Record<string, unknown> | null;

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
          Voice Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[5],
          paddingBottom: spacing[10],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing[5],
            alignItems: 'center',
            marginBottom: spacing[5],
            gap: spacing[3],
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: spacing[20],
              height: spacing[20],
              borderRadius: radius.avatar,
              backgroundColor: statusDisplay.bg,
              borderWidth: 2,
              borderColor: statusDisplay.color + '40',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 44 }}>🎙️</Text>
          </View>

          <Text style={{ ...textStyles.h3, color: colors.text }}>
            {voice.voiceName ?? 'Unnamed Voice'}
          </Text>

          <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>
            {voice.relation ?? '—'} · {voice.language.toUpperCase()}
          </Text>

          <StatusBadge status={voice.status} />

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: spacing[2],
              paddingTop: spacing[4],
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            {[
              { label: 'Samples', value: voice.sampleVoices.length },
              { label: 'Language', value: voice.language.toUpperCase() },
              { label: 'Slangs', value: voice.slangs.length },
            ].map((s, i) => (
              <View
                key={s.label}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderRightWidth: i < 2 ? 1 : 0,
                  borderRightColor: colors.border,
                }}
              >
                <Text style={{ ...textStyles.labelLarge, color: colors.primary[500] }}>
                  {s.value}
                </Text>
                <Text style={{ ...textStyles.caption, color: colors.textMuted }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* READY: Preview + AI Insights */}
        {voice.status === 'READY' && (
          <>
            {/* Voice preview */}
            {voice.generatedVoiceSample && (
              <TouchableOpacity
                onPress={handlePlayPreview}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#ecfdf5',
                  borderRadius: radius.card,
                  borderWidth: 1,
                  borderColor: '#a7f3d0',
                  padding: spacing[4],
                  marginBottom: spacing[4],
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[3],
                }}
              >
                {isLoadingAudio ? (
                  <ActivityIndicator size={40} color="#059669" />
                ) : (
                  <Ionicons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={40}
                    color="#059669"
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ ...textStyles.labelMedium, color: '#065f46' }}>Voice Preview</Text>
                  <Text style={{ ...textStyles.caption, color: '#059669' }}>
                    {isPlaying ? 'Playing...' : 'Tap to play the generated sample'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* AI Observations */}
            {observations && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radius.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing[4],
                  marginBottom: spacing[4],
                  gap: spacing[3],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <Ionicons name="sparkles" size={18} color={colors.primary[500]} />
                  <Text style={{ ...textStyles.labelLarge, color: colors.text }}>AI Insights</Text>
                </View>

                {[
                  { key: 'tone', label: 'Tone' },
                  { key: 'speakingStyle', label: 'Speaking Style' },
                  { key: 'personality', label: 'Personality' },
                  { key: 'languageNotes', label: 'Language Notes' },
                ].map(item => {
                  const val = observations[item.key];
                  if (!val) return null;
                  return (
                    <View key={item.key}>
                      <Text
                        style={{
                          ...textStyles.caption,
                          color: colors.textMuted,
                          fontWeight: '600',
                          marginBottom: 2,
                        }}
                      >
                        {item.label}
                      </Text>
                      <Text style={{ ...textStyles.bodySmall, color: colors.text }}>
                        {String(val)}
                      </Text>
                    </View>
                  );
                })}

                {Array.isArray(observations.commonPhrases) &&
                  observations.commonPhrases.length > 0 && (
                    <View>
                      <Text
                        style={{
                          ...textStyles.caption,
                          color: colors.textMuted,
                          fontWeight: '600',
                          marginBottom: spacing[2],
                        }}
                      >
                        Common Phrases
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                        {(observations.commonPhrases as string[]).map(p => (
                          <View
                            key={p}
                            style={{
                              paddingHorizontal: spacing[2.5],
                              paddingVertical: spacing[1],
                              borderRadius: radius.badge,
                              backgroundColor: colors.primary[50],
                              borderWidth: 1,
                              borderColor: colors.primary[200],
                            }}
                          >
                            <Text style={{ ...textStyles.caption, color: colors.primary[600] }}>
                              "{p}"
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
              </View>
            )}
          </>
        )}

        {/* FAILED: Retry */}
        {voice.status === 'FAILED' && (
          <TouchableOpacity
            onPress={handleRetry}
            disabled={loading}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#fff1f2',
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: '#fecdd3',
              padding: spacing[4],
              marginBottom: spacing[4],
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[3],
            }}
          >
            {loading ? (
              <ActivityIndicator color="#dc2626" />
            ) : (
              <Ionicons name="refresh-circle" size={28} color="#dc2626" />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ ...textStyles.labelMedium, color: '#dc2626' }}>Cloning Failed</Text>
              <Text style={{ ...textStyles.caption, color: '#f87171' }}>Tap to retry</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#f87171" />
          </TouchableOpacity>
        )}

        {/* PROCESSING / PENDING: Progress indicator */}
        {(voice.status === 'PROCESSING' || voice.status === 'PENDING') && (
          <View
            style={{
              backgroundColor: '#eef2ff',
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: '#c7d2fe',
              padding: spacing[4],
              marginBottom: spacing[4],
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[3],
            }}
          >
            <ActivityIndicator color="#6366f1" />
            <View style={{ flex: 1 }}>
              <Text style={{ ...textStyles.labelMedium, color: '#4338ca' }}>
                {voice.status === 'PENDING' ? 'Waiting to start...' : 'Cloning in progress...'}
              </Text>
              <Text style={{ ...textStyles.caption, color: '#6366f1' }}>
                This usually takes 1–3 minutes
              </Text>
            </View>
          </View>
        )}

        {/* Samples Section */}
        <Text style={{ ...textStyles.labelLarge, color: colors.text, marginBottom: spacing[3] }}>
          Voice Samples ({voice.sampleVoices.length})
        </Text>

        {voice.sampleVoices.map((s, i) => {
          const sd = SAMPLE_STATUS_DISPLAY[s.status];
          return (
            <View
              key={s.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radius.card,
                borderWidth: 1,
                borderColor: colors.border,
                padding: spacing[4],
                marginBottom: spacing[2],
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: spacing[3],
              }}
            >
              <View
                style={{
                  width: spacing[10],
                  height: spacing[10],
                  borderRadius: radius.avatar,
                  backgroundColor: colors.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="musical-note" size={18} color={colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ ...textStyles.labelSmall, color: colors.text }}>
                    Sample {i + 1} · {s.duration}s
                  </Text>
                  <Text style={{ ...textStyles.caption, color: sd.color, fontWeight: '600' }}>
                    {sd.label}
                  </Text>
                </View>
                {s.transcription && (
                  <Text
                    style={{
                      ...textStyles.caption,
                      color: colors.textMuted,
                      marginTop: spacing[1],
                    }}
                    numberOfLines={2}
                  >
                    "{s.transcription}"
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        {/* Slangs */}
        {voice.slangs.length > 0 && (
          <>
            <Text
              style={{
                ...textStyles.labelLarge,
                color: colors.text,
                marginTop: spacing[2],
                marginBottom: spacing[3],
              }}
            >
              Slangs / Keywords
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing[2],
                marginBottom: spacing[4],
              }}
            >
              {voice.slangs.map(s => (
                <View
                  key={s}
                  style={{
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[1],
                    borderRadius: radius.badge,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ ...textStyles.caption, color: colors.text }}>{s}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* aiCallUserAs */}
        {voice.aiCallUserAs && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[4],
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[3],
              marginBottom: spacing[5],
            }}
          >
            <Ionicons name="person-outline" size={20} color={colors.textMuted} />
            <View>
              <Text style={{ ...textStyles.caption, color: colors.textMuted }}>Calls you as</Text>
              <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
                {voice.aiCallUserAs}
              </Text>
            </View>
          </View>
        )}

        {/* Danger Zone */}
        <View
          style={{
            backgroundColor: '#fff1f2',
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: '#fecdd3',
          }}
        >
          <TouchableOpacity
            onPress={handleDelete}
            disabled={loading}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: spacing[4],
              gap: spacing[3],
            }}
          >
            <View
              style={{
                width: spacing[10],
                height: spacing[10],
                borderRadius: radius.button,
                backgroundColor: '#fee2e2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#dc2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...textStyles.labelMedium, color: '#dc2626' }}>Delete Voice</Text>
              <Text style={{ ...textStyles.caption, color: '#f87171' }}>
                Removes this voice and all its samples
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#f87171" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
