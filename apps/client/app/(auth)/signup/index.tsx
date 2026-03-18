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
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller, Control, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTheme } from '@/hooks';
import { signupSchema, TSignupForm } from '@/modules/auth/auth.types';
import { signupFormFields } from '@/modules/auth/auth.constants';
import { googleLogin, signup } from '@/modules/auth/auth.service';
import { toast } from '@/components/ui/toast';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import { useAuthStore } from '@/modules/auth/auth.store';

const FIELD_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  fullName: 'person-outline',
  email: 'mail-outline',
  password: 'lock-closed-outline',
  confirmPassword: 'lock-closed-outline',
};

interface FormFieldProps {
  name: keyof TSignupForm;
  label: string;
  type: string;
  control: Control<TSignupForm>;
  errors: FieldErrors<TSignupForm>;
}

function FormField({ name, label, type, control, errors }: FormFieldProps) {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const hasError = !!errors[name];

  return (
    <View style={{ gap: spacing[1] }}>
      <Text style={{ ...textStyles.labelMedium, color: colors.text }}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: hasError ? colors.error.main : colors.border,
              borderRadius: radius.input,
              paddingHorizontal: spacing[4],
              backgroundColor: colors.surface,
            }}
          >
            <Ionicons
              name={FIELD_ICONS[name]}
              size={layout.iconMedium}
              color={hasError ? colors.error.main : colors.textMuted}
            />
            <TextInput
              style={{
                flex: 1,
                paddingVertical: layout.inputPaddingVertical,
                paddingHorizontal: spacing[3],
                ...textStyles.bodyMedium,
                color: colors.text,
              }}
              placeholder={`Enter your ${label.toLowerCase()}`}
              placeholderTextColor={colors.textMuted}
              value={value}
              onChangeText={onChange}
              keyboardType={type === 'email' ? 'email-address' : 'default'}
              autoCapitalize={name === 'fullName' ? 'words' : 'none'}
              secureTextEntry={isPassword && !showPassword}
              autoComplete={type === 'email' ? 'email' : 'off'}
            />
            {isPassword && (
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={layout.iconMedium}
                  color={colors.textMuted}
                />
              </Pressable>
            )}
          </View>
        )}
      />

      {hasError && (
        <Text style={{ ...textStyles.bodySmall, color: colors.error.main }}>
          {errors[name]?.message}
        </Text>
      )}
    </View>
  );
}

export default function SignupScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const { getGoogleIdToken } = useGoogleAuth();
  const { setTokens } = useAuthStore();

  const {
    control,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<TSignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const router = useRouter();

  const onSubmit = async (data: TSignupForm) => {
    const { confirmPassword, ...payload } = data;
    const res = await signup(payload);
    console.log('Signup response', res);
    if (!res.success) {
      toast.error({ title: 'Signup Failed', message: res.message });
      return;
    }

    toast.success({ title: 'Account Created!', message: 'Please verify your email' });
    router.push({
      pathname: '/(auth)/send-otp',
      params: { email: payload.email, password: payload.password, isForgetPassword: 'false' },
    });
  };

  const handleGoogleSignup = async () => {
    const idToken = await getGoogleIdToken();
    console.log(`Google id token`, idToken);
    const payload = {
      idToken: idToken || '',
    };
    const res = await googleLogin(payload);
    if (!res.success) {
      toast.error({ title: 'Login Failed', message: res.message });
      return;
    }
    const { accessToken, refreshToken } = (res.data as any).data;
    await setTokens(accessToken, refreshToken);
    toast.success({ title: 'Welcome back!' });
    router.replace('/(tabs)');
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
              paddingTop: spacing[8],
              paddingBottom: spacing[6],
            }}
          >
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: spacing[10] }}>
              <View
                style={{
                  width: spacing[16],
                  height: spacing[16],
                  backgroundColor: colors.primary[500],
                  borderRadius: radius.card,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing[4],
                }}
              >
                <Ionicons name="mic" size={32} color={colors.textInverse} />
              </View>
              <Text style={{ ...textStyles.h1, color: colors.text }}>Create Account</Text>
              <Text
                style={{
                  ...textStyles.bodyMedium,
                  color: colors.textMuted,
                  marginTop: spacing[2],
                }}
              >
                Sign up to get started with AwaazAI
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: spacing[4] }}>
              {signupFormFields.map(field => (
                <FormField
                  key={field.name}
                  name={field.name as keyof TSignupForm}
                  label={field.label}
                  type={field.type}
                  control={control}
                  errors={errors}
                />
              ))}

              {/* Signup Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary[500],
                  paddingVertical: layout.buttonPaddingVertical,
                  borderRadius: radius.button,
                  alignItems: 'center',
                  marginTop: spacing[2],
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.8}
                disabled={isSubmitting}
              >
                <Text style={{ ...textStyles.button, color: colors.textInverse }}>
                  {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider - Google signup disabled temporarily */}
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: spacing[6],
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text
                style={{
                  marginHorizontal: spacing[4],
                  ...textStyles.bodySmall,
                  color: colors.textMuted,
                }}
              >
                or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                paddingVertical: layout.buttonPaddingVertical,
                borderRadius: radius.button,
                backgroundColor: colors.background,
              }}
              onPress={handleGoogleSignup}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={layout.iconMedium} color="#4285F4" />
              <Text
                style={{
                  ...textStyles.button,
                  color: colors.text,
                  marginLeft: spacing[3],
                }}
              >
                Continue with Google
              </Text>
            </TouchableOpacity> */}

            {/* Login Link */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: spacing[8],
              }}
            >
              <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted }}>
                Already have an account?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={{ ...textStyles.button, color: colors.primary[500] }}>Log In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
