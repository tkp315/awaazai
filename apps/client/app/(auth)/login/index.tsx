import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTheme } from '@/hooks';
import { loginSchema, TLoginForm } from '@/modules/auth/auth.types';
import { googleLogin, login } from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.store';
import { toast } from '@/components/ui/toast';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import useGoogleAuth from '@/hooks/useGoogleAuth';

export default function LoginScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isSilentLogin = params?.isSilentLogin === 'true';
  const { setTokens } = useAuthStore();
  const { getGoogleIdToken } = useGoogleAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isSilentLogin) {
      const payload = {
        email: params?.email as string,
        password: params?.password as string,
      };
      onSubmit(payload);
    }
  }, []);

  const onSubmit = async (data: TLoginForm) => {
    // const deviceId = getDeviceId()||"";
    let payload = {
      ...data,
      // deviceId
    };
    const res = await login(payload);
    if (!res.success) {
      toast.error({ title: 'Login Failed', message: res.message });
      return;
    }
    // console.log("response login",res);
    const { accessToken, refreshToken } = (res.data as any).data;
    await setTokens(accessToken, refreshToken);
    toast.success({ title: 'Welcome back!' });
    router.replace('/(tabs)');
  };
  const handleSigninWithGoogle = async () => {
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
  const handleForgetPassword = () => {
    router.push({
      pathname: '/(auth)/send-otp',
      params: {
        isForgetPassword: 'true',
        email: null,
        password: null,
      },
    });
  };

  const formContent = (
    <View style={{ gap: spacing[4] }}>
      {/* Email */}
      <View style={{ gap: spacing[1] }}>
        <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Email Address</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: errors.email ? colors.error.main : colors.border,
                borderRadius: radius.input,
                paddingHorizontal: spacing[4],
                backgroundColor: colors.surface,
              }}
            >
              <Ionicons
                name="mail-outline"
                size={layout.iconMedium}
                color={errors.email ? colors.error.main : colors.textMuted}
              />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: layout.inputPaddingVertical,
                  paddingHorizontal: spacing[3],
                  ...textStyles.bodyMedium,
                  color: colors.text,
                }}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          )}
        />
        {errors.email && (
          <Text style={{ ...textStyles.bodySmall, color: colors.error.main }}>
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Password */}
      <View style={{ gap: spacing[1] }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...textStyles.labelMedium, color: colors.text }}>Password</Text>
          {!isSilentLogin && (
            <TouchableOpacity onPress={handleForgetPassword}>
              <Text style={{ ...textStyles.labelSmall, color: colors.primary[500] }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: errors.password ? colors.error.main : colors.border,
                borderRadius: radius.input,
                paddingHorizontal: spacing[4],
                backgroundColor: colors.surface,
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={layout.iconMedium}
                color={errors.password ? colors.error.main : colors.textMuted}
              />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: layout.inputPaddingVertical,
                  paddingHorizontal: spacing[3],
                  ...textStyles.bodyMedium,
                  color: colors.text,
                }}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChange}
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
          )}
        />
        {errors.password && (
          <Text style={{ ...textStyles.bodySmall, color: colors.error.main }}>
            {errors.password.message}
          </Text>
        )}
      </View>

      {/* Login Button */}
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
        {isSubmitting ? (
          <ActivityIndicator color={colors.textInverse} />
        ) : (
          <Text style={{ ...textStyles.button, color: colors.textInverse }}>Log In</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // ─── Silent Login Mode ───────────────────────────────────────────────
  if (isSilentLogin) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[4],
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted }}>Logging in...</Text>
      </View>
    );
  }

  // ─── Normal Login Mode ───────────────────────────────────────────────
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
              <Text style={{ ...textStyles.h1, color: colors.text }}>Welcome Back</Text>
              <Text
                style={{
                  ...textStyles.bodyMedium,
                  color: colors.textMuted,
                  marginTop: spacing[2],
                }}
              >
                Sign in to continue to AwaazAI
              </Text>
            </View>

            {formContent}

            {/* Divider - Google login disabled temporarily */}
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
              onPress={handleSigninWithGoogle}
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

            {/* Signup Link */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: spacing[8],
              }}
            >
              <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted }}>
                Don't have an account?{' '}
              </Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text style={{ ...textStyles.button, color: colors.primary[500] }}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
