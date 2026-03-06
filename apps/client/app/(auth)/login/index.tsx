import { useState } from "react";
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
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTheme } from "@/hooks";
import { loginSchema, TLoginForm } from "@/modules/auth/auth.types";
import { login } from "@/modules/auth/auth.service";
import { useAuthStore } from "@/modules/auth/auth.store";
import { toast } from "@/components/ui/toast";

export default function LoginScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isSilentLogin = params?.isSilentLogin === "true";
  const { setTokens } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: TLoginForm) => {
    const res = await login(data);
    if (!res.success) {
      toast.error({ title: "Login Failed", message: res.message });
      return;
    }
    const { accessToken, refreshToken } = (res.data as any).result ?? res.data;
    await setTokens(accessToken, refreshToken);
    toast.success({ title: "Welcome back!" });
    router.replace("/(tabs)/home" as any);
  };

  const formContent = (
    <View style={{ gap: spacing[4] }}>
      {/* Email */}
      <View style={{ gap: spacing[1] }}>
        <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
          Email Address
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
            Password
          </Text>
          {!isSilentLogin && (
            <Link href="/(auth)/send-otp" asChild>
              <TouchableOpacity>
                <Text
                  style={{ ...textStyles.labelSmall, color: colors.primary[500] }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
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
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
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
          alignItems: "center",
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
          <Text style={{ ...textStyles.button, color: colors.textInverse }}>
            Log In
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // ─── Silent Login Mode ───────────────────────────────────────────────
  if (isSilentLogin) {
    return (
      <Modal transparent animationType="fade" visible>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: spacing[6],
                paddingBottom: spacing[10],
                gap: spacing[6],
              }}
            >
              {/* Handle bar */}
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: colors.border,
                  borderRadius: 2,
                  alignSelf: "center",
                }}
              />

              <View style={{ gap: spacing[1] }}>
                <Text style={{ ...textStyles.h2, color: colors.text }}>
                  Session Expired
                </Text>
                <Text
                  style={{ ...textStyles.bodyMedium, color: colors.textMuted }}
                >
                  Please log in again to continue
                </Text>
              </View>

              {formContent}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }

  // ─── Normal Login Mode ───────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <View style={{ alignItems: "center", marginBottom: spacing[10] }}>
              <View
                style={{
                  width: spacing[16],
                  height: spacing[16],
                  backgroundColor: colors.primary[500],
                  borderRadius: radius.card,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing[4],
                }}
              >
                <Ionicons name="mic" size={32} color={colors.textInverse} />
              </View>
              <Text style={{ ...textStyles.h1, color: colors.text }}>
                Welcome Back
              </Text>
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

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
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

            {/* Google Button */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
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
            </TouchableOpacity>

            {/* Signup Link */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: spacing[8],
              }}
            >
              <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted }}>
                Don't have an account?{" "}
              </Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text style={{ ...textStyles.button, color: colors.primary[500] }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
