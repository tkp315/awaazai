import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useTheme } from '@/hooks';
import { useMessageStore, getMessages } from '@/modules/message';
import type { IMessage } from '@/modules/message';

// ─── Message Bubble ───────────────────────────────────────────────────────────

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
        marginBottom: spacing[2],
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

        {message.messageVoiceUrl ? (
          <TouchableOpacity
            onPress={playAudio}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1.5] }}
          >
            <Ionicons
              name={playing ? 'pause-circle' : 'play-circle'}
              size={20}
              color={isUser ? 'rgba(255,255,255,0.8)' : colors.primary[500]}
            />
            <Text style={{ ...textStyles.caption, color: isUser ? 'rgba(255,255,255,0.8)' : colors.textMuted }}>
              {playing ? 'Playing...' : 'Play'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

// ─── Session Section ──────────────────────────────────────────────────────────

function SessionSection({
  session,
  chatId,
  index,
}: {
  session: { id: string; startedAt: string; endedAt: string | null };
  chatId: string;
  index: number;
}): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMessages(chatId, session.id).then(msgs => {
      setMessages(msgs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [chatId, session.id]);

  const startDate = new Date(session.startedAt);
  const dateStr = startDate.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const timeStr = startDate.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={{ marginBottom: spacing[5] }}>
      {/* Session header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[2],
          marginBottom: spacing[3],
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
          Session {index + 1} · {dateStr} {timeStr}
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={colors.primary[500]} style={{ marginVertical: spacing[4] }} />
      ) : messages.length === 0 ? (
        <Text style={{ ...textStyles.caption, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing[2] }}>
          No messages in this session
        </Text>
      ) : (
        messages.map(msg => <MessageBubble key={msg._id} message={msg} />)
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ChatDetailScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const { activeChat, openChat, deleteChat } = useMessageStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    openChat(chatId).finally(() => setLoading(false));
  }, [chatId]);

  const handleStartSession = (): void => {
    router.push({
      pathname: '/(routes)/chats/[chatId]/session',
      params: { chatId },
    });
  };

  const handleDelete = (): void => {
    Alert.alert(
      'Delete Chat',
      `Delete "${activeChat?.name ?? activeChat?.botVoice.voiceName ?? 'this chat'}"? All sessions will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteChat(chatId);
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  const sessions = activeChat?.chatSession ?? [];
  const hasHistory = sessions.length > 0;

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
            width: spacing[10], height: spacing[10],
            borderRadius: radius.avatar,
            backgroundColor: colors.surface,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: colors.border,
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>
            {activeChat?.name ?? activeChat?.botVoice.voiceName ?? 'Chat'}
          </Text>
          <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
            {activeChat?.botVoice.relation ?? '—'} · {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity onPress={handleDelete} activeOpacity={0.7} style={{ padding: spacing[2] }}>
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[5],
          paddingBottom: spacing[32],
        }}
        showsVerticalScrollIndicator={false}
      >
        {!hasHistory ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing[12], gap: spacing[3] }}>
            <Text style={{ fontSize: 48 }}>🎙️</Text>
            <Text style={{ ...textStyles.labelLarge, color: colors.text }}>No conversations yet</Text>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, textAlign: 'center' }}>
              Tap the mic below to start talking
            </Text>
          </View>
        ) : (
          [...sessions]
            .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
            .map((session, i) => (
              <SessionSection key={session.id} session={session} chatId={chatId} index={i} />
            ))
        )}
      </ScrollView>

      {/* Floating Mic Button */}
      <View
        style={{
          position: 'absolute',
          bottom: spacing[10],
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={handleStartSession}
          activeOpacity={0.85}
          style={{
            width: spacing[20],
            height: spacing[20],
            borderRadius: spacing[10],
            backgroundColor: colors.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary[500],
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name="mic" size={34} color="#fff" />
        </TouchableOpacity>
        <Text style={{ ...textStyles.caption, color: colors.textMuted, marginTop: spacing[2] }}>
          Tap to start a new session
        </Text>
      </View>
    </SafeAreaView>
  );
}
