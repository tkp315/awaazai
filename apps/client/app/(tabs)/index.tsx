import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { useProfileStore } from '@/modules/profile';
import { VOICE_STATUS_DISPLAY, useVoiceStore } from '@/modules/voice';
import type { IBotVoice } from '@/modules/voice';

function VoiceCard({ voice }: { voice: IBotVoice }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();
  const display = VOICE_STATUS_DISPLAY[voice.status];

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/(routes)/voices/[botId]/[voiceId]', params: { botId: voice.botId, voiceId: voice.id } })}
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
          backgroundColor: display.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={display.icon as any} size={22} color={display.color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
          {voice.voiceName ?? 'Unnamed Voice'}
        </Text>
        <Text style={{ ...textStyles.caption, color: colors.textMuted, marginTop: 2 }}>
          {voice.relation ? `${voice.relation} · ` : ''}{voice.language.toUpperCase()}
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: spacing[2.5],
          paddingVertical: 3,
          borderRadius: radius.badge,
          backgroundColor: display.bg,
        }}
      >
        <Text style={{ ...textStyles.caption, color: display.color, fontWeight: '700' }}>
          {display.label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function HomeScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { user, fetchMe } = useProfileStore();
  const { readyVoices, loadingReadyVoices, fetchReadyVoices } = useVoiceStore();

  useEffect(() => {
    if (!user) fetchMe();
    fetchReadyVoices();
  }, []);

  const quickActions = [
    {
      icon: 'add-circle' as const,
      label: 'Clone Voice',
      bg: colors.primary[100],
      color: colors.primary[600],
      onPress: () => router.push('/(tabs)/voices'),
    },
    {
      icon: 'chatbubbles' as const,
      label: 'My Chats',
      bg: colors.secondary[100],
      color: colors.secondary[600],
      onPress: () => router.push('/(tabs)/chats'),
    },
    {
      icon: 'people' as const,
      label: 'My Voices',
      bg: colors.success.light,
      color: colors.success.dark,
      onPress: () => router.push('/(tabs)/voices'),
    },
  ];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  })();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[5] }}>
          <View>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>{greeting}</Text>
            <Text style={{ ...textStyles.h3, color: colors.text, marginTop: spacing[0.5] }}>
              {user?.fullName ?? 'there'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={{
              width: spacing[11],
              height: spacing[11],
              borderRadius: radius.avatar,
              backgroundColor: colors.primary[500],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...textStyles.labelLarge, color: '#fff' }}>
              {(user?.fullName ?? 'U').charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero CTA */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chats')}
          style={{
            backgroundColor: colors.primary[500],
            borderRadius: radius.card,
            padding: spacing[5],
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing[7],
          }}
          activeOpacity={0.85}
        >
          <View
            style={{
              width: spacing[12],
              height: spacing[12],
              borderRadius: radius.avatar,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing[3],
            }}
          >
            <Ionicons name="mic" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...textStyles.h4, color: '#fff' }}>Start a Conversation</Text>
            <Text style={{ ...textStyles.bodySmall, color: 'rgba(255,255,255,0.75)', marginTop: spacing[0.5] }}>
              Chat with a cloned voice
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={{ ...textStyles.labelLarge, color: colors.text, marginBottom: spacing[3] }}>Quick Actions</Text>
        <View style={{ flexDirection: 'row', gap: spacing[3], marginBottom: spacing[7] }}>
          {quickActions.map(item => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: radius.card,
                padding: spacing[4],
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: spacing[12],
                  height: spacing[12],
                  borderRadius: radius.button,
                  backgroundColor: item.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing[2],
                }}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={{ ...textStyles.labelSmall, color: colors.text, textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Voices */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] }}>
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>Recent Voices</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/voices')}>
            <Text style={{ ...textStyles.labelSmall, color: colors.primary[500] }}>See all</Text>
          </TouchableOpacity>
        </View>

        {loadingReadyVoices ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing[8] }}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        ) : readyVoices.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              padding: spacing[8],
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="mic-outline" size={48} color={colors.border} />
            <Text style={{ ...textStyles.labelLarge, color: colors.text, marginTop: spacing[3] }}>No voices yet</Text>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: spacing[1], textAlign: 'center' }}>
              Clone your first voice to get started
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/voices')}
              style={{
                backgroundColor: colors.primary[500],
                borderRadius: radius.button,
                paddingHorizontal: spacing[5],
                paddingVertical: spacing[2],
                marginTop: spacing[4],
              }}
              activeOpacity={0.8}
            >
              <Text style={{ ...textStyles.buttonSmall, color: '#fff' }}>Clone a Voice</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {readyVoices.slice(0, 3).map(voice => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
            {readyVoices.length > 3 && (
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/voices')}
                activeOpacity={0.8}
                style={{
                  alignItems: 'center',
                  paddingVertical: spacing[3],
                  borderRadius: radius.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ ...textStyles.labelSmall, color: colors.primary[500] }}>
                  +{readyVoices.length - 3} more voices
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
