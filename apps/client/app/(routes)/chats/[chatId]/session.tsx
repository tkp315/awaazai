import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks';
import { useMessageStore } from '@/modules/message';
import type { IMessage } from '@/modules/message';

// ─── Waveform ─────────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [14, 28, 20, 32, 18];

function Waveform({ active, color }: { active: boolean; color: string }): React.JSX.Element {
  const anims = useRef(BAR_HEIGHTS.map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    if (active) {
      const loops = anims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 80),
            Animated.timing(anim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.3, duration: 350, useNativeDriver: true }),
          ]),
        ),
      );
      loops.forEach(l => l.start());
      return () => loops.forEach(l => l.stop());
    } else {
      anims.forEach(anim => Animated.timing(anim, { toValue: 0.3, duration: 200, useNativeDriver: true }).start());
    }
  }, [active]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 40 }}>
      {BAR_HEIGHTS.map((h, i) => (
        <Animated.View
          key={i}
          style={{
            width: 4,
            height: h,
            borderRadius: 4,
            backgroundColor: color,
            transform: [{ scaleY: anims[i] }],
          }}
        />
      ))}
    </View>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: IMessage }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const [playing, setPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isUser = message.sentBy === 'user';

  const playAudio = async (): Promise<void> => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlaying(false);
        return;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: message.messageVoiceUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setPlaying(true);
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
          setPlaying(false);
        }
      });
    } catch (e) {
      console.error('playAudio', e);
    }
  };

  return (
    <View
      style={{
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: spacing[3],
        paddingHorizontal: spacing[1],
      }}
    >
      <View
        style={{
          maxWidth: '80%',
          backgroundColor: isUser ? colors.primary[500] : colors.surface,
          borderRadius: radius.card,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.border,
          padding: spacing[3],
          gap: spacing[2],
        }}
      >
        <Text
          style={{
            ...textStyles.bodyMedium,
            color: isUser ? '#fff' : colors.text,
            lineHeight: 22,
          }}
        >
          {message.messageContent}
        </Text>

        {/* Play button */}
        {message.messageVoiceUrl ? (
          <TouchableOpacity
            onPress={playAudio}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[1.5],
              alignSelf: 'flex-start',
            }}
          >
            <Ionicons
              name={playing ? 'pause-circle' : 'play-circle'}
              size={20}
              color={isUser ? 'rgba(255,255,255,0.8)' : colors.primary[500]}
            />
            <Text
              style={{
                ...textStyles.caption,
                color: isUser ? 'rgba(255,255,255,0.8)' : colors.textMuted,
              }}
            >
              {playing ? 'Playing...' : 'Play'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

// ─── Live Transcript ─────────────────────────────────────────────────────────

function LiveTranscript(): React.JSX.Element | null {
  const { colors, spacing, radius, textStyles } = useTheme();
  const { currentTranscription, currentAiText, isProcessing, aiSpeaking } = useMessageStore();

  if (!isProcessing && !aiSpeaking) return null;

  return (
    <View style={{ paddingHorizontal: spacing[4], gap: spacing[2], marginBottom: spacing[3] }}>
      {currentTranscription ? (
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{
            backgroundColor: colors.primary[100],
            borderRadius: radius.card,
            padding: spacing[3],
            maxWidth: '80%',
          }}>
            <Text style={{ ...textStyles.caption, color: colors.primary[700] }}>
              {currentTranscription}
            </Text>
          </View>
        </View>
      ) : null}

      {aiSpeaking ? (
        <View style={{ alignItems: 'flex-start' }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing[3],
            maxWidth: '85%',
            gap: spacing[2],
          }}>
            <Waveform active={aiSpeaking} color={colors.primary[500]} />
            {currentAiText ? (
              <Text style={{ ...textStyles.bodyMedium, color: colors.text, lineHeight: 24 }}>
                {currentAiText}
              </Text>
            ) : null}
          </View>
        </View>
      ) : isProcessing ? (
        <View style={{ alignItems: 'flex-start' }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing[3],
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
            <Text style={{ ...textStyles.caption, color: colors.textMuted }}>Thinking...</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SessionScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const {
    activeChat, activeSession, messages,
    isProcessing, aiSpeaking, isRecording,
    openChat, startSession, endSession,
    sendVoice, interrupt, cleanup,
  } = useMessageStore();

  const scrollRef = useRef<ScrollView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isRecordingStarting = useRef(false);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const init = async (): Promise<void> => {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) Alert.alert('Permission required', 'Microphone permission is needed to use this feature.');
      await openChat(chatId);
      await startSession(chatId);
      setLoadingSession(false);
    };
    init();
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }
      Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true }).catch(() => {});
      cleanup();
    };
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isProcessing]);

  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      pulseScale.setValue(1);
      pulseOpacity.setValue(0.5);
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseScale, { toValue: 1.7, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseScale, { toValue: 1, duration: 700, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseOpacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
          ]),
        ]),
      ).start();
    } else {
      pulseScale.stopAnimation();
      pulseOpacity.stopAnimation();
      Animated.timing(pulseOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [isRecording]);

  const startRecording = useCallback(async (): Promise<void> => {
    if (isRecordingStarting.current || recordingRef.current) return;
    isRecordingStarting.current = true;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      useMessageStore.setState({ isRecording: true });
    } catch (e) {
      console.error('startRecording', e);
    } finally {
      isRecordingStarting.current = false;
    }
  }, []);

  const stopAndSend = useCallback(async (): Promise<void> => {
    if (!recordingRef.current) return;
    const recording = recordingRef.current;
    recordingRef.current = null;
    useMessageStore.setState({ isRecording: false });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) await sendVoice(uri);
    } catch (e) {
      console.error('stopAndSend', e);
    }
  }, [sendVoice]);

  const handleEndSession = (): void => {
    Alert.alert(
      'End Session',
      'End this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End', style: 'destructive', onPress: () => { endSession(); router.back(); } },
      ]
    );
  };

  if (loadingSession) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[3] }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted }}>
            Starting session...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
            width: spacing[10], height: spacing[10],
            borderRadius: radius.avatar,
            backgroundColor: colors.surface,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: colors.border,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>
            {activeChat?.name ?? activeChat?.botVoice.voiceName ?? 'Chat'}
          </Text>
          <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
            {activeChat?.botVoice.relation ?? '—'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleEndSession}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1.5],
            borderRadius: radius.badge,
            backgroundColor: '#fff1f2',
            borderWidth: 1,
            borderColor: '#fecdd3',
          }}
        >
          <Text style={{ ...textStyles.caption, color: '#dc2626', fontWeight: '700' }}>
            End
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[4],
          paddingBottom: spacing[4],
        }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && !isProcessing ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing[10], gap: spacing[3] }}>
            <Text style={{ fontSize: 48 }}>🎙️</Text>
            <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted, textAlign: 'center' }}>
              Hold the mic button and start talking
            </Text>
          </View>
        ) : (
          messages.map(msg => <MessageBubble key={msg._id} message={msg} />)
        )}

        {/* Live transcript while processing */}
        <LiveTranscript />
      </ScrollView>

      {/* Bottom Controls */}
      <View
        style={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingVertical: spacing[5],
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          alignItems: 'center',
          gap: spacing[3],
        }}
      >
        {/* Barge-in button — AI bol raha ho tab dikhao */}
        {/* {aiSpeaking && (
          <TouchableOpacity
            onPress={interrupt}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[2],
              paddingHorizontal: spacing[5],
              paddingVertical: spacing[2.5],
              borderRadius: radius.button,
              backgroundColor: '#fff1f2',
              borderWidth: 1,
              borderColor: '#fecdd3',
            }}
          >
            <Ionicons name="hand-left-outline" size={18} color="#dc2626" />
            <Text style={{ ...textStyles.labelMedium, color: '#dc2626' }}>Interrupt</Text>
          </TouchableOpacity>
        )} */}

        {/* Mic button + pulse ring */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* Pulse ring */}
          <Animated.View
            style={{
              position: 'absolute',
              width: spacing[20],
              height: spacing[20],
              borderRadius: spacing[10],
              backgroundColor: '#dc2626',
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            }}
          />
          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopAndSend}
            disabled={isProcessing}
            activeOpacity={0.85}
            style={{
              width: spacing[20],
              height: spacing[20],
              borderRadius: spacing[10],
              backgroundColor: isRecording
                ? '#dc2626'
                : isProcessing
                ? colors.border
                : colors.primary[500],
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isRecording ? '#dc2626' : colors.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isRecording ? 0.6 : 0.3,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name={isRecording ? 'stop' : 'mic'} size={32} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
          {isRecording
            ? 'Recording... release to send'
            : isProcessing
            ? 'Processing...'
            : 'Hold to speak'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
