import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { useProfileStore } from '@/modules/profile';
import { useEffect } from 'react';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useSubscriptionStore } from '@/modules/subscription';

interface MenuItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  iconBg: string;
  iconColor: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, iconBg, iconColor, value, onPress, danger }: MenuItemProps) {
  const { colors, spacing, radius, textStyles } = useTheme();
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceHover,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: spacing[9],
          height: spacing[9],
          borderRadius: radius.button,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing[3],
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={{ flex: 1, ...textStyles.bodyMedium, color: danger ? colors.error.main : colors.text }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
        {value ? <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={colors.border} />
      </View>
    </TouchableOpacity>
  );
}

// helper: "FRIENDLY" → "Friendly"
function toLabel(val?: string | null) {
  if (!val) return undefined;
  return val.charAt(0) + val.slice(1).toLowerCase();
}

export default function ProfileScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { user, preferences, fetchMe, fetchPreferences, clearUser } = useProfileStore();
  const { clearTokens } = useAuthStore();
  const { subscription, limits, fetchSubscription, fetchLimits, getPlanName, isFreePlan } = useSubscriptionStore();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          clearUser();
          await clearTokens();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  useEffect(() => {
    fetchMe();
    fetchPreferences();
    fetchSubscription();
    fetchLimits();
  }, []);

  const displayName = user?.fullName ?? 'User';
  const displayEmail = user?.email ?? '';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: spacing[8] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[5] }}>
          <Text style={{ ...textStyles.h3, color: colors.text }}>Profile</Text>
          <TouchableOpacity
            style={{
              width: spacing[11],
              height: spacing[11],
              borderRadius: radius.avatar,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="settings-outline" size={layout.iconLarge} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            padding: spacing[4],
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: spacing[4],
          }}
        >
          <View
            style={{
              width: spacing[14],
              height: spacing[14],
              borderRadius: radius.avatar,
              backgroundColor: colors.primary[500],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing[3],
            }}
          >
            <Text style={{ ...textStyles.h3, color: colors.textInverse }}>{avatarLetter}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{displayName}</Text>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: spacing[0.5] }}>
              {displayEmail}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(routes)/profile/update')}
            activeOpacity={0.7}
            style={{
              width: spacing[9],
              height: spacing[9],
              borderRadius: radius.avatar,
              backgroundColor: colors.primary[50],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="pencil" size={layout.iconSmall} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {/* Subscription Card */}
        <View
          style={{
            backgroundColor: colors.primary[950],
            borderRadius: radius.card,
            padding: spacing[5],
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing[7],
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.primary[500],
                alignSelf: 'flex-start',
                borderRadius: radius.badge,
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[0.5],
                gap: spacing[1],
                marginBottom: spacing[2],
              }}
            >
              <Ionicons name={isFreePlan() ? 'star-outline' : 'star'} size={11} color={colors.textInverse} />
              <Text style={{ ...textStyles.labelSmall, color: colors.textInverse }}>
                {getPlanName().toUpperCase()}
              </Text>
            </View>
            <Text style={{ ...textStyles.labelLarge, color: colors.textInverse }}>{getPlanName()} Plan</Text>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: spacing[0.5] }}>
              {isFreePlan() ? 'Upgrade to unlock unlimited voices' : 'Active subscription'}
            </Text>
          </View>
          {isFreePlan() && (
            <TouchableOpacity
              onPress={() => router.push('/(routes)/subscription/plans')}
              style={{
                backgroundColor: colors.primary[500],
                borderRadius: radius.button,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[2],
              }}
              activeOpacity={0.85}
            >
              <Text style={{ ...textStyles.buttonSmall, color: colors.textInverse }}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Usage Stats */}
        <Text style={{ ...textStyles.labelSmall, color: colors.textMuted, marginBottom: spacing[2] }}>
          USAGE
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            padding: spacing[5],
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: spacing[7],
          }}
        >
          {[
            {
              value: limits ? `${limits.VOICE_CLONES.used}${limits.VOICE_CLONES.limit === -1 ? '' : `/${limits.VOICE_CLONES.limit}`}` : '—',
              label: 'Voices',
            },
            {
              value: limits ? `${limits.VOICE_CHATS.used}${limits.VOICE_CHATS.limit === -1 ? '' : `/${limits.VOICE_CHATS.limit}`}` : '—',
              label: 'Chats',
            },
            {
              value: limits ? `${limits.AI_BOTS.used}${limits.AI_BOTS.limit === -1 ? '' : `/${limits.AI_BOTS.limit}`}` : '—',
              label: 'Bots',
            },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ ...textStyles.h3, color: colors.text }}>{stat.value}</Text>
                <Text style={{ ...textStyles.caption, color: colors.textMuted, marginTop: spacing[1], textAlign: 'center' }}>
                  {stat.label}
                </Text>
              </View>
              {i < arr.length - 1 && (
                <View style={{ width: 1, height: 36, backgroundColor: colors.border, alignSelf: 'center' }} />
              )}
            </View>
          ))}
        </View>

        {/* Account */}
        <Text style={{ ...textStyles.labelSmall, color: colors.textMuted, marginBottom: spacing[2] }}>ACCOUNT</Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing[5] }}>
          <MenuItem icon="card-outline" label="Subscription" iconBg={colors.primary[100]} iconColor={colors.primary[600]} value={getPlanName()} onPress={() => router.push('/(routes)/subscription/plans')} />
          <MenuItem icon="bar-chart-outline" label="Usage & Limits" iconBg={colors.secondary[100]} iconColor={colors.secondary[600]} onPress={() => router.push('/(routes)/subscription/usage')} />
          <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" iconBg={colors.success.light} iconColor={colors.success.dark} />
        </View>

        {/* Preferences */}
        <Text style={{ ...textStyles.labelSmall, color: colors.textMuted, marginBottom: spacing[2] }}>PREFERENCES</Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing[5] }}>
          <MenuItem icon="mic-outline" label="Voice Preferences" iconBg={colors.primary[100]} iconColor={colors.primary[600]} value={toLabel(preferences?.talkType) ?? 'Set up'} onPress={() => router.push('/(routes)/profile/voice-preferences')} />
          <MenuItem icon="bookmark-outline" label="Topics" iconBg={colors.secondary[100]} iconColor={colors.secondary[600]} value={preferences?.topicsOfInterest?.length ? `${preferences.topicsOfInterest.length} topics` : 'Set up'} onPress={() => router.push('/(routes)/profile/topics')} />
        </View>

        {/* App */}
        <Text style={{ ...textStyles.labelSmall, color: colors.textMuted, marginBottom: spacing[2] }}>APP</Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing[5] }}>
          <MenuItem icon="notifications-outline" label="Notifications" iconBg={colors.warning.light} iconColor={colors.warning.dark} />
          <MenuItem icon="help-circle-outline" label="Help & Support" iconBg={colors.surfaceHover} iconColor={colors.textMuted} />
          <MenuItem icon="information-circle-outline" label="About AwaazAI" iconBg={colors.surfaceHover} iconColor={colors.textMuted} />
        </View>

        {/* Logout */}
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing[5] }}>
          <MenuItem icon="log-out-outline" label="Log Out" iconBg={colors.error.light} iconColor={colors.error.main} danger onPress={handleLogout} />
        </View>

        <Text style={{ ...textStyles.caption, color: colors.border, textAlign: 'center' }}>AwaazAI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
