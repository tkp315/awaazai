import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks';
import { useProfileStore, upsertPreferences } from '@/modules/profile';
import { toast } from '@/components/ui/toast';

const SUGGESTED_INTERESTS = [
  'Motivation', 'Stories', 'Jokes', 'Music', 'Travel',
  'Health', 'Tech', 'Food', 'Books', 'Sports',
];

const SUGGESTED_AVOID = [
  'Politics', 'Religion', 'Violence', 'News', 'Gossip',
];

function TagInput({
  label,
  tags,
  suggestions,
  onAdd,
  onRemove,
  addBg,
  addColor,
}: {
  label: string;
  tags: string[];
  suggestions: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  addBg: string;
  addColor: string;
}) {
  const { colors, spacing, radius, textStyles, layout } = useTheme();
  const [input, setInput] = useState('');

  const handleAdd = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onAdd(trimmed);
    setInput('');
  };

  return (
    <View style={{ gap: spacing[3] }}>
      <Text style={{ ...textStyles.labelMedium, color: colors.text }}>{label}</Text>

      {/* Text input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.input,
          paddingHorizontal: spacing[3],
          backgroundColor: colors.surface,
          height: layout.inputHeight,
          gap: spacing[2],
        }}
      >
        <TextInput
          style={{ flex: 1, ...textStyles.bodyMedium, color: colors.text }}
          placeholder="Type and press +"
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleAdd(input)}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={() => handleAdd(input)}
          activeOpacity={0.7}
          style={{
            width: spacing[8],
            height: spacing[8],
            borderRadius: radius.avatar,
            backgroundColor: addBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={layout.iconMedium} color={addColor} />
        </TouchableOpacity>
      </View>

      {/* Suggestions */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
        {suggestions
          .filter(s => !tags.includes(s))
          .map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => onAdd(s)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1],
                borderRadius: radius.chip,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[1],
              }}
            >
              <Ionicons name="add" size={12} color={colors.textMuted} />
              <Text style={{ ...textStyles.caption, color: colors.textMuted }}>{s}</Text>
            </TouchableOpacity>
          ))}
      </View>

      {/* Selected tags */}
      {tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          {tags.map(tag => (
            <TouchableOpacity
              key={tag}
              onPress={() => onRemove(tag)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1],
                borderRadius: radius.chip,
                backgroundColor: addBg,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[1],
              }}
            >
              <Text style={{ ...textStyles.labelSmall, color: addColor }}>{tag}</Text>
              <Ionicons name="close" size={12} color={addColor} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {tags.length === 0 && (
        <Text style={{ ...textStyles.caption, color: colors.border }}>No topics added yet</Text>
      )}
    </View>
  );
}

export default function TopicsScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { preferences, fetchPreferences } = useProfileStore();

  const [interests, setInterests] = useState<string[]>(preferences?.topicsOfInterest ?? []);
  const [avoid, setAvoid] = useState<string[]>(preferences?.avoidTopics ?? []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await upsertPreferences({
      topicsOfInterest: interests,
      avoidTopics: avoid,
    });
    setIsSaving(false);

    if (result.success) {
      await fetchPreferences();
      toast.success('Topics saved');
      router.back();
    } else {
      toast.error(result.message || 'Failed to save topics');
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
          Topics
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingTop: spacing[6],
          paddingBottom: spacing[10],
          gap: spacing[7],
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TagInput
          label="Topics of Interest"
          tags={interests}
          suggestions={SUGGESTED_INTERESTS}
          onAdd={tag => setInterests(prev => [...prev, tag])}
          onRemove={tag => setInterests(prev => prev.filter(t => t !== tag))}
          addBg={colors.primary[50]}
          addColor={colors.primary[600]}
        />

        <View style={{ height: 1, backgroundColor: colors.border }} />

        <TagInput
          label="Avoid Topics"
          tags={avoid}
          suggestions={SUGGESTED_AVOID}
          onAdd={tag => setAvoid(prev => [...prev, tag])}
          onRemove={tag => setAvoid(prev => prev.filter(t => t !== tag))}
          addBg={colors.error.light}
          addColor={colors.error.main}
        />

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
              Save Topics
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
