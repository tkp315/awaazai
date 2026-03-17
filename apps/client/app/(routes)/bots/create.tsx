import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';
import { BOT_AVATAR_EMOJIS, getCapabilityDisplay, useBotsStore, getAwaazBotVoices } from '@/modules/bots';
import type { IAvailableBot, IBotVoice } from '@/modules/bots';
import { AWAAZBOT_AVAILABLE_BOT_ID } from '@/shared/constants';
import { PaywallModal } from '@/components/ui/paywall';

type StepId = 'identity' | 'botType' | 'voice' | 'success';

export default function CreateBotScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { availableBotId: preselectedId } = useLocalSearchParams<{ availableBotId?: string }>();
  const { availableBots, loadingAvailable, isCreating, limitReached, clearLimitReached, fetchAvailableBots, createBot } = useBotsStore();

  const [step, setStep] = useState<StepId>('identity');
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [avatar, setAvatar] = useState('🤖');
  const [selectedBotTemplate, setSelectedBotTemplate] = useState<IAvailableBot | null>(null);
  const [createdBotId, setCreatedBotId] = useState<string | null>(null);

  // Voice selection state
  const [awaazBotVoices, setAwaazBotVoices] = useState<IBotVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [loadingVoices, setLoadingVoices] = useState(false);

  const hasPreselection = !!preselectedId;
  const isAwaazBot = selectedBotTemplate?.id === AWAAZBOT_AVAILABLE_BOT_ID;

  // Compute step order for progress indicator
  const stepOrder: StepId[] = ['identity'];
  if (!hasPreselection) stepOrder.push('botType');
  if (!isAwaazBot && selectedBotTemplate !== null) stepOrder.push('voice');
  stepOrder.push('success');

  const currentStepIndex = stepOrder.indexOf(step);
  const totalVisibleSteps = stepOrder.filter(s => s !== 'success').length;
  const currentVisibleIndex = stepOrder.filter(s => s !== 'success').indexOf(step);

  useEffect(() => {
    fetchAvailableBots();
  }, []);

  // Pre-select bot template when coming from tab screen
  useEffect(() => {
    if (preselectedId && availableBots.length > 0) {
      const found = availableBots.find(b => b.id === preselectedId);
      if (found) setSelectedBotTemplate(found);
    }
  }, [preselectedId, availableBots]);

  const fetchVoices = useCallback(async () => {
    setLoadingVoices(true);
    try {
      const voices = await getAwaazBotVoices(AWAAZBOT_AVAILABLE_BOT_ID);
      setAwaazBotVoices(voices);
    } finally {
      setLoadingVoices(false);
    }
  }, []);

  const handleCreate = async (): Promise<void> => {
    if (!selectedBotTemplate) return;
    const bot = await createBot({
      name: name.trim(),
      purpose: purpose.trim() || undefined,
      avatar,
      availableBotId: selectedBotTemplate.id,
      selectedVoiceId: selectedVoiceId ?? undefined,
    });
    if (bot) {
      setCreatedBotId(bot.id);
      setStep('success');
    }
  };

  const goToVoiceOrCreate = async (template: IAvailableBot): Promise<void> => {
    const isAwaaz = template.id === AWAAZBOT_AVAILABLE_BOT_ID;
    if (isAwaaz) {
      await handleCreateWithTemplate(template);
    } else {
      await fetchVoices();
      setStep('voice');
    }
  };

  const handleCreateWithTemplate = async (template: IAvailableBot): Promise<void> => {
    const bot = await createBot({
      name: name.trim(),
      purpose: purpose.trim() || undefined,
      avatar,
      availableBotId: template.id,
      selectedVoiceId: null,
    });
    if (bot) {
      setCreatedBotId(bot.id);
      setStep('success');
    }
  };

  // Step 1 next button
  const handleIdentityNext = (): void => {
    if (hasPreselection && selectedBotTemplate) {
      void goToVoiceOrCreate(selectedBotTemplate);
    } else {
      setStep('botType');
    }
  };

  // Step 2 (botType) — user selected a template and clicked Create
  const handleBotTypeNext = async (): Promise<void> => {
    if (!selectedBotTemplate) return;
    await goToVoiceOrCreate(selectedBotTemplate);
  };

  // Step voice next
  const handleVoiceNext = async (): Promise<void> => {
    await handleCreate();
  };

  const handleBackPress = (): void => {
    if (step === 'botType') {
      setStep('identity');
    } else if (step === 'voice') {
      if (hasPreselection) {
        setStep('identity');
      } else {
        setStep('botType');
      }
    } else {
      router.back();
    }
  };

  const canProceedIdentity = name.trim().length > 0;
  const canProceedBotType = selectedBotTemplate !== null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <PaywallModal
        visible={limitReached}
        limitKey="AI_BOTS"
        onClose={clearLimitReached}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
            onPress={step === 'success' ? () => router.back() : handleBackPress}
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
          <View style={{ flex: 1, marginLeft: spacing[3] }}>
            <Text style={{ ...textStyles.h4, color: colors.text }}>Create Bot</Text>
            {step !== 'success' && currentVisibleIndex >= 0 && (
              <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                Step {currentVisibleIndex + 1} of {totalVisibleSteps}
              </Text>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        {step !== 'success' && totalVisibleSteps > 1 && currentVisibleIndex >= 0 && (
          <View style={{ height: 3, backgroundColor: colors.border }}>
            <View
              style={{
                height: 3,
                width: `${((currentVisibleIndex + 1) / totalVisibleSteps) * 100}%`,
                backgroundColor: colors.primary[500],
                borderRadius: 2,
              }}
            />
          </View>
        )}

        {/* ---- STEP: Identity ---- */}
        {step === 'identity' && (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: layout.screenPaddingHorizontal,
              paddingTop: spacing[6],
              paddingBottom: spacing[10],
              gap: spacing[5],
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <Text style={{ ...textStyles.h4, color: colors.text }}>Give your bot an identity</Text>
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: spacing[1] }}>
                Choose a name and avatar for your bot
              </Text>
            </View>

            {/* Selected bot template preview — only when pre-selected */}
            {selectedBotTemplate && hasPreselection && (
              <SelectedTemplateChip bot={selectedBotTemplate} />
            )}

            {/* Avatar Picker */}
            <View style={{ alignItems: 'center' }}>
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
                  marginBottom: spacing[4],
                }}
              >
                <Text style={{ fontSize: 48 }}>{avatar}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], justifyContent: 'center' }}>
                {BOT_AVATAR_EMOJIS.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => setAvatar(emoji)}
                    style={{
                      width: spacing[11],
                      height: spacing[11],
                      borderRadius: radius.button,
                      backgroundColor: avatar === emoji ? colors.primary[100] : colors.surface,
                      borderWidth: 1.5,
                      borderColor: avatar === emoji ? colors.primary[400] : colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 22 }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bot Name */}
            <View style={{ gap: spacing[1] }}>
              <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Bot Name *</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: name.length > 0 ? colors.borderFocus : colors.border,
                  borderRadius: radius.input,
                  paddingHorizontal: spacing[4],
                  backgroundColor: colors.surface,
                  height: layout.inputHeight,
                  gap: spacing[3],
                }}
              >
                <Ionicons name="hardware-chip-outline" size={layout.iconMedium} color={colors.textMuted} />
                <TextInput
                  style={{ flex: 1, ...textStyles.bodyMedium, color: colors.text }}
                  placeholder="e.g. Study Buddy, Voice Mom"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  maxLength={50}
                />
              </View>
            </View>

            {/* Purpose */}
            <View style={{ gap: spacing[1] }}>
              <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
                Purpose{' '}
                <Text style={{ color: colors.textMuted, fontWeight: '400' }}>(optional)</Text>
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.input,
                  paddingHorizontal: spacing[4],
                  paddingTop: spacing[3],
                  backgroundColor: colors.surface,
                  minHeight: spacing[24],
                }}
              >
                <TextInput
                  style={{ ...textStyles.bodyMedium, color: colors.text, textAlignVertical: 'top' }}
                  placeholder="What will this bot help you with?"
                  placeholderTextColor={colors.textMuted}
                  value={purpose}
                  onChangeText={setPurpose}
                  multiline
                  maxLength={200}
                />
              </View>
              <Text style={{ ...textStyles.caption, color: colors.textMuted, textAlign: 'right' }}>
                {purpose.length}/200
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleIdentityNext}
              disabled={!canProceedIdentity || (hasPreselection && isCreating)}
              activeOpacity={0.85}
              style={{
                backgroundColor: canProceedIdentity ? colors.primary[500] : colors.primary[200],
                borderRadius: radius.button,
                height: layout.buttonHeight,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: spacing[2],
              }}
            >
              {hasPreselection && isCreating ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <>
                  <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
                    {hasPreselection
                      ? isAwaazBot
                        ? 'Create Bot'
                        : 'Next: Select Voice'
                      : 'Next: Choose Bot Type'}
                  </Text>
                  <Ionicons
                    name={hasPreselection && isAwaazBot ? 'checkmark-circle' : 'arrow-forward'}
                    size={18}
                    color={colors.textInverse}
                  />
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ---- STEP: Bot Type (only shown when no pre-selection) ---- */}
        {step === 'botType' && (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: layout.screenPaddingHorizontal,
              paddingTop: spacing[6],
              paddingBottom: spacing[10],
              gap: spacing[4],
            }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={{ ...textStyles.h4, color: colors.text }}>Choose bot type</Text>
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: spacing[1] }}>
                Select what kind of bot you want to create
              </Text>
            </View>

            {loadingAvailable ? (
              <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
              </View>
            ) : (
              availableBots.map(bot => {
                const display = getCapabilityDisplay(bot.name);
                const isSelected = selectedBotTemplate?.id === bot.id;
                return (
                  <TouchableOpacity
                    key={bot.id}
                    onPress={() => setSelectedBotTemplate(bot)}
                    activeOpacity={0.8}
                    style={{
                      borderWidth: 2,
                      borderColor: isSelected ? colors.primary[400] : colors.border,
                      borderRadius: radius.card,
                      padding: spacing[4],
                      backgroundColor: isSelected ? colors.primary[50] : colors.surface,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                      <View
                        style={{
                          width: spacing[12],
                          height: spacing[12],
                          borderRadius: radius.button,
                          backgroundColor: display.bg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {bot.icon ? (
                          <Text style={{ fontSize: 26 }}>{bot.icon}</Text>
                        ) : (
                          <Ionicons name={display.icon as any} size={26} color={display.color} />
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ ...textStyles.labelLarge, color: colors.text }}>{bot.name}</Text>
                        <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
                          {bot.description}
                        </Text>
                      </View>

                      <View
                        style={{
                          width: spacing[6],
                          height: spacing[6],
                          borderRadius: spacing[3],
                          borderWidth: 2,
                          borderColor: isSelected ? colors.primary[500] : colors.border,
                          backgroundColor: isSelected ? colors.primary[500] : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
                      </View>
                    </View>

                    {bot.capabilities.length > 0 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: spacing[1.5],
                          marginTop: spacing[3],
                          paddingTop: spacing[3],
                          borderTopWidth: 1,
                          borderTopColor: isSelected ? colors.primary[200] : colors.border,
                        }}
                      >
                        {bot.capabilities.map(cap => (
                          <View
                            key={cap.id}
                            style={{
                              paddingHorizontal: spacing[2.5],
                              paddingVertical: spacing[1],
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
                  </TouchableOpacity>
                );
              })
            )}

            <TouchableOpacity
              onPress={handleBotTypeNext}
              disabled={!canProceedBotType || isCreating || loadingVoices}
              activeOpacity={0.85}
              style={{
                backgroundColor: canProceedBotType && !isCreating ? colors.primary[500] : colors.primary[200],
                borderRadius: radius.button,
                height: layout.buttonHeight,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: spacing[2],
                marginTop: spacing[2],
              }}
            >
              {isCreating || loadingVoices ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <>
                  <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
                    {selectedBotTemplate && selectedBotTemplate.id !== AWAAZBOT_AVAILABLE_BOT_ID
                      ? 'Next: Select Voice'
                      : 'Create Bot'}
                  </Text>
                  <Ionicons
                    name={
                      selectedBotTemplate && selectedBotTemplate.id !== AWAAZBOT_AVAILABLE_BOT_ID
                        ? 'arrow-forward'
                        : 'checkmark-circle'
                    }
                    size={20}
                    color={colors.textInverse}
                  />
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ---- STEP: Voice Selection ---- */}
        {step === 'voice' && (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: layout.screenPaddingHorizontal,
              paddingTop: spacing[6],
              paddingBottom: spacing[10],
              gap: spacing[4],
            }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={{ ...textStyles.h4, color: colors.text }}>Select a cloned voice</Text>
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: spacing[1] }}>
                Choose a voice from your AwaazBot library for this bot to speak in
              </Text>
            </View>

            {loadingVoices ? (
              <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
              </View>
            ) : awaazBotVoices.length === 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: spacing[10],
                  gap: spacing[3],
                }}
              >
                <Text style={{ fontSize: 48 }}>🎙️</Text>
                <Text style={{ ...textStyles.labelLarge, color: colors.text, textAlign: 'center' }}>
                  No cloned voices yet
                </Text>
                <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, textAlign: 'center' }}>
                  Clone a voice using AwaazBot first, then come back to assign it to this bot.
                </Text>
              </View>
            ) : (
              awaazBotVoices.map(voice => {
                const isSelected = selectedVoiceId === voice.id;
                return (
                  <TouchableOpacity
                    key={voice.id}
                    onPress={() => setSelectedVoiceId(isSelected ? null : voice.id)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[3],
                      borderWidth: 2,
                      borderColor: isSelected ? colors.primary[400] : colors.border,
                      borderRadius: radius.card,
                      padding: spacing[4],
                      backgroundColor: isSelected ? colors.primary[50] : colors.surface,
                    }}
                  >
                    <View
                      style={{
                        width: spacing[12],
                        height: spacing[12],
                        borderRadius: radius.avatar,
                        backgroundColor: isSelected ? colors.primary[100] : colors.surfaceSecondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name="mic"
                        size={24}
                        color={isSelected ? colors.primary[500] : colors.textMuted}
                      />
                    </View>

                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={{ ...textStyles.labelLarge, color: colors.text }}>
                        {voice.voiceName ?? 'Unnamed Voice'}
                      </Text>
                      {voice.relation && (
                        <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>
                          {voice.relation}
                        </Text>
                      )}
                      <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                        {voice.language.toUpperCase()}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: spacing[6],
                        height: spacing[6],
                        borderRadius: spacing[3],
                        borderWidth: 2,
                        borderColor: isSelected ? colors.primary[500] : colors.border,
                        backgroundColor: isSelected ? colors.primary[500] : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            <TouchableOpacity
              onPress={handleVoiceNext}
              disabled={isCreating}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.primary[500],
                borderRadius: radius.button,
                height: layout.buttonHeight,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: spacing[2],
                marginTop: spacing[2],
                opacity: isCreating ? 0.7 : 1,
              }}
            >
              {isCreating ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <>
                  <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
                    {selectedVoiceId ? 'Create Bot with Voice' : 'Skip & Create Bot'}
                  </Text>
                  <Ionicons name="checkmark-circle" size={20} color={colors.textInverse} />
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ---- STEP: Success ---- */}
        {step === 'success' && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: layout.screenPaddingHorizontal,
              gap: spacing[4],
            }}
          >
            <Text style={{ fontSize: 72 }}>{avatar}</Text>
            <Text style={{ ...textStyles.h3, color: colors.text, textAlign: 'center' }}>
              {name} is ready!
            </Text>
            <Text
              style={{
                ...textStyles.bodyMedium,
                color: colors.textMuted,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              Your {selectedBotTemplate?.name} bot has been created. Start training it to make it smarter.
            </Text>

            <View style={{ width: '100%', gap: spacing[3], marginTop: spacing[4] }}>
              <TouchableOpacity
                onPress={() => createdBotId
                  ? router.replace(`/(routes)/bots/${createdBotId}/train`)
                  : router.replace('/(tabs)/bots')
                }
                style={{
                  backgroundColor: colors.primary[500],
                  borderRadius: radius.button,
                  height: layout.buttonHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.85}
              >
                <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
                  Start Training
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.replace('/(routes)/bots/my-bots')}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.button,
                  height: layout.buttonHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.85}
              >
                <Text style={{ ...textStyles.buttonMedium, color: colors.text }}>
                  Go to My Bots
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SelectedTemplateChip({ bot }: { bot: IAvailableBot }): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const display = getCapabilityDisplay(bot.name);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: display.bg,
        borderRadius: radius.card,
        padding: spacing[3],
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
        }}
      >
        {bot.icon ? (
          <Text style={{ fontSize: 20 }}>{bot.icon}</Text>
        ) : (
          <Ionicons name={display.icon as any} size={20} color={display.color} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...textStyles.labelMedium, color: display.color }}>{bot.name}</Text>
        <Text style={{ ...textStyles.caption, color: display.color, opacity: 0.8 }} numberOfLines={1}>
          {bot.description}
        </Text>
      </View>
      <Ionicons name="checkmark-circle" size={18} color={display.color} />
    </View>
  );
}
