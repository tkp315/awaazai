import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';
import { getCapabilityDisplay, TRAINING_STATUS_DISPLAY, useBotsStore } from '@/modules/bots';
import type { IBotCapability } from '@/modules/bots';

interface CapabilityCardProps {
  botCapability: IBotCapability;
  botId: string;
}

function CapabilityCard({ botCapability, botId }: CapabilityCardProps): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();
  const { capability, isEnabled } = botCapability;
  const display = getCapabilityDisplay(capability.name);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: spacing[3],
      }}
    >
      {/* Capability Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing[4],
          gap: spacing[3],
          backgroundColor: display.bg,
        }}
      >
        <View
          style={{
            width: spacing[12],
            height: spacing[12],
            borderRadius: radius.button,
            backgroundColor: display.color + '20',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={display.icon as any} size={24} color={display.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{capability.name}</Text>
          <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
            {capability.description}
          </Text>
        </View>
        {!isEnabled && (
          <View
            style={{
              paddingHorizontal: spacing[2],
              paddingVertical: 2,
              borderRadius: radius.badge,
              backgroundColor: colors.warning.light,
            }}
          >
            <Text style={{ ...textStyles.caption, color: colors.warning.dark, fontWeight: '600' }}>
              Disabled
            </Text>
          </View>
        )}
      </View>

      {/* Functions */}
      {capability.functions.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing[1.5],
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          {capability.functions.map(fn => (
            <View
              key={fn.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: spacing[2.5],
                paddingVertical: spacing[1],
                borderRadius: radius.badge,
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="flash-outline" size={11} color={display.color} />
              <Text style={{ ...textStyles.caption, color: colors.text, fontWeight: '600' }}>
                {fn.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Train & Use Actions */}
      <View
        style={{
          flexDirection: 'row',
          gap: spacing[3],
          padding: spacing[4],
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(routes)/bots/[botId]/train',
              params: { botId, capabilityId: botCapability.capabilityId },
            })
          }
          activeOpacity={0.8}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            paddingVertical: spacing[2.5],
            borderRadius: radius.button,
            borderWidth: 1.5,
            borderColor: display.color,
            backgroundColor: display.bg,
          }}
        >
          <Ionicons name="school-outline" size={16} color={display.color} />
          <Text style={{ ...textStyles.labelMedium, color: display.color }}>Train</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(routes)/bots/[botId]/use',
              params: { botId, capabilityId: botCapability.capabilityId },
            })
          }
          activeOpacity={0.8}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            paddingVertical: spacing[2.5],
            borderRadius: radius.button,
            backgroundColor: display.color,
          }}
        >
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={{ ...textStyles.labelMedium, color: '#fff' }}>Use</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function BotProfileScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { botId } = useLocalSearchParams<{ botId: string }>();
  const [showOptions, setShowOptions] = useState(false);

  const { activeBot, loadingBot, fetchBotById, deleteBot } = useBotsStore();

  useEffect(() => {
    if (botId) fetchBotById(botId);
  }, [botId]);

  if (loadingBot || !activeBot) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  const bot = activeBot;
  const enabledCaps = bot.capability.filter(c => c.isEnabled !== false);
  const latestTraining = bot.trainings[0];
  const trainingDisplay = latestTraining
    ? TRAINING_STATUS_DISPLAY[latestTraining.status]
    : null;

  const handleDelete = (): void => {
    setShowOptions(false);
    Alert.alert(
      'Delete Bot',
      `Are you sure you want to delete "${bot.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBot(botId);
            router.replace('/(tabs)/bots');
          },
        },
      ]
    );
  };

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
          <Ionicons name="arrow-back" size={layout.iconMedium} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ ...textStyles.h4, color: colors.text, flex: 1, marginLeft: spacing[3] }}>
          Bot Profile
        </Text>

        <TouchableOpacity
          onPress={() => setShowOptions(true)}
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
          <Ionicons name="ellipsis-vertical" size={layout.iconMedium} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[5],
          paddingBottom: spacing[10],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Bot Identity Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing[5],
            alignItems: 'center',
            marginBottom: spacing[5],
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: spacing[24],
              height: spacing[24],
              borderRadius: radius.avatar,
              backgroundColor: colors.primary[50],
              borderWidth: 2,
              borderColor: colors.primary[200],
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing[3],
            }}
          >
            <Text style={{ fontSize: 48 }}>{bot.avatar ?? '🤖'}</Text>
          </View>

          {/* Name + Status */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <Text style={{ ...textStyles.h3, color: colors.text }}>{bot.name}</Text>
            <View
              style={{
                paddingHorizontal: spacing[2.5],
                paddingVertical: 3,
                borderRadius: radius.badge,
                backgroundColor: bot.status === 'ACTIVE' ? '#ecfdf5' : colors.surfaceHover,
              }}
            >
              <Text
                style={{
                  ...textStyles.caption,
                  color: bot.status === 'ACTIVE' ? '#059669' : colors.textMuted,
                  fontWeight: '700',
                }}
              >
                {bot.status}
              </Text>
            </View>
          </View>

          {bot.purpose && (
            <Text
              style={{
                ...textStyles.bodyMedium,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: spacing[2],
                lineHeight: 22,
              }}
            >
              {bot.purpose}
            </Text>
          )}

          {/* Stats Row */}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: spacing[5],
              paddingTop: spacing[4],
              borderTopWidth: 1,
              borderTopColor: colors.border,
              gap: spacing[1],
            }}
          >
            {[
              { label: 'Capabilities', value: enabledCaps.length },
              { label: 'Knowledge Items', value: bot._count.knowledge },
              { label: 'Trainings', value: bot._count.trainings },
            ].map((stat, i) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderRightWidth: i < 2 ? 1 : 0,
                  borderRightColor: colors.border,
                }}
              >
                <Text style={{ ...textStyles.h3, color: colors.primary[500] }}>{stat.value}</Text>
                <Text style={{ ...textStyles.caption, color: colors.textMuted, textAlign: 'center' }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Last Training Status */}
          {trainingDisplay && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[2],
                marginTop: spacing[3],
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1.5],
                borderRadius: radius.badge,
                backgroundColor: trainingDisplay.bg,
              }}
            >
              <Ionicons
                name={trainingDisplay.icon as any}
                size={14}
                color={trainingDisplay.color}
              />
              <Text style={{ ...textStyles.caption, color: trainingDisplay.color, fontWeight: '600' }}>
                Last training: {trainingDisplay.label}
              </Text>
            </View>
          )}
        </View>

        {/* Capabilities Section */}
        <Text
          style={{ ...textStyles.labelLarge, color: colors.text, marginBottom: spacing[3] }}
        >
          Capabilities
        </Text>

        {enabledCaps.length > 0 ? (
          enabledCaps.map(bc => (
            <CapabilityCard key={bc.id} botCapability={bc} botId={bot.id} />
          ))
        ) : (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[6],
              alignItems: 'center',
              marginBottom: spacing[5],
            }}
          >
            <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted }}>
              No capabilities enabled
            </Text>
          </View>
        )}

        {/* Settings & Config Section */}
        <Text
          style={{
            ...textStyles.labelLarge,
            color: colors.text,
            marginBottom: spacing[3],
            marginTop: spacing[2],
          }}
        >
          Configuration
        </Text>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            marginBottom: spacing[5],
          }}
        >
          {[
            {
              icon: 'settings-outline',
              label: 'Personality & Settings',
              sublabel: 'Tone, language, response format',
              route: '/(routes)/bots/[botId]/settings',
              params: { botId: bot.id },
            },
            {
              icon: 'shield-checkmark-outline',
              label: 'Rules & Safety',
              sublabel: 'Content filters, topic restrictions',
              route: null,
              params: null,
            },
            {
              icon: 'alarm-outline',
              label: 'Reminders',
              sublabel: 'Schedule bot check-ins',
              route: null,
              params: null,
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                if (item.route) {
                  router.push({
                    pathname: item.route as any,
                    params: item.params ?? {},
                  });
                }
              }}
              activeOpacity={item.route ? 0.7 : 1}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[4],
                borderTopWidth: i > 0 ? 1 : 0,
                borderTopColor: colors.border,
                gap: spacing[3],
              }}
            >
              <View
                style={{
                  width: spacing[10],
                  height: spacing[10],
                  borderRadius: radius.button,
                  backgroundColor: colors.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Ionicons name={item.icon as any} size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...textStyles.labelMedium, color: colors.text }}>{item.label}</Text>
                <Text style={{ ...textStyles.caption, color: colors.textMuted }}>{item.sublabel}</Text>
              </View>
              <Ionicons
                name={item.route ? 'chevron-forward' : 'lock-closed-outline'}
                size={16}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <View
          style={{
            backgroundColor: '#fff1f2',
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: '#fecdd3',
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: spacing[4],
              gap: spacing[3],
            }}
          >
            <View
              style={{
                width: spacing[10],
                height: spacing[10],
                borderRadius: radius.button,
                backgroundColor: '#fee2e2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#dc2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...textStyles.labelMedium, color: '#dc2626' }}>Delete Bot</Text>
              <Text style={{ ...textStyles.caption, color: '#f87171' }}>
                Permanently delete this bot and all its data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#f87171" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.overlay }}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.modal,
              borderTopRightRadius: radius.modal,
              paddingBottom: spacing[8],
              paddingTop: spacing[2],
            }}
          >
            {/* Handle */}
            <View
              style={{
                width: spacing[10],
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.border,
                alignSelf: 'center',
                marginBottom: spacing[4],
              }}
            />

            {[
              {
                icon: 'create-outline',
                label: 'Edit Bot',
                action: () => { setShowOptions(false); },
              },
              {
                icon: bot.status === 'ACTIVE' ? 'pause-circle-outline' : 'play-circle-outline',
                label: bot.status === 'ACTIVE' ? 'Deactivate Bot' : 'Activate Bot',
                action: () => { setShowOptions(false); },
              },
              {
                icon: 'share-outline',
                label: 'Share Bot',
                action: () => { setShowOptions(false); },
              },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                onPress={item.action}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[4],
                  paddingHorizontal: layout.screenPaddingHorizontal,
                  paddingVertical: spacing[4],
                }}
              >
                <Ionicons name={item.icon as any} size={22} color={colors.text} />
                <Text style={{ ...textStyles.bodyMedium, color: colors.text }}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing[2] }} />

            <TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[4],
                paddingHorizontal: layout.screenPaddingHorizontal,
                paddingVertical: spacing[4],
              }}
            >
              <Ionicons name="trash-outline" size={22} color={colors.error.main} />
              <Text style={{ ...textStyles.bodyMedium, color: colors.error.main }}>Delete Bot</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
