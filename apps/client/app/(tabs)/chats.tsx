import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { useMessageStore } from '@/modules/message';
import { useVoiceStore } from '@/modules/voice';
import type { IChat } from '@/modules/message';
import type { IBotVoice } from '@/modules/voice';
import { PaywallModal } from '@/components/ui/paywall';

// ─── Chat Card ───────────────────────────────────────────────────────────────

function ChatCard({ chat }: { chat: IChat }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/(routes)/chats/[chatId]',
          params: { chatId: chat.id },
        })
      }
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing[4],
        marginBottom: spacing[3],
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
      }}
    >
      <View
        style={{
          width: spacing[14],
          height: spacing[14],
          borderRadius: radius.avatar,
          backgroundColor: colors.primary[50],
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.primary[200],
        }}
      >
        <Text style={{ fontSize: 28 }}>{chat.botVoice.bot.avatar ?? '🤖'}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ ...textStyles.labelLarge, color: colors.text }}>
          {chat.name ?? chat.botVoice.voiceName ?? 'Chat'}
        </Text>
        <Text style={{ ...textStyles.caption, color: colors.textMuted, marginTop: 2 }}>
          {chat.botVoice.relation ?? '—'} · {chat._count.chatSession} session
          {chat._count.chatSession !== 1 ? 's' : ''}
        </Text>
      </View>

      {chat.botVoice.status === 'READY' && (
        <View
          style={{
            paddingHorizontal: spacing[2.5],
            paddingVertical: 3,
            borderRadius: radius.badge,
            backgroundColor: '#ecfdf5',
          }}
        >
          <Text style={{ ...textStyles.caption, color: '#059669', fontWeight: '700' }}>Ready</Text>
        </View>
      )}

      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

// ─── Voice Pick Modal ─────────────────────────────────────────────────────────

function NewChatModal({
  visible,
  onClose,
  onSelect,
  voices,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (voice: IBotVoice) => void;
  voices: IBotVoice[];
  loading: boolean;
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
            borderTopLeftRadius: radius.modal ?? 24,
            borderTopRightRadius: radius.modal ?? 24,
            paddingBottom: spacing[8],
            maxHeight: '70%',
          }}
          onPress={() => {}}
        >
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingVertical: spacing[3] }}>
            <View
              style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }}
            />
          </View>

          <Text
            style={{
              ...textStyles.labelLarge,
              color: colors.text,
              paddingHorizontal: spacing[5],
              marginBottom: spacing[4],
            }}
          >
            Choose a Voice
          </Text>

          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
          ) : voices.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: spacing[8],
                paddingHorizontal: spacing[5],
              }}
            >
              <Text style={{ fontSize: 40, marginBottom: spacing[3] }}>🎙️</Text>
              <Text style={{ ...textStyles.labelMedium, color: colors.text }}>No ready voices</Text>
              <Text
                style={{
                  ...textStyles.bodySmall,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: spacing[2],
                }}
              >
                Clone a voice first before starting a chat
              </Text>
            </View>
          ) : (
            <FlatList
              data={voices}
              keyExtractor={v => v.id}
              contentContainerStyle={{ paddingHorizontal: spacing[5] }}
              renderItem={({ item: voice }) => (
                <TouchableOpacity
                  onPress={() => onSelect(voice)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[3],
                    backgroundColor: colors.surface,
                    borderRadius: radius.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: spacing[4],
                    marginBottom: spacing[3],
                  }}
                >
                  <View
                    style={{
                      width: spacing[12],
                      height: spacing[12],
                      borderRadius: radius.avatar,
                      backgroundColor: colors.primary[50],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{voice.bot?.avatar ?? '🤖'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
                      {voice.voiceName ?? 'Unnamed'}
                    </Text>
                    <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                      {voice.relation ?? '—'} · {voice.bot?.name ?? ''}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ChatsScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { chats, loadingChats, fetchChats, createChat, limitReached, clearLimitReached } =
    useMessageStore();
  const { readyVoices, loadingReadyVoices, fetchReadyVoices } = useVoiceStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  };

  const handleOpenModal = async (): Promise<void> => {
    setModalVisible(true);
    await fetchReadyVoices();
  };

  const handleSelectVoice = async (voice: IBotVoice): Promise<void> => {
    setModalVisible(false);
    setCreating(true);
    const chat = await createChat(voice.id, voice.voiceName ?? undefined);
    setCreating(false);
    if (chat) {
      router.push({
        pathname: '/(routes)/chats/[chatId]',
        params: { chatId: chat.id },
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <PaywallModal visible={limitReached} limitKey="VOICE_CHATS" onClose={clearLimitReached} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingBottom: spacing[8],
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
          />
        }
      >
        {/* Header */}
        <View
          style={{
            paddingVertical: spacing[5],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ ...textStyles.h3, color: colors.text }}>Chats</Text>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
              Your conversations
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleOpenModal}
            disabled={creating}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[1.5],
              backgroundColor: colors.primary[500],
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[2.5],
              borderRadius: radius.button,
            }}
          >
            {creating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="add" size={18} color="#fff" />
            )}
            <Text style={{ ...textStyles.labelSmall, color: '#fff' }}>New Chat</Text>
          </TouchableOpacity>
        </View>

        {loadingChats ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        ) : chats.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[8],
              alignItems: 'center',
              gap: spacing[3],
            }}
          >
            <Text style={{ fontSize: 48 }}>💬</Text>
            <Text style={{ ...textStyles.labelLarge, color: colors.text }}>No chats yet</Text>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, textAlign: 'center' }}>
              Start a new chat with a cloned voice
            </Text>
            <TouchableOpacity
              onPress={handleOpenModal}
              activeOpacity={0.8}
              style={{
                marginTop: spacing[2],
                backgroundColor: colors.primary[500],
                paddingHorizontal: spacing[6],
                paddingVertical: spacing[3],
                borderRadius: radius.button,
              }}
            >
              <Text style={{ ...textStyles.labelMedium, color: '#fff' }}>Start a Chat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          chats.map(chat => <ChatCard key={chat.id} chat={chat} />)
        )}
      </ScrollView>

      <NewChatModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectVoice}
        voices={readyVoices}
        loading={loadingReadyVoices}
      />
    </SafeAreaView>
  );
}
