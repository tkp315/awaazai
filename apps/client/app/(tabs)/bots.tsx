import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { getCapabilityDisplay, useBotsStore } from '@/modules/bots';
import type { IAvailableBot } from '@/modules/bots';

function AvailableBotCard({ bot }: { bot: IAvailableBot }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();
  const display = getCapabilityDisplay(bot.name);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: '/(routes)/bots/create', params: { availableBotId: bot.id } })
      }
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing[4],
        marginBottom: spacing[3],
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        {/* Icon */}
        <View
          style={{
            width: spacing[14],
            height: spacing[14],
            borderRadius: radius.button,
            backgroundColor: display.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {bot.icon ? (
            <Text style={{ fontSize: 28 }}>{bot.icon}</Text>
          ) : (
            <Ionicons name={display.icon as any} size={28} color={display.color} />
          )}
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{bot.name}</Text>
          <Text
            style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}
            numberOfLines={2}
          >
            {bot.description}
          </Text>

          {/* Capability chips */}
          {bot.capabilities.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                gap: spacing[1.5],
                marginTop: spacing[2],
                flexWrap: 'wrap',
              }}
            >
              {bot.capabilities.map(cap => (
                <View
                  key={cap.id}
                  style={{
                    paddingHorizontal: spacing[2],
                    paddingVertical: 2,
                    borderRadius: radius.badge,
                    backgroundColor: display.bg,
                  }}
                >
                  <Text style={{ ...textStyles.caption, color: display.color, fontWeight: '600' }}>
                    {cap.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Arrow */}
        <View
          style={{
            width: spacing[9],
            height: spacing[9],
            borderRadius: radius.avatar,
            backgroundColor: display.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={20} color={display.color} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function BotsScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { availableBots, loadingAvailable, fetchAvailableBots } = useBotsStore();

  useEffect(() => {
    fetchAvailableBots();
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
          <Text style={{ ...textStyles.h3, color: colors.text }}>Create a Bot</Text>
          <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
            Choose a bot type to get started
          </Text>
        </View>

        {/* My Bots shortcut */}
        <TouchableOpacity
          onPress={() => router.push('/(routes)/bots/my-bots')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            marginBottom: spacing[5],
          }}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <Ionicons name="hardware-chip-outline" size={22} color={colors.primary[500]} />
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>My Bots</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Available Bots */}
        {loadingAvailable ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        ) : availableBots.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[8],
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40 }}>🤖</Text>
            <Text style={{ ...textStyles.labelLarge, color: colors.text, marginTop: spacing[3] }}>
              No bots available
            </Text>
            <Text
              style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: spacing[1] }}
            >
              Check back later
            </Text>
          </View>
        ) : (
          availableBots.map(bot => <AvailableBotCard key={bot.id} bot={bot} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
