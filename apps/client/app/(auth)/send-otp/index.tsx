import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { sendOtp } from "@/modules/auth/auth.service";

export default function SendOTPScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log("Params,",params);
  // Form state
  const [email, setEmail] = useState("");

  // Handlers - logic part tu karega
  const handleSendOTP = async() => {
     const res = await sendOtp({email:params?.email as string});
       if (!res.success) {
         toast.error({ title: 'Failed to send otp', message: res.message });
         return;
       }
       toast.success({ title: 'OTP sent !', message: 'Please check your email' });
       router.push({
        pathname:'/(auth)/verify-otp',
        params:{
          email:params.email,
          password: params?.password 
        }
       })
  };

  const handleGoBack = () => {
    router.back();
  };

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
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing[6],
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={layout.iconLarge}
                color={colors.text}
              />
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
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing[4],
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={32}
                  color={colors.primary[500]}
                />
              </View>
              <Text
                style={{
                  ...textStyles.h1,
                  color: colors.text,
                }}
              >
                Veriy Email?
              </Text>
              <Text
                style={{
                  ...textStyles.bodyMedium,
                  color: colors.textMuted,
                  marginTop: spacing[2],
                }}
              >
                Enter your email address and we'll send you a verification code
                to reset your password.
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: spacing[4] }}>
              {/* Email Input */}
              <View>
                <Text
                  style={{
                    ...textStyles.labelMedium,
                    color: colors.text,
                    marginBottom: spacing[2],
                  }}
                >
                  Email Address
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.input,
                    paddingHorizontal: spacing[4],
                    backgroundColor: colors.surface,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
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
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textMuted}
                    value={params?.email as string ||""}

                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Send OTP Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary[500],
                  paddingVertical: layout.buttonPaddingVertical,
                  borderRadius: radius.button,
                  alignItems: "center",
                  marginTop: spacing[2],
                }}
                onPress={handleSendOTP}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    ...textStyles.button,
                    color: colors.textInverse,
                  }}
                >
                  Send Verification Code
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: spacing[6],
                paddingHorizontal: spacing[4],
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={layout.iconSmall}
                color={colors.textMuted}
              />
              <Text
                style={{
                  ...textStyles.bodySmall,
                  color: colors.textMuted,
                  marginLeft: spacing[2],
                }}
              >
                Check your spam folder if you don't see the email
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
