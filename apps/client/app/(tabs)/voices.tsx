import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { useBotsStore } from '@/modules/bots';
import { VOICE_STATUS_DISPLAY, useVoiceStore } from '@/modules/voice';
import { AWAAZBOT_AVAILABLE_BOT_ID } from '@/shared/constants';
import type { IBot } from '@/modules/bots';
import type { IBotVoice } from '@/modules/voice';

function VoiceChip({ voice }: { voice: IBotVoice }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();
  const display = VOICE_STATUS_DISPLAY[voice.status];

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/(routes)/voices/[botId]/[voiceId]',
          params: { botId: voice.botId, voiceId: voice.id },
        })
      }
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      {/* Status dot */}
      <View
        style={{
          width: spacing[10],
          height: spacing[10],
          borderRadius: radius.avatar,
          backgroundColor: display.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={display.icon as any} size={18} color={display.color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
          {voice.voiceName ?? 'Unnamed Voice'}
        </Text>
        <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
          {voice.relation ?? '—'} · {display.label}
        </Text>
      </View>

      {voice.status === 'READY' && (
        <View
          style={{
            paddingHorizontal: spacing[2.5],
            paddingVertical: 3,
            borderRadius: radius.badge,
            backgroundColor: display.bg,
          }}
        >
          <Text style={{ ...textStyles.caption, color: display.color, fontWeight: '700' }}>
            Ready
          </Text>
        </View>
      )}

      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function BotVoiceCard({ bot }: { bot: IBot }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();
  const { voices, fetchVoices } = useVoiceStore();
  const botVoices = voices.filter(v => v.botId === bot.id);

  useEffect(() => {
    fetchVoices(bot.id);
  }, [bot.id]);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: spacing[4],
      }}
    >
      {/* Bot header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing[4],
          gap: spacing[3],
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
          <Text style={{ fontSize: 24 }}>{bot.avatar ?? '🤖'}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{bot.name}</Text>
          <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
            {botVoices.length} voice{botVoices.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(routes)/voices/[botId]/create',
              params: { botId: bot.id },
            })
          }
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[1.5],
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1.5],
            borderRadius: radius.button,
            backgroundColor: colors.primary[500],
          }}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={{ ...textStyles.labelSmall, color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Voice list */}
      {botVoices.length > 0 ? (
        botVoices.map(v => <VoiceChip key={v.id} voice={v} />)
      ) : (
        <View
          style={{
            padding: spacing[5],
            borderTopWidth: 1,
            borderTopColor: colors.border,
            alignItems: 'center',
          }}
        >
          <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>
            No voices yet — tap Add to clone one
          </Text>
        </View>
      )}
    </View>
  );
}

export default function VoicesScreen(): React.JSX.Element {
  const { colors, spacing, layout, textStyles } = useTheme();
  const { bots, loadingBots, fetchBots } = useBotsStore();
  const awaazBots = bots.filter(b => b.availableBotId === AWAAZBOT_AVAILABLE_BOT_ID);

  useEffect(() => {
    fetchBots();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingBottom: spacing[8],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingVertical: spacing[5] }}>
          <Text style={{ ...textStyles.h3, color: colors.text }}>Voices</Text>
          <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
            Clone and manage voices for your bots
          </Text>
        </View>

        {loadingBots ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        ) : awaazBots.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[8],
              alignItems: 'center',
              gap: spacing[3],
            }}
          >
            <Text style={{ fontSize: 48 }}>🎙️</Text>
            <Text style={{ ...textStyles.labelLarge, color: colors.text }}>No AwaazBot yet</Text>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, textAlign: 'center' }}>
              Create an AwaazBot first, then clone voices for it
            </Text>
          </View>
        ) : (
          awaazBots.map(bot => <BotVoiceCard key={bot.id} bot={bot} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
