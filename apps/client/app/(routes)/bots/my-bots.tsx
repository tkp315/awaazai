import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { getCapabilityDisplay, useBotsStore } from '@/modules/bots';
import type { IBot } from '@/modules/bots';

function BotCard({ bot }: { bot: IBot }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();
  const enabledCaps = bot.capability.filter(c => c.isEnabled !== false);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(routes)/bots/${bot.id}`)}
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
        <View
          style={{
            width: spacing[14],
            height: spacing[14],
            borderRadius: radius.avatar,
            backgroundColor: colors.primary[100],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 28 }}>{bot.avatar ?? '🤖'}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <Text style={{ ...textStyles.labelLarge, color: colors.text }} numberOfLines={1}>
              {bot.name ?? 'Unnamed Bot'}
            </Text>
            <View
              style={{
                paddingHorizontal: spacing[2],
                paddingVertical: 2,
                borderRadius: radius.badge,
                backgroundColor: bot.status === 'TRAINED' ? '#ecfdf5' : colors.surfaceHover,
              }}
            >
              <Text
                style={{
                  ...textStyles.caption,
                  color: bot.status === 'TRAINED' ? '#059669' : colors.textMuted,
                  fontWeight: '600',
                }}
              >
                {bot.status}
              </Text>
            </View>
          </View>

          {bot.purpose && (
            <Text
              style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}
              numberOfLines={1}
            >
              {bot.purpose}
            </Text>
          )}

          {enabledCaps.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                gap: spacing[1.5],
                marginTop: spacing[2],
                flexWrap: 'wrap',
              }}
            >
              {enabledCaps.slice(0, 3).map(bc => {
                const display = getCapabilityDisplay(bc.capability.name);
                return (
                  <View
                    key={bc.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: display.bg,
                      paddingHorizontal: spacing[2],
                      paddingVertical: 2,
                      borderRadius: radius.badge,
                    }}
                  >
                    <Ionicons name={display.icon as any} size={10} color={display.color} />
                    <Text
                      style={{ ...textStyles.caption, color: display.color, fontWeight: '600' }}
                    >
                      {bc.capability.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: spacing[3],
          paddingTop: spacing[3],
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
          {bot.lastUsedAt
            ? `Last used ${new Date(bot.lastUsedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
            : 'Never used'}
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <TouchableOpacity
            onPress={() => router.push(`/(routes)/bots/${bot.id}/train`)}
            style={{
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1.5],
              borderRadius: radius.button,
              borderWidth: 1,
              borderColor: colors.primary[300],
              backgroundColor: colors.primary[50],
            }}
            activeOpacity={0.7}
          >
            <Text style={{ ...textStyles.caption, color: colors.primary[600], fontWeight: '600' }}>
              Train
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/(routes)/bots/${bot.id}/use`)}
            style={{
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1.5],
              borderRadius: radius.button,
              backgroundColor: colors.primary[500],
            }}
            activeOpacity={0.7}
          >
            <Text style={{ ...textStyles.caption, color: colors.textInverse, fontWeight: '600' }}>
              Use
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MyBotsScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { bots, loadingBots, fetchBots } = useBotsStore();

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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: spacing[5],
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
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
            <View>
              <Text style={{ ...textStyles.h3, color: colors.text }}>My Bots</Text>
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
                {bots.length} bot{bots.length !== 1 ? 's' : ''} created
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(routes)/bots/create')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[1.5],
              backgroundColor: colors.primary[500],
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[2.5],
              borderRadius: radius.button,
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color={colors.textInverse} />
            <Text style={{ ...textStyles.buttonSmall, color: colors.textInverse }}>New Bot</Text>
          </TouchableOpacity>
        </View>

        {loadingBots && (
          <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        )}

        {!loadingBots && bots.length > 0 && bots.map(bot => <BotCard key={bot.id} bot={bot} />)}

        {!loadingBots && bots.length === 0 && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[8],
              alignItems: 'center',
              marginTop: spacing[4],
            }}
          >
            <Text style={{ fontSize: 40 }}>🤖</Text>
            <Text style={{ ...textStyles.h4, color: colors.text, marginTop: spacing[3] }}>
              No bots yet
            </Text>
            <Text
              style={{
                ...textStyles.bodyMedium,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: spacing[2],
              }}
            >
              Go back and create your first bot
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
