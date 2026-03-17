import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { useSubscriptionStore } from '@/modules/subscription';
import type { LimitKey } from '@/modules/subscription';

const LIMIT_META: Record<LimitKey, { label: string; icon: string }> = {
  VOICE_CLONES: { label: 'Voice Clones', icon: 'mic' },
  VOICE_CHATS: { label: 'Voice Chats', icon: 'chatbubbles' },
  AI_BOTS: { label: 'AI Bots', icon: 'hardware-chip' },
};

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const { colors, spacing, radius } = useTheme();
  if (limit === -1) return null;
  const pct = Math.min(used / limit, 1);
  const barColor =
    pct >= 1 ? colors.error.main : pct >= 0.8 ? colors.warning.dark : colors.primary[500];

  return (
    <View
      style={{
        height: 6,
        backgroundColor: colors.surfaceHover,
        borderRadius: radius.full,
        marginTop: spacing[2],
      }}
    >
      <View
        style={{
          height: 6,
          width: `${pct * 100}%` as any,
          backgroundColor: barColor,
          borderRadius: radius.full,
        }}
      />
    </View>
  );
}

function LimitCard({ limitKey }: { limitKey: LimitKey }) {
  const { colors, spacing, radius, textStyles } = useTheme();
  const { usage } = useSubscriptionStore();
  const meta = LIMIT_META[limitKey];
  const stat = usage?.limits?.[limitKey];

  if (!stat) return null;

  const isUnlimited = stat.limit === -1;
  const limitLabel = isUnlimited ? 'Unlimited' : `${stat.used} / ${stat.limit}`;
  const subLabel = isUnlimited ? 'No cap on this resource' : `${stat.limit - stat.used} remaining`;

  return (
    <View
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
            width: spacing[10],
            height: spacing[10],
            borderRadius: radius.button,
            backgroundColor: colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={meta.icon as any} size={20} color={colors.primary[500]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...textStyles.labelMedium, color: colors.text }}>{meta.label}</Text>
          <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
            {subLabel}
          </Text>
        </View>
        <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{limitLabel}</Text>
      </View>
      <UsageBar used={stat.used} limit={stat.limit} />
    </View>
  );
}

function HistorySection() {
  const { colors, spacing, radius, textStyles } = useTheme();
  const { usage } = useSubscriptionStore();

  const history = usage?.history ?? [];
  if (history.length === 0) return null;

  // Group by period
  const grouped: Record<string, typeof history> = {};
  for (const record of history) {
    if (!grouped[record.period]) grouped[record.period] = [];
    grouped[record.period].push(record);
  }
  const periods = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 6);

  return (
    <View style={{ marginTop: spacing[6] }}>
      <Text style={{ ...textStyles.labelSmall, color: colors.textMuted, marginBottom: spacing[3] }}>
        USAGE HISTORY
      </Text>
      {periods.map(period => (
        <View
          key={period}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing[4],
            marginBottom: spacing[3],
          }}
        >
          <Text
            style={{ ...textStyles.labelSmall, color: colors.textMuted, marginBottom: spacing[2] }}
          >
            {period}
          </Text>
          {grouped[period].map(record => {
            const meta = LIMIT_META[record.limitKey];
            return (
              <View
                key={record.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: spacing[1],
                }}
              >
                <Text style={{ ...textStyles.bodySmall, color: colors.text }}>
                  {meta?.label ?? record.limitKey}
                </Text>
                <Text style={{ ...textStyles.labelSmall, color: colors.primary[500] }}>
                  {record.used} used
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default function UsageScreen(): React.JSX.Element {
  const { colors, spacing, layout, textStyles } = useTheme();
  const router = useRouter();
  const { usage, loadingUsage, fetchUsage } = useSubscriptionStore();

  useEffect(() => {
    fetchUsage();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingVertical: spacing[3],
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: spacing[3] }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ ...textStyles.h4, color: colors.text }}>Usage & Limits</Text>
      </View>

      {loadingUsage ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: layout.screenPaddingHorizontal,
            paddingBottom: spacing[8],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Plan info */}
          {usage?.plan && (
            <View
              style={{
                backgroundColor: colors.primary[950],
                borderRadius: 16,
                padding: spacing[4],
                marginBottom: spacing[5],
                marginTop: spacing[2],
              }}
            >
              <Text style={{ ...textStyles.labelSmall, color: colors.textMuted }}>
                CURRENT PLAN
              </Text>
              <Text
                style={{
                  ...textStyles.labelLarge,
                  color: colors.textInverse,
                  marginTop: spacing[1],
                }}
              >
                {usage.plan.name} · {usage.plan.billingCycle === 'YEARLY' ? 'Yearly' : 'Monthly'}
              </Text>
              <Text
                style={{ ...textStyles.caption, color: colors.textMuted, marginTop: spacing[0.5] }}
              >
                Renews{' '}
                {new Date(usage.plan.currentPeriodEnd).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}

          {/* Current limits */}
          <Text
            style={{ ...textStyles.labelSmall, color: colors.textMuted, marginBottom: spacing[3] }}
          >
            CURRENT USAGE
          </Text>
          {(['VOICE_CLONES', 'VOICE_CHATS', 'AI_BOTS'] as LimitKey[]).map(key => (
            <LimitCard key={key} limitKey={key} />
          ))}

          <TouchableOpacity
            onPress={() => router.push('/(routes)/subscription/plans')}
            style={{
              borderWidth: 1,
              borderColor: colors.primary[500],
              borderRadius: 12,
              paddingVertical: spacing[3],
              alignItems: 'center',
              marginTop: spacing[2],
            }}
            activeOpacity={0.8}
          >
            <Text style={{ ...textStyles.labelMedium, color: colors.primary[500] }}>
              Upgrade Plan
            </Text>
          </TouchableOpacity>

          <HistorySection />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
