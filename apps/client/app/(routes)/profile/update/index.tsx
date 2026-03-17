import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/hooks';
import { useProfileStore } from '@/modules/profile';
import { updateProfile, updateAvatar } from '@/modules/profile/profile.service';
import { toast } from '@/components/ui/toast';
import type { Gender } from '@/modules/profile/profile.types';

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
];

export default function UpdateProfileScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const { user, fetchMe } = useProfileStore();

  const [age, setAge] = useState(user?.profile?.age ? String(user.profile.age) : '');
  const [gender, setGender] = useState<Gender>(user?.profile?.gender ?? 'OTHER');
  const [isSaving, setIsSaving] = useState(false);

  // Avatar states
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const displayAvatar = user?.profile?.avatar ?? localAvatarUri ?? null;
  const avatarLetter = (user?.fullName || 'U').charAt(0).toUpperCase();

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.error('Gallery permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setLocalAvatarUri(uri);

    setIsUploadingAvatar(true);
    const uploadResult = await updateAvatar(uri);
    setIsUploadingAvatar(false);

    if (uploadResult.success) {
      await fetchMe();
      toast.success('Avatar updated');
    } else {
      setLocalAvatarUri(null);
      toast.error(uploadResult.message || 'Avatar upload failed');
    }
  };

  const handleSave = async () => {
    const ageNum = age ? parseInt(age, 10) : undefined;
    if (age && (isNaN(ageNum!) || ageNum! < 1 || ageNum! > 120)) {
      toast.error('Enter a valid age (1–120)');
      return;
    }

    setIsSaving(true);
    const result = await updateProfile({ gender, age: ageNum });
    setIsSaving(false);

    if (result.success) {
      await fetchMe();
      toast.success('Profile updated');
      router.back();
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
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
          <Text style={{ ...textStyles.h4, color: colors.text, marginLeft: spacing[3] }}>
            Edit Profile
          </Text>
        </View>

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
          {/* Avatar */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={handlePickAvatar}
              disabled={isUploadingAvatar}
              activeOpacity={0.8}
              style={{ position: 'relative' }}
            >
              {/* Avatar circle */}
              <View
                style={{
                  width: spacing[24],
                  height: spacing[24],
                  borderRadius: radius.avatar,
                  backgroundColor: colors.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.primary[200],
                  overflow: 'hidden',
                }}
              >
                {displayAvatar ? (
                  <Image
                    source={{ uri: displayAvatar }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ ...textStyles.h1, color: colors.primary[500] }}>
                    {avatarLetter}
                  </Text>
                )}

                {/* Upload loading overlay */}
                {isUploadingAvatar && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: colors.overlay,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ActivityIndicator color={colors.textInverse} />
                  </View>
                )}
              </View>

              {/* Camera badge */}
              {!isUploadingAvatar && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: spacing[8],
                    height: spacing[8],
                    borderRadius: radius.avatar,
                    backgroundColor: colors.primary[500],
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: colors.background,
                  }}
                >
                  <Ionicons name="camera" size={layout.iconSmall} color={colors.textInverse} />
                </View>
              )}
            </TouchableOpacity>

            <Text style={{ ...textStyles.caption, color: colors.textMuted, marginTop: spacing[2] }}>
              Tap to change photo
            </Text>
          </View>

          {/* Full Name (read-only) */}
          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Full Name</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.input,
                paddingHorizontal: spacing[4],
                backgroundColor: colors.surfaceHover,
                height: layout.inputHeight,
                gap: spacing[3],
              }}
            >
              <Ionicons name="person-outline" size={layout.iconMedium} color={colors.textMuted} />
              <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted, flex: 1 }}>
                {user?.fullName || '—'}
              </Text>
            </View>
            <Text style={{ ...textStyles.caption, color: colors.textMuted }}>
              Name cannot be changed
            </Text>
          </View>

          {/* Age */}
          <View style={{ gap: spacing[1] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Age</Text>
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
              <Ionicons name="calendar-outline" size={layout.iconMedium} color={colors.textMuted} />
              <TextInput
                style={{ flex: 1, ...textStyles.bodyMedium, color: colors.text }}
                placeholder="Enter your age"
                placeholderTextColor={colors.textMuted}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>

          {/* Gender */}
          <View style={{ gap: spacing[2] }}>
            <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Gender</Text>
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              {GENDER_OPTIONS.map(option => {
                const isSelected = gender === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setGender(option.value)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      paddingVertical: spacing[3],
                      borderRadius: radius.button,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary[500] : colors.border,
                      backgroundColor: isSelected ? colors.primary[50] : colors.surface,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        ...textStyles.labelMedium,
                        color: isSelected ? colors.primary[600] : colors.textMuted,
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || isUploadingAvatar}
            activeOpacity={0.85}
            style={{
              backgroundColor:
                isSaving || isUploadingAvatar ? colors.primary[300] : colors.primary[500],
              borderRadius: radius.button,
              height: layout.buttonHeight,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: spacing[2],
            }}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
