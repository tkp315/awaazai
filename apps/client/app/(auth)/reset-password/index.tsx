import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';
import { resetPassword } from '@/modules/auth/auth.service';
import { toast } from '@/components/ui/toast';

export default function ResetPasswordScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();

  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const params = useLocalSearchParams();
  // Handlers - logic part tu karega
  const handleResetPassword = async () => {
    const payload = {
      email: params?.email as string,
      newPassword: password,
    };
    const res = await resetPassword(payload);
    console.log('Signup response', res);
    if (!res.success) {
      toast.error({ title: 'Signup Failed', message: res.message });
      return;
    }

    toast.success({ title: 'Account Created!', message: 'Please verify your email' });
    router.push({
      pathname: '/(auth)/login',
      params: { isSilentLogin: 'false' },
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: layout.screenPaddingHorizontal,
              paddingTop: spacing[4],
              paddingBottom: spacing[6],
            }}
          >
            {/* Back Button */}
            <TouchableOpacity
              onPress={handleGoBack}
              style={{
                width: spacing[10],
                height: spacing[10],
                borderRadius: radius.button,
                backgroundColor: colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing[6],
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={layout.iconLarge} color={colors.text} />
            </TouchableOpacity>

            {/* Header */}
            <View style={{ marginBottom: spacing[8] }}>
              {/* Icon */}
              <View
                style={{
                  width: spacing[16],
                  height: spacing[16],
                  backgroundColor: colors.primary[100],
                  borderRadius: radius.card,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing[4],
                }}
              >
                <Ionicons name="key-outline" size={32} color={colors.primary[500]} />
              </View>
              <Text
                style={{
                  ...textStyles.h1,
                  color: colors.text,
                }}
              >
                Reset Password
              </Text>
              <Text
                style={{
                  ...textStyles.bodyMedium,
                  color: colors.textMuted,
                  marginTop: spacing[2],
                }}
              >
                Create a new password for your account. Make sure it's strong and secure.
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: spacing[4] }}>
              {/* New Password Input */}
              <View>
                <Text
                  style={{
                    ...textStyles.labelMedium,
                    color: colors.text,
                    marginBottom: spacing[2],
                  }}
                >
                  New Password
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.input,
                    paddingHorizontal: spacing[4],
                    backgroundColor: colors.surface,
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={layout.iconMedium}
                    color={colors.textMuted}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      paddingVertical: layout.inputPaddingVertical,
                      paddingHorizontal: spacing[3],
                      ...textStyles.bodyMedium,
                      color: colors.text,
                    }}
                    placeholder="Enter new password"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={layout.iconMedium}
                      color={colors.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text
                  style={{
                    ...textStyles.labelMedium,
                    color: colors.text,
                    marginBottom: spacing[2],
                  }}
                >
                  Confirm Password
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.input,
                    paddingHorizontal: spacing[4],
                    backgroundColor: colors.surface,
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={layout.iconMedium}
                    color={colors.textMuted}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      paddingVertical: layout.inputPaddingVertical,
                      paddingHorizontal: spacing[3],
                      ...textStyles.bodyMedium,
                      color: colors.text,
                    }}
                    placeholder="Confirm new password"
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={layout.iconMedium}
                      color={colors.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Password Requirements */}
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radius.card,
                  padding: spacing[4],
                  gap: spacing[2],
                }}
              >
                <Text
                  style={{
                    ...textStyles.labelSmall,
                    color: colors.textMuted,
                    marginBottom: spacing[1],
                  }}
                >
                  Password must contain:
                </Text>
                {[
                  'At least 8 characters',
                  'One uppercase letter',
                  'One lowercase letter',
                  'One number',
                ].map((requirement, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[2],
                    }}
                  >
                    <Ionicons name="ellipse" size={6} color={colors.textMuted} />
                    <Text
                      style={{
                        ...textStyles.bodySmall,
                        color: colors.textMuted,
                      }}
                    >
                      {requirement}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary[500],
                  paddingVertical: layout.buttonPaddingVertical,
                  borderRadius: radius.button,
                  alignItems: 'center',
                  marginTop: spacing[2],
                }}
                onPress={handleResetPassword}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    ...textStyles.button,
                    color: colors.textInverse,
                  }}
                >
                  Reset Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
