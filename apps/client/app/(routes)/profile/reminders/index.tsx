import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks';
import { useProfileStore, upsertPreferences } from '@/modules/profile';
import { toast } from '@/components/ui/toast';

const GOAL_PRESETS = [5, 10, 15, 20, 30];

export default function RemindersScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { preferences, fetchPreferences } = useProfileStore();

  const [reminderEnabled, setReminderEnabled] = useState(preferences?.reminderEnabled ?? false);
  const [reminderTime, setReminderTime] = useState(preferences?.reminderTime ?? '20:00');
  const [dailyGoal, setDailyGoal] = useState(
    preferences?.dailyGoalMinutes ? String(preferences.dailyGoalMinutes) : ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const goalNum = dailyGoal ? parseInt(dailyGoal, 10) : undefined;
    if (dailyGoal && (isNaN(goalNum!) || goalNum! < 1)) {
      toast.error('Enter a valid daily goal (minutes)');
      return;
    }
    if (reminderEnabled && !/^\d{2}:\d{2}$/.test(reminderTime)) {
      toast.error('Time format must be HH:MM (e.g. 20:00)');
      return;
    }

    setIsSaving(true);
    const result = await upsertPreferences({
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : undefined,
      dailyGoalMinutes: goalNum,
    });
    setIsSaving(false);

    if (result.success) {
      await fetchPreferences();
      toast.success('Reminders & goals saved');
      router.back();
    } else {
      toast.error(result.message || 'Failed to save');
    }
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
          activeOpacity={0.7}
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
        >
          <Ionicons name="arrow-back" size={layout.iconMedium} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ ...textStyles.h4, color: colors.text, marginLeft: spacing[3] }}>
          Reminders & Goals
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[6],
          paddingBottom: spacing[10],
          gap: spacing[6],
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Daily Reminder toggle */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
            }}
          >
            <View
              style={{
                width: spacing[9],
                height: spacing[9],
                borderRadius: radius.button,
                backgroundColor: colors.warning.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing[3],
              }}
            >
              <Ionicons name="alarm-outline" size={layout.iconMedium} color={colors.warning.dark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Daily Reminder</Text>
              <Text style={{ ...textStyles.caption, color: colors.textMuted, marginTop: 2 }}>
                {reminderEnabled ? `Enabled at ${reminderTime}` : 'Off'}
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: colors.border, true: colors.primary[300] }}
              thumbColor={reminderEnabled ? colors.primary[500] : colors.textMuted}
            />
          </View>

          {/* Time input — only visible when enabled */}
          {reminderEnabled && (
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.border,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[4],
                gap: spacing[2],
              }}
            >
              <Text style={{ ...textStyles.labelSmall, color: colors.textMuted }}>
                REMINDER TIME (HH:MM)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.input,
                  paddingHorizontal: spacing[4],
                  backgroundColor: colors.background,
                  height: layout.inputHeight,
                  gap: spacing[3],
                }}
              >
                <Ionicons name="time-outline" size={layout.iconMedium} color={colors.textMuted} />
                <TextInput
                  style={{ flex: 1, ...textStyles.bodyMedium, color: colors.text }}
                  placeholder="20:00"
                  placeholderTextColor={colors.textMuted}
                  value={reminderTime}
                  onChangeText={setReminderTime}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
              </View>
            </View>
          )}
        </View>

        {/* Daily Goal */}
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <View
              style={{
                width: spacing[9],
                height: spacing[9],
                borderRadius: radius.button,
                backgroundColor: colors.success.light,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="flag-outline" size={layout.iconMedium} color={colors.success.dark} />
            </View>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Daily Goal</Text>
          </View>

          {/* Preset buttons */}
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            {GOAL_PRESETS.map(min => {
              const isSelected = dailyGoal === String(min);
              return (
                <TouchableOpacity
                  key={min}
                  onPress={() => setDailyGoal(String(min))}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    paddingVertical: spacing[2],
                    borderRadius: radius.button,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.success.main : colors.border,
                    backgroundColor: isSelected ? colors.success.light : colors.surface,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      ...textStyles.labelSmall,
                      color: isSelected ? colors.success.dark : colors.textMuted,
                    }}
                  >
                    {min}m
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom input */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.input,
              paddingHorizontal: spacing[4],
              backgroundColor: colors.surface,
              height: layout.inputHeight,
              gap: spacing[3],
            }}
          >
            <Ionicons name="hourglass-outline" size={layout.iconMedium} color={colors.textMuted} />
            <TextInput
              style={{ flex: 1, ...textStyles.bodyMedium, color: colors.text }}
              placeholder="Custom minutes (e.g. 25)"
              placeholderTextColor={colors.textMuted}
              value={dailyGoal}
              onChangeText={setDailyGoal}
              keyboardType="number-pad"
              maxLength={3}
            />
            {dailyGoal ? (
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>min</Text>
            ) : null}
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.85}
          style={{
            backgroundColor: isSaving ? colors.primary[300] : colors.primary[500],
            borderRadius: radius.button,
            height: layout.buttonHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
