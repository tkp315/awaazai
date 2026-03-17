import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';
import { KNOWLEDGE_TYPE_DISPLAY, TRAINING_STATUS_DISPLAY, useBotsStore } from '@/modules/bots';
import type { KnowledgeType } from '@/modules/bots';

export default function TrainBotScreen(): React.JSX.Element {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { botId } = useLocalSearchParams<{ botId: string }>();

  const {
    knowledge,
    trainings,
    loadingKnowledge,
    loadingTrainings,
    isAdding,
    isTraining,
    fetchKnowledge,
    fetchTrainings,
    addKnowledge,
    deleteKnowledge,
    triggerTraining,
  } = useBotsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<KnowledgeType | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    if (botId) {
      fetchKnowledge(botId);
      fetchTrainings(botId);
    }
  }, [botId]);

  const resetModal = (): void => {
    setShowAddModal(false);
    setSelectedType(null);
    setNoteTitle('');
    setNoteContent('');
    setUrlTitle('');
    setUrlInput('');
  };

  const handleAddNote = async (): Promise<void> => {
    if (!noteTitle || !noteContent) return;
    const result = await addKnowledge(botId, {
      type: 'NOTE',
      title: noteTitle.trim(),
      content: noteContent.trim(),
    });
    if (result) resetModal();
  };

  const handleAddUrl = async (): Promise<void> => {
    if (!urlInput) return;
    const result = await addKnowledge(botId, {
      type: 'URL',
      title: urlTitle.trim() || urlInput,
      sourceUrl: urlInput.trim(),
    });
    if (result) resetModal();
  };

  const handleDeleteKnowledge = (knowledgeId: string, title: string): void => {
    Alert.alert('Delete', `Remove "${title}" from knowledge base?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteKnowledge(botId, knowledgeId),
      },
    ]);
  };

  const handleStartTraining = async (): Promise<void> => {
    const result = await triggerTraining(botId);
    if (result) {
      Alert.alert('Training Started', 'Your bot is now being trained in the background.');
    }
  };

  const knowledgeTypeKeys = Object.keys(KNOWLEDGE_TYPE_DISPLAY) as KnowledgeType[];
  const pendingCount = knowledge.filter(k => k.status === 'PENDING').length;

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

        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text style={{ ...textStyles.h4, color: colors.text }}>Train Bot</Text>
          <Text style={{ ...textStyles.caption, color: colors.textMuted, marginTop: 2 }}>
            {knowledge.length} knowledge items
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[1.5],
            backgroundColor: colors.primary[500],
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            borderRadius: radius.button,
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color={colors.textInverse} />
          <Text style={{ ...textStyles.buttonSmall, color: colors.textInverse }}>Add Data</Text>
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
        {/* Start Training Banner */}
        {pendingCount > 0 && (
          <TouchableOpacity
            onPress={handleStartTraining}
            disabled={isTraining}
            activeOpacity={0.85}
            style={{
              backgroundColor: colors.primary[500],
              borderRadius: radius.card,
              padding: spacing[4],
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[3],
              marginBottom: spacing[5],
            }}
          >
            {isTraining ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <View
                style={{
                  width: spacing[12],
                  height: spacing[12],
                  borderRadius: radius.button,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="rocket-outline" size={24} color={colors.textInverse} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ ...textStyles.labelLarge, color: colors.textInverse }}>
                {isTraining ? 'Starting Training...' : 'Start Training Session'}
              </Text>
              <Text
                style={{ ...textStyles.bodySmall, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}
              >
                {pendingCount} item{pendingCount !== 1 ? 's' : ''} pending
              </Text>
            </View>
            {!isTraining && (
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
            )}
          </TouchableOpacity>
        )}

        {/* Knowledge Base */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing[3],
          }}
        >
          <Text style={{ ...textStyles.labelLarge, color: colors.text }}>Knowledge Base</Text>
          <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
            {knowledge.length} items
          </Text>
        </View>

        {loadingKnowledge ? (
          <ActivityIndicator color={colors.primary[500]} style={{ marginBottom: spacing[5] }} />
        ) : knowledge.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[8],
              alignItems: 'center',
              marginBottom: spacing[5],
            }}
          >
            <Ionicons name="library-outline" size={40} color={colors.border} />
            <Text style={{ ...textStyles.labelLarge, color: colors.text, marginTop: spacing[3] }}>
              No training data yet
            </Text>
            <Text
              style={{
                ...textStyles.bodySmall,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: spacing[1],
              }}
            >
              Add documents, notes, URLs, or FAQs to train your bot
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              style={{
                backgroundColor: colors.primary[500],
                borderRadius: radius.button,
                paddingHorizontal: spacing[5],
                paddingVertical: spacing[2.5],
                marginTop: spacing[4],
              }}
              activeOpacity={0.85}
            >
              <Text style={{ ...textStyles.buttonSmall, color: colors.textInverse }}>
                Add First Item
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
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
            {knowledge.map((item, i) => {
              const typeDisplay = KNOWLEDGE_TYPE_DISPLAY[item.type] ?? {
                icon: 'attach',
                label: item.type,
                color: '#64748b',
              };
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing[4],
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
                      backgroundColor: typeDisplay.color + '18',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={typeDisplay.icon as any} size={20} color={typeDisplay.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ ...textStyles.labelMedium, color: colors.text }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing[2],
                        marginTop: 2,
                      }}
                    >
                      <Text
                        style={{
                          ...textStyles.caption,
                          color: typeDisplay.color,
                          fontWeight: '600',
                        }}
                      >
                        {typeDisplay.label}
                      </Text>
                      <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <View
                      style={{
                        paddingHorizontal: spacing[2],
                        paddingVertical: 2,
                        borderRadius: radius.badge,
                        backgroundColor:
                          item.status === 'PROCESSED'
                            ? '#ecfdf5'
                            : item.status === 'FAILED'
                              ? '#fee2e2'
                              : '#fef3c7',
                      }}
                    >
                      <Text
                        style={{
                          ...textStyles.caption,
                          color:
                            item.status === 'PROCESSED'
                              ? '#059669'
                              : item.status === 'FAILED'
                                ? '#ef4444'
                                : '#d97706',
                          fontWeight: '600',
                        }}
                      >
                        {item.status}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteKnowledge(item.id, item.title)}>
                      <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Training History */}
        <Text style={{ ...textStyles.labelLarge, color: colors.text, marginBottom: spacing[3] }}>
          Training History
        </Text>

        {loadingTrainings ? (
          <ActivityIndicator color={colors.primary[500]} />
        ) : trainings.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[5],
              alignItems: 'center',
            }}
          >
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>
              No training sessions yet
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
            }}
          >
            {trainings.map((training, i) => {
              const tDisplay = TRAINING_STATUS_DISPLAY[training.status];
              return (
                <View
                  key={training.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing[4],
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.border,
                    gap: spacing[3],
                  }}
                >
                  <View
                    style={{
                      width: spacing[10],
                      height: spacing[10],
                      borderRadius: radius.avatar,
                      backgroundColor: tDisplay.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={tDisplay.icon as any} size={20} color={tDisplay.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                      <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
                        Training #{i + 1}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: spacing[2],
                          paddingVertical: 1,
                          borderRadius: radius.badge,
                          backgroundColor: tDisplay.bg,
                        }}
                      >
                        <Text
                          style={{
                            ...textStyles.caption,
                            color: tDisplay.color,
                            fontWeight: '600',
                          }}
                        >
                          {tDisplay.label}
                        </Text>
                      </View>
                    </View>
                    {training.startedAt && (
                      <Text
                        style={{ ...textStyles.caption, color: colors.textMuted, marginTop: 2 }}
                      >
                        {new Date(training.startedAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={{ ...textStyles.labelLarge, color: tDisplay.color, fontWeight: '700' }}
                  >
                    {training.progress}%
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Knowledge Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={resetModal}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: colors.overlay }}
            activeOpacity={1}
            onPress={() => !isAdding && resetModal()}
          />
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.modal,
              borderTopRightRadius: radius.modal,
              paddingTop: spacing[2],
              paddingBottom: spacing[8],
              maxHeight: '85%',
            }}
          >
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

            <View style={{ paddingHorizontal: layout.screenPaddingHorizontal, gap: spacing[4] }}>
              <Text style={{ ...textStyles.h4, color: colors.text }}>Add Training Data</Text>

              {/* Type Selection */}
              {!selectedType && (
                <View style={{ gap: spacing[2] }}>
                  <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>
                    What type of data do you want to add?
                  </Text>
                  {knowledgeTypeKeys.map(type => {
                    const d = KNOWLEDGE_TYPE_DISPLAY[type];
                    return (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setSelectedType(type)}
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
                        }}
                      >
                        <View
                          style={{
                            width: spacing[11],
                            height: spacing[11],
                            borderRadius: radius.button,
                            backgroundColor: d.color + '18',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name={d.icon as any} size={22} color={d.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
                            {d.label}
                          </Text>
                          <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
                            {d.description}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* NOTE Form */}
              {selectedType === 'NOTE' && (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={{ gap: spacing[3] }}>
                    <TouchableOpacity
                      onPress={() => setSelectedType(null)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}
                    >
                      <Ionicons name="arrow-back" size={16} color={colors.primary[500]} />
                      <Text style={{ ...textStyles.bodySmall, color: colors.primary[500] }}>
                        Change type
                      </Text>
                    </TouchableOpacity>

                    <TextInput
                      style={{
                        ...textStyles.bodyMedium,
                        color: colors.text,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: radius.input,
                        paddingHorizontal: spacing[4],
                        backgroundColor: colors.surface,
                        height: layout.inputHeight,
                      }}
                      placeholder="Title"
                      placeholderTextColor={colors.textMuted}
                      value={noteTitle}
                      onChangeText={setNoteTitle}
                    />
                    <TextInput
                      style={{
                        ...textStyles.bodyMedium,
                        color: colors.text,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: radius.input,
                        paddingHorizontal: spacing[4],
                        paddingTop: spacing[3],
                        backgroundColor: colors.surface,
                        minHeight: spacing[32],
                        textAlignVertical: 'top',
                      }}
                      placeholder="Paste or type your content here..."
                      placeholderTextColor={colors.textMuted}
                      value={noteContent}
                      onChangeText={setNoteContent}
                      multiline
                    />

                    <TouchableOpacity
                      onPress={handleAddNote}
                      disabled={!noteTitle || !noteContent || isAdding}
                      activeOpacity={0.85}
                      style={{
                        backgroundColor:
                          noteTitle && noteContent ? colors.primary[500] : colors.primary[200],
                        borderRadius: radius.button,
                        height: layout.buttonHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isAdding ? (
                        <ActivityIndicator color={colors.textInverse} />
                      ) : (
                        <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
                          Add Note
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}

              {/* URL Form */}
              {selectedType === 'URL' && (
                <View style={{ gap: spacing[3] }}>
                  <TouchableOpacity
                    onPress={() => setSelectedType(null)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}
                  >
                    <Ionicons name="arrow-back" size={16} color={colors.primary[500]} />
                    <Text style={{ ...textStyles.bodySmall, color: colors.primary[500] }}>
                      Change type
                    </Text>
                  </TouchableOpacity>

                  <TextInput
                    style={{
                      ...textStyles.bodyMedium,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: radius.input,
                      paddingHorizontal: spacing[4],
                      backgroundColor: colors.surface,
                      height: layout.inputHeight,
                    }}
                    placeholder="Title (optional)"
                    placeholderTextColor={colors.textMuted}
                    value={urlTitle}
                    onChangeText={setUrlTitle}
                  />
                  <TextInput
                    style={{
                      ...textStyles.bodyMedium,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: radius.input,
                      paddingHorizontal: spacing[4],
                      backgroundColor: colors.surface,
                      height: layout.inputHeight,
                    }}
                    placeholder="https://..."
                    placeholderTextColor={colors.textMuted}
                    value={urlInput}
                    onChangeText={setUrlInput}
                    keyboardType="url"
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    onPress={handleAddUrl}
                    disabled={!urlInput || isAdding}
                    activeOpacity={0.85}
                    style={{
                      backgroundColor: urlInput ? colors.primary[500] : colors.primary[200],
                      borderRadius: radius.button,
                      height: layout.buttonHeight,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isAdding ? (
                      <ActivityIndicator color={colors.textInverse} />
                    ) : (
                      <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
                        Import URL
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* DOCUMENT / FAQ / AUDIO / IMAGE - Coming Soon */}
              {(selectedType === 'DOCUMENT' ||
                selectedType === 'FAQ' ||
                selectedType === 'AUDIO' ||
                selectedType === 'IMAGE') && (
                <View style={{ gap: spacing[3] }}>
                  <TouchableOpacity
                    onPress={() => setSelectedType(null)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}
                  >
                    <Ionicons name="arrow-back" size={16} color={colors.primary[500]} />
                    <Text style={{ ...textStyles.bodySmall, color: colors.primary[500] }}>
                      Change type
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: radius.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: spacing[6],
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="construct-outline" size={36} color={colors.textMuted} />
                    <Text
                      style={{
                        ...textStyles.labelLarge,
                        color: colors.text,
                        marginTop: spacing[3],
                      }}
                    >
                      Coming Soon
                    </Text>
                    <Text
                      style={{
                        ...textStyles.bodySmall,
                        color: colors.textMuted,
                        textAlign: 'center',
                        marginTop: spacing[1],
                      }}
                    >
                      {selectedType === 'DOCUMENT'
                        ? 'File upload will be available soon'
                        : selectedType === 'FAQ'
                          ? 'FAQ builder coming soon'
                          : selectedType === 'AUDIO'
                            ? 'Audio upload coming soon'
                            : 'Image upload coming soon'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
