import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Modal, FlatList, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useTheme } from '@/hooks';
import { useBotsStore } from '@/modules/bots';
import type { IBotMessage, IBotChat } from '@/modules/bots';

// ─── Audio Player Hook ────────────────────────────────────────────────────────

function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const play = useCallback(async (messageId: string, url: string) => {
    // Stop previous
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }

    if (playingId === messageId) {
      setPlayingId(null);
      return;
    }

    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      soundRef.current = sound;
      setPlayingId(messageId);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
          sound.unloadAsync().catch(() => {});
          soundRef.current = null;
        }
      });
    } catch {
      setPlayingId(null);
    }
  }, [playingId]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  return { play, playingId };
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onPlay,
  isPlaying,
}: {
  message: IBotMessage;
  onPlay: (id: string, url: string) => void;
  isPlaying: boolean;
}): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const isUser = message.role === 'USER';

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
          maxWidth: '82%',
          backgroundColor: isUser ? colors.primary[500] : colors.surface,
          borderRadius: radius.card,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.border,
          padding: spacing[3],
        }}
      >
        <Text
          style={{
            ...textStyles.bodyMedium,
            color: isUser ? '#fff' : colors.text,
            lineHeight: 22,
          }}
        >
          {message.content}
        </Text>

        {/* RAG badge */}
        {message.ragUsed && !isUser && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[1],
              marginTop: spacing[1.5],
            }}
          >
            <Ionicons name="library-outline" size={11} color={colors.primary[400]} />
            <Text style={{ ...textStyles.caption, color: colors.primary[400], fontSize: 10 }}>
              From knowledge base
            </Text>
          </View>
        )}

        {/* Play button for bot messages with voice */}
        {!isUser && message.voiceUrl && (
          <TouchableOpacity
            onPress={() => onPlay(message.id, message.voiceUrl!)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[1.5],
              marginTop: spacing[2],
              paddingTop: spacing[2],
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <View
              style={{
                width: spacing[7],
                height: spacing[7],
                borderRadius: spacing[3.5],
                backgroundColor: isPlaying ? colors.primary[100] : colors.primary[50],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={14}
                color={colors.primary[500]}
              />
            </View>
            <Text style={{ ...textStyles.caption, color: colors.primary[500], fontWeight: '600' }}>
              {isPlaying ? 'Playing...' : 'Play voice'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={{ ...textStyles.caption, color: colors.border, marginTop: spacing[1], fontSize: 10 }}>
        {new Date(message.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

// ─── Thinking Indicator ───────────────────────────────────────────────────────

function ThinkingBubble(): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  return (
    <View style={{ alignItems: 'flex-start', marginBottom: spacing[3], paddingHorizontal: spacing[1] }}>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[2],
        }}
      >
        <ActivityIndicator size="small" color={colors.primary[500]} />
        <Text style={{ ...textStyles.caption, color: colors.textMuted }}>Thinking...</Text>
      </View>
    </View>
  );
}

// ─── Chat History Modal ───────────────────────────────────────────────────────

function ChatHistoryModal({
  visible,
  onClose,
  chats,
  activeChatId,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  chats: IBotChat[];
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
}): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: spacing[8],
            maxHeight: '65%',
          }}
          onPress={() => {}}
        >
          <View style={{ alignItems: 'center', paddingVertical: spacing[3] }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
          </View>
          <Text style={{ ...textStyles.labelLarge, color: colors.text, paddingHorizontal: spacing[5], marginBottom: spacing[3] }}>
            Chat History
          </Text>

          {chats.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing[8] }}>
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>No previous chats</Text>
            </View>
          ) : (
            <FlatList
              data={chats}
              keyExtractor={c => c.id}
              contentContainerStyle={{ paddingHorizontal: spacing[5] }}
              renderItem={({ item: chat }) => {
                const isActive = chat.id === activeChatId;
                return (
                  <TouchableOpacity
                    onPress={() => { onSelect(chat.id); onClose(); }}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[3],
                      paddingVertical: spacing[3],
                      paddingHorizontal: spacing[4],
                      marginBottom: spacing[2],
                      borderRadius: radius.card,
                      borderWidth: 1.5,
                      borderColor: isActive ? colors.primary[400] : colors.border,
                      backgroundColor: isActive ? colors.primary[50] : colors.surface,
                    }}
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={20}
                      color={isActive ? colors.primary[500] : colors.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...textStyles.labelMedium, color: colors.text }} numberOfLines={1}>
                        {chat.title ?? 'Chat'}
                      </Text>
                      <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                        {new Date(chat.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </Text>
                    </View>
                    {isActive && (
                      <View
                        style={{
                          paddingHorizontal: spacing[2],
                          paddingVertical: 2,
                          borderRadius: radius.badge,
                          backgroundColor: colors.primary[100],
                        }}
                      >
                        <Text style={{ ...textStyles.caption, color: colors.primary[600], fontWeight: '700' }}>
                          Active
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function UseBotScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { botId } = useLocalSearchParams<{ botId: string }>();

  const {
    activeBot, fetchBotById,
    botChats, fetchBotChats, createBotChat,
    activeMessages, openBotChat,
    sendBotMessage, isSendingMessage,
    clearChatState,
  } = useBotsStore();

  const scrollRef = useRef<ScrollView>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const { play, playingId } = useAudioPlayer();

  // Init — load bot + chat
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchBotById(botId);
      await fetchBotChats(botId);

      const existing = useBotsStore.getState().botChats;
      let chatId: string;

      if (existing.length > 0) {
        chatId = existing[0].id;
      } else {
        const newChat = await createBotChat(botId);
        if (!newChat) { setLoading(false); return; }
        chatId = newChat.id;
      }

      setActiveChatId(chatId);
      await openBotChat(botId, chatId);
      setLoading(false);
    };
    init();
    return () => { clearChatState(); };
  }, [botId]);

  // Auto scroll on new messages
  useEffect(() => {
    if (activeMessages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [activeMessages, isSendingMessage]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || !activeChatId || isSendingMessage) return;
    setText('');
    await sendBotMessage(botId, activeChatId, content);
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChatId(chatId);
    await openBotChat(botId, chatId);
  };

  const handleNewChat = async () => {
    const newChat = await createBotChat(botId);
    if (newChat) {
      setActiveChatId(newChat.id);
      await openBotChat(botId, newChat.id);
    }
  };

  const botName = activeBot?.name ?? activeBot?.availableBot?.name ?? 'Bot';
  const botAvatar = activeBot?.avatar ?? '🤖';
  const hasVoice = !!activeBot?.selectedVoiceId;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[3] }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted }}>Starting chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: layout.screenPaddingHorizontal,
            paddingVertical: spacing[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
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

          <View
            style={{
              width: spacing[10], height: spacing[10],
              borderRadius: radius.avatar,
              backgroundColor: colors.primary[100],
              alignItems: 'center', justifyContent: 'center',
              marginLeft: spacing[3], marginRight: spacing[2],
            }}
          >
            <Text style={{ fontSize: 20 }}>{botAvatar}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{botName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success.main }} />
              <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                {activeBot?.knowledgeMode === 'AI_ONLY' ? 'AI Mode' : 'RAG Mode'}
              </Text>
              {hasVoice && (
                <>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textMuted }} />
                  <Ionicons name="mic" size={11} color={colors.primary[400]} />
                  <Text style={{ ...textStyles.caption, color: colors.primary[400] }}>Voice</Text>
                </>
              )}
            </View>
          </View>

          {/* History button */}
          <TouchableOpacity
            onPress={() => setHistoryVisible(true)}
            style={{
              width: spacing[10], height: spacing[10],
              borderRadius: radius.avatar,
              backgroundColor: colors.surface,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: colors.border,
              marginRight: spacing[2],
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={20} color={colors.text} />
          </TouchableOpacity>

          {/* New chat button */}
          <TouchableOpacity
            onPress={handleNewChat}
            style={{
              width: spacing[10], height: spacing[10],
              borderRadius: radius.avatar,
              backgroundColor: colors.surface,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: colors.border,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: layout.screenPaddingHorizontal,
            paddingTop: spacing[4],
            paddingBottom: spacing[2],
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeMessages.length === 0 && !isSendingMessage ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing[12], gap: spacing[3] }}>
              <Text style={{ fontSize: 48 }}>{botAvatar}</Text>
              <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{botName}</Text>
              <Text
                style={{
                  ...textStyles.bodyMedium,
                  color: colors.textMuted,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                {activeBot?.purpose ?? `Ask me anything! I'm here to help.`}
              </Text>
            </View>
          ) : (
            activeMessages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onPlay={play}
                isPlaying={playingId === msg.id}
              />
            ))
          )}
          {isSendingMessage && <ThinkingBubble />}
        </ScrollView>

        {/* Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: layout.screenPaddingHorizontal,
            paddingVertical: spacing[3],
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            gap: spacing[2],
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type your message..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={2000}
            style={{
              flex: 1,
              ...textStyles.bodyMedium,
              color: colors.text,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.card,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              maxHeight: 120,
              textAlignVertical: 'top',
            }}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim() || isSendingMessage}
            activeOpacity={0.85}
            style={{
              width: spacing[12],
              height: spacing[12],
              borderRadius: radius.avatar,
              backgroundColor: text.trim() && !isSendingMessage ? colors.primary[500] : colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isSendingMessage ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ChatHistoryModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        chats={botChats}
        activeChatId={activeChatId}
        onSelect={handleSelectChat}
      />
    </SafeAreaView>
  );
}
