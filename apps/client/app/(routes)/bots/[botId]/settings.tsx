import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';
import { BOT_TONE_OPTIONS, useBotsStore } from '@/modules/bots';
import type { BotTone, ResponseLength, VoiceSpeed } from '@/modules/bots';

const RESPONSE_LENGTHS: Array<{ value: ResponseLength; label: string; sub: string }> = [
  { value: 'SHORT', label: 'Short', sub: '1-2 lines' },
  { value: 'MEDIUM', label: 'Medium', sub: '3-5 lines' },
  { value: 'DETAILED', label: 'Detailed', sub: 'Full explanation' },
];

const VOICE_SPEEDS: Array<{ value: VoiceSpeed; label: string; icon: string }> = [
  { value: 'SLOW', label: 'Slow', icon: 'turtle-outline' },
  { value: 'NORMAL', label: 'Normal', icon: 'speedometer-outline' },
  { value: 'FAST', label: 'Fast', icon: 'flash-outline' },
];

export default function BotSettingsScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { botId } = useLocalSearchParams<{ botId: string }>();

  const { activeBot, isSavingConfig, updateBotConfig } = useBotsStore();
  const existingConfig = activeBot?.config;

  // Personality
  const [tone, setTone] = useState<BotTone>(existingConfig?.tone ?? 'FRIENDLY');
  const [welcomeMessage, setWelcomeMessage] = useState(existingConfig?.welcomeMessage ?? '');
  const [customPrompt, setCustomPrompt] = useState(existingConfig?.customPrompt ?? '');

  // Language
  const [primaryLanguage, setPrimaryLanguage] = useState(existingConfig?.primaryLanguage ?? 'en');
  const [languageMixing, setLanguageMixing] = useState(existingConfig?.languageMixing ?? false);

  // Response
  const [responseLength, setResponseLength] = useState<ResponseLength>(
    existingConfig?.responseLength ?? 'MEDIUM'
  );
  const [useEmoji, setUseEmoji] = useState(existingConfig?.useEmoji ?? false);

  // Behavior
  const [autoGreet, setAutoGreet] = useState(existingConfig?.autoGreet ?? true);
  const [rememberContext, setRememberContext] = useState(existingConfig?.rememberContext ?? true);

  // Voice
  const [voiceSpeed, setVoiceSpeed] = useState<VoiceSpeed>(existingConfig?.voiceSpeed ?? 'NORMAL');

  useEffect(() => {
    if (existingConfig) {
      setTone(existingConfig.tone);
      setWelcomeMessage(existingConfig.welcomeMessage ?? '');
      setCustomPrompt(existingConfig.customPrompt ?? '');
      setPrimaryLanguage(existingConfig.primaryLanguage);
      setLanguageMixing(existingConfig.languageMixing);
      setResponseLength(existingConfig.responseLength);
      setUseEmoji(existingConfig.useEmoji);
      setAutoGreet(existingConfig.autoGreet);
      setRememberContext(existingConfig.rememberContext);
      setVoiceSpeed(existingConfig.voiceSpeed);
    }
  }, [existingConfig]);

  const handleSave = async (): Promise<void> => {
    const result = await updateBotConfig(botId, {
      tone,
      welcomeMessage: welcomeMessage.trim() || undefined,
      customPrompt: customPrompt.trim() || undefined,
      primaryLanguage: primaryLanguage.trim() || 'en',
      languageMixing,
      responseLength,
      useEmoji,
      autoGreet,
      rememberContext,
      voiceSpeed,
    });
    if (result) {
      router.back();
    } else {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
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
          Bot Settings
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSavingConfig}
          style={{
            backgroundColor: colors.primary[500],
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[2],
            borderRadius: radius.button,
          }}
          activeOpacity={0.85}
        >
          {isSavingConfig ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <Text style={{ ...textStyles.buttonSmall, color: colors.textInverse }}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[5],
          paddingBottom: spacing[10],
          gap: spacing[6],
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ---- Personality ---- */}
        <View style={{ gap: spacing[3] }}>
          <SectionLabel
            label="Personality"
            icon="happy-outline"
            colors={colors}
            textStyles={textStyles}
            spacing={spacing}
            radius={radius}
          />

          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Tone</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
              {BOT_TONE_OPTIONS.map(opt => {
                const isSelected = tone === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setTone(opt.value as BotTone)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[1.5],
                      paddingHorizontal: spacing[3],
                      paddingVertical: spacing[2],
                      borderRadius: radius.button,
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.primary[500] : colors.border,
                      backgroundColor: isSelected ? colors.primary[50] : colors.surface,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{opt.emoji}</Text>
                    <Text
                      style={{
                        ...textStyles.labelSmall,
                        color: isSelected ? colors.primary[600] : colors.textMuted,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
              Welcome Message{' '}
              <Text style={{ color: colors.textMuted, fontWeight: '400' }}>(optional)</Text>
            </Text>
            <TextInput
              style={{
                ...textStyles.bodyMedium,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.input,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                backgroundColor: colors.surface,
                minHeight: spacing[14],
                textAlignVertical: 'top',
              }}
              placeholder='e.g. "Hey! Kaise ho? Kya padhna hai aaj?"'
              placeholderTextColor={colors.textMuted}
              value={welcomeMessage}
              onChangeText={setWelcomeMessage}
              multiline
              maxLength={200}
            />
          </View>

          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
              Custom Instructions{' '}
              <Text style={{ color: colors.textMuted, fontWeight: '400' }}>(optional)</Text>
            </Text>
            <TextInput
              style={{
                ...textStyles.bodyMedium,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.input,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                backgroundColor: colors.surface,
                minHeight: spacing[20],
                textAlignVertical: 'top',
              }}
              placeholder="Any specific instructions for how this bot should behave..."
              placeholderTextColor={colors.textMuted}
              value={customPrompt}
              onChangeText={setCustomPrompt}
              multiline
              maxLength={500}
            />
          </View>
        </View>

        {/* ---- Response ---- */}
        <View style={{ gap: spacing[3] }}>
          <SectionLabel
            label="Response"
            icon="chatbox-outline"
            colors={colors}
            textStyles={textStyles}
            spacing={spacing}
            radius={radius}
          />

          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Response Length</Text>
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              {RESPONSE_LENGTHS.map(opt => {
                const isSelected = responseLength === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setResponseLength(opt.value)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: spacing[3],
                      borderRadius: radius.button,
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.primary[500] : colors.border,
                      backgroundColor: isSelected ? colors.primary[50] : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        ...textStyles.labelMedium,
                        color: isSelected ? colors.primary[600] : colors.text,
                      }}
                    >
                      {opt.label}
                    </Text>
                    <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                      {opt.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <ToggleRow
            label="Use Emojis"
            sublabel="Bot adds emojis in responses"
            value={useEmoji}
            onToggle={setUseEmoji}
            colors={colors}
            textStyles={textStyles}
            spacing={spacing}
            radius={radius}
          />
        </View>

        {/* ---- Language ---- */}
        <View style={{ gap: spacing[3] }}>
          <SectionLabel
            label="Language"
            icon="language-outline"
            colors={colors}
            textStyles={textStyles}
            spacing={spacing}
            radius={radius}
          />

          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Primary Language</Text>
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
              <Ionicons name="language-outline" size={layout.iconMedium} color={colors.textMuted} />
              <TextInput
                style={{ flex: 1, ...textStyles.bodyMedium, color: colors.text }}
                placeholder="en (English), hi (Hindi)..."
                placeholderTextColor={colors.textMuted}
                value={primaryLanguage}
                onChangeText={setPrimaryLanguage}
                autoCapitalize="none"
                maxLength={10}
              />
            </View>
          </View>

          <ToggleRow
            label="Hinglish Mode"
            sublabel="Allow mixing Hindi & English"
            value={languageMixing}
            onToggle={setLanguageMixing}
            colors={colors}
            textStyles={textStyles}
            spacing={spacing}
            radius={radius}
          />
        </View>

        {/* ---- Voice ---- */}
        <View style={{ gap: spacing[3] }}>
          <SectionLabel
            label="Voice"
            icon="mic-outline"
            colors={colors}
            textStyles={textStyles}
            spacing={spacing}
            radius={radius}
          />

          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Voice Speed</Text>
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              {VOICE_SPEEDS.map(opt => {
                const isSelected = voiceSpeed === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setVoiceSpeed(opt.value)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing[1.5],
                      paddingVertical: spacing[3],
                      borderRadius: radius.button,
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.primary[500] : colors.border,
                      backgroundColor: isSelected ? colors.primary[50] : colors.surface,
                    }}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={16}
                      color={isSelected ? colors.primary[600] : colors.textMuted}
                    />
                    <Text
                      style={{
                        ...textStyles.labelSmall,
                        color: isSelected ? colors.primary[600] : colors.textMuted,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ---- Behavior ---- */}
        <View style={{ gap: spacing[3] }}>
          <SectionLabel
            label="Behavior"
            icon="options-outline"
            colors={colors}
            textStyles={textStyles}
            spacing={spacing}
            radius={radius}
          />

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
            }}
          >
            <ToggleRow
              label="Auto Greet"
              sublabel="Bot sends a welcome message first"
              value={autoGreet}
              onToggle={setAutoGreet}
              colors={colors}
              textStyles={textStyles}
              spacing={spacing}
              radius={radius}
              bordered={false}
              inCard
            />
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <ToggleRow
              label="Remember Context"
              sublabel="Bot remembers previous conversations"
              value={rememberContext}
              onToggle={setRememberContext}
              colors={colors}
              textStyles={textStyles}
              spacing={spacing}
              radius={radius}
              bordered={false}
              inCard
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSavingConfig}
          activeOpacity={0.85}
          style={{
            backgroundColor: isSavingConfig ? colors.primary[300] : colors.primary[500],
            borderRadius: radius.button,
            height: layout.buttonHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSavingConfig ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
              Save Settings
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---- Helper Components ----

function SectionLabel({
  label,
  icon,
  colors,
  textStyles,
  spacing,
  radius,
}: {
  label: string;
  icon: string;
  colors: any;
  textStyles: any;
  spacing: any;
  radius: any;
}): React.JSX.Element {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
      <View
        style={{
          width: spacing[8],
          height: spacing[8],
          borderRadius: radius.button,
          backgroundColor: colors.primary[50],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon as any} size={16} color={colors.primary[500]} />
      </View>
      <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{label}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  sublabel,
  value,
  onToggle,
  colors,
  textStyles,
  spacing,
  radius,
  bordered = true,
  inCard = false,
}: {
  label: string;
  sublabel: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: any;
  textStyles: any;
  spacing: any;
  radius: any;
  bordered?: boolean;
  inCard?: boolean;
}): React.JSX.Element {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: inCard ? spacing[4] : spacing[3],
        paddingHorizontal: inCard ? spacing[4] : 0,
        borderWidth: bordered ? 1 : 0,
        borderColor: colors.border,
        borderRadius: bordered ? radius.card : 0,
        backgroundColor: inCard ? 'transparent' : colors.surface,
        gap: spacing[3],
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ ...textStyles.labelMedium, color: colors.text }}>{label}</Text>
        <Text style={{ ...textStyles.caption, color: colors.textMuted }}>{sublabel}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary[400] }}
        thumbColor={value ? colors.primary[500] : '#f4f3f4'}
      />
    </View>
  );
}
