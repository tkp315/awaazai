import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks';
import { login, sendOtp, verifyOtp } from '@/modules/auth/auth.service';
import { toast } from '@/components/ui/toast';
import { email, string } from 'zod';

const OTP_LENGTH = 6;

export default function VerifyOTPScreen() {
  const { colors, spacing, layout, radius, textStyles } = useTheme();
  const router = useRouter();

  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const params = useLocalSearchParams();
  console.log('Params', params);
  const [resendOtp, setResendOtp] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handlers - logic part tu karega
  const handleVerifyOTP = async () => {
    // TODO: Implement verify OTP logic
    const otpCode = otp.join('');
    console.log('OTP:', otpCode);
    const res = await verifyOtp({
      code: otpCode,
      email: params?.email as string,
    });

    if (!res.success) {
      toast.error({ title: 'Verification Failed', message: res.message });
      return;
    }
    toast.success({ title: 'Account Verified!', message: '' });
    // silent login
    const payload = { email: params.email as string, password: params?.password as string };
    const loginResponse = await login(payload);
    if (!loginResponse.success) {
    }
    const isResetPassword = params?.isForgetPassword === 'true';
    if (isResetPassword) {
      router.push({
        pathname: '/(auth)/reset-password',
        params: {
          email: params?.email,
        },
      });
    } else {
      router.push({
        pathname: '/(auth)/login',
        params: {
          email: params?.email,
          password: params?.password,
          isSilentLogin: 'true',
        },
      });
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    const res = await sendOtp({ email: params?.email as string });
    if (!res.success) {
      toast.error({ title: 'Failed to resend otp', message: res.message });
      return;
    }
    toast.success({ title: 'OTP sent !', message: 'Please check your email' });
    setTimer(30);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
                <Ionicons name="shield-checkmark-outline" size={32} color={colors.primary[500]} />
              </View>
              <Text
                style={{
                  ...textStyles.h1,
                  color: colors.text,
                }}
              >
                Verify Code
              </Text>
              <Text
                style={{
                  ...textStyles.bodyMedium,
                  color: colors.textMuted,
                  marginTop: spacing[2],
                }}
              >
                Enter the 6-digit code we sent to your email address
              </Text>
            </View>

            {/* OTP Input */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing[6],
              }}
            >
              {Array(OTP_LENGTH)
                .fill(0)
                .map((_, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputRefs.current[index] = ref)}
                    style={{
                      width: spacing[12],
                      height: spacing[14],
                      borderWidth: 1,
                      borderColor: otp[index] ? colors.primary[500] : colors.border,
                      borderRadius: radius.input,
                      backgroundColor: otp[index] ? colors.primary[400] : colors.surface,
                      textAlign: 'center',
                      ...textStyles.h2,
                      color: colors.text,
                    }}
                    value={otp[index]}
                    onChangeText={value => handleOTPChange(value, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary[500],
                paddingVertical: layout.buttonPaddingVertical,
                borderRadius: radius.button,
                alignItems: 'center',
              }}
              onPress={handleVerifyOTP}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  ...textStyles.button,
                  color: colors.textInverse,
                }}
              >
                Verify Code
              </Text>
            </TouchableOpacity>

            {/* Resend */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: spacing[6],
              }}
            >
              <Text
                style={{
                  ...textStyles.bodyMedium,
                  color: colors.textMuted,
                }}
              >
                Didn't receive the code?{' '}
              </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={timer > 0}>
                <Text
                  style={{
                    ...textStyles.button,
                    color: timer > 0 ? colors.textMuted : colors.primary[500],
                  }}
                >
                  Resend
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginTop: spacing[4] }}>
              {timer > 0 ? (
                <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>
                  Resend code in 00:{String(timer).padStart(2, '0')}
                </Text>
              ) : (
                <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>
                  Didn't get it? Tap Resend above
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
