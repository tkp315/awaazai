import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import RazorpayCheckout from 'react-native-razorpay';
import { useTheme } from '@/hooks';
import { useSubscriptionStore, createOrder, verifyPayment } from '@/modules/subscription';
import type { IPlan, BillingCycle } from '@/modules/subscription';

// ── Feature row ───────────────────────────────────────────────────────────────

function FeatureRow({ label, included }: { label: string; included: boolean }) {
  const { colors, spacing, textStyles } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: spacing[1.5],
      }}
    >
      <Ionicons
        name={included ? 'checkmark-circle' : 'close-circle-outline'}
        size={16}
        color={included ? colors.success.dark : colors.textMuted}
      />
      <Text style={{ ...textStyles.bodySmall, color: included ? colors.text : colors.textMuted }}>
        {label}
      </Text>
    </View>
  );
}

// ── Plan features helper ──────────────────────────────────────────────────────

function planFeatures(plan: IPlan): { label: string; included: boolean }[] {
  const getLimit = (key: string) => plan.features.find(f => f.limitKey === key)?.limitValue ?? 0;
  const voices = getLimit('VOICE_CLONES');
  const chats = getLimit('VOICE_CHATS');
  const bots = getLimit('AI_BOTS');

  return [
    {
      label:
        voices === -1
          ? 'Unlimited voice clones'
          : `${voices} voice clone${voices !== 1 ? 's' : ''}`,
      included: voices !== 0,
    },
    {
      label:
        chats === -1
          ? 'Unlimited voice chats'
          : `${chats} voice chat${chats !== 1 ? 's' : ''} / month`,
      included: chats !== 0,
    },
    {
      label:
        bots === -1
          ? 'Unlimited AI bots'
          : bots === 0
            ? 'No AI bots'
            : `${bots} AI bot${bots !== 1 ? 's' : ''}`,
      included: bots !== 0,
    },
    { label: 'Priority support', included: plan.slug !== 'free' },
    { label: 'HD audio quality', included: plan.slug === 'pro' },
  ];
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isCurrentPlan,
  billingCycle,
  onSelect,
  selecting,
}: {
  plan: IPlan;
  isCurrentPlan: boolean;
  billingCycle: BillingCycle;
  onSelect: (plan: IPlan) => void;
  selecting: boolean;
}) {
  const { colors, spacing, radius, textStyles } = useTheme();
  const isPro = plan.slug === 'pro';
  const isFree = plan.slug === 'free';
  const price = billingCycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;
  const features = planFeatures(plan);

  return (
    <View
      style={{
        backgroundColor: isPro ? colors.primary[950] : colors.surface,
        borderRadius: radius.card,
        borderWidth: isPro ? 0 : 1,
        borderColor: colors.border,
        padding: spacing[5],
        marginBottom: spacing[4],
        position: 'relative',
      }}
    >
      {isPro && (
        <View
          style={{
            position: 'absolute',
            top: spacing[3],
            right: spacing[3],
            backgroundColor: colors.primary[500],
            borderRadius: radius.badge,
            paddingHorizontal: spacing[2],
            paddingVertical: spacing[0.5],
          }}
        >
          <Text style={{ ...textStyles.labelSmall, color: colors.textInverse }}>POPULAR</Text>
        </View>
      )}

      <Text
        style={{
          ...textStyles.labelLarge,
          color: isPro ? colors.textInverse : colors.text,
          marginBottom: spacing[1],
        }}
      >
        {plan.name}
      </Text>
      {plan.description && (
        <Text
          style={{
            ...textStyles.bodySmall,
            color: isPro ? colors.textMuted : colors.textMuted,
            marginBottom: spacing[3],
          }}
        >
          {plan.description}
        </Text>
      )}

      {!isFree && (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: spacing[4] }}>
          <Text style={{ ...textStyles.h2, color: isPro ? colors.textInverse : colors.text }}>
            ₹{price}
          </Text>
          <Text
            style={{ ...textStyles.bodySmall, color: colors.textMuted, marginLeft: spacing[1] }}
          >
            /{billingCycle === 'YEARLY' ? 'yr' : 'mo'}
          </Text>
          {billingCycle === 'YEARLY' && (
            <View
              style={{
                backgroundColor: colors.success.light,
                borderRadius: radius.badge,
                paddingHorizontal: spacing[1.5],
                paddingVertical: 2,
                marginLeft: spacing[2],
              }}
            >
              <Text style={{ ...textStyles.caption, color: colors.success.dark }}>Save 17%</Text>
            </View>
          )}
        </View>
      )}

      <View style={{ marginBottom: spacing[4] }}>
        {features.map(f => (
          <FeatureRow key={f.label} label={f.label} included={f.included} />
        ))}
      </View>

      {!isFree && (
        <TouchableOpacity
          onPress={() => onSelect(plan)}
          disabled={isCurrentPlan || selecting}
          style={{
            backgroundColor: isCurrentPlan ? colors.surfaceHover : colors.primary[500],
            borderRadius: radius.button,
            paddingVertical: spacing[3],
            alignItems: 'center',
          }}
          activeOpacity={0.85}
        >
          {selecting ? (
            <ActivityIndicator size="small" color={colors.textInverse} />
          ) : (
            <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>
              {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function PlansScreen(): React.JSX.Element {
  const { colors, spacing, layout, textStyles, radius } = useTheme();
  const router = useRouter();
  const { subscription, plans, loadingPlans, fetchPlans, fetchSubscription } = useSubscriptionStore();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  const currentPlanSlug = subscription?.plan?.slug ?? 'free';

  const handleSelectPlan = async (plan: IPlan) => {
    setSelecting(plan.slug);
    try {
      const order = await createOrder({ planSlug: plan.slug, billingCycle });

      const keyId = Constants.expoConfig?.extra?.RAZORPAY_KEY_ID as string;

      const options = {
        key: keyId,
        amount: String(order.amount * 100), // Razorpay expects paise
        currency: order.currency,
        order_id: order.orderId,
        name: 'AwaazAI',
        description: `${plan.name} - ${billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}`,
        prefill: {},
        theme: { color: '#6366F1' },
      };

      const paymentData = await RazorpayCheckout.open(options);

      await verifyPayment({
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpaySignature: paymentData.razorpay_signature,
        planSlug: plan.slug,
        billingCycle,
      });

      await fetchSubscription();

      Alert.alert('Success', `You are now on the ${plan.name} plan!`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      // User cancelled payment — Razorpay throws with description = "Payment cancelled"
      const razorpayError = err as { error?: { description?: string } };
      if (razorpayError?.error?.description === 'Payment cancelled') return;
      Alert.alert('Payment Failed', 'Could not complete payment. Please try again.');
    } finally {
      setSelecting(null);
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
          paddingVertical: spacing[3],
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: spacing[3] }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ ...textStyles.h4, color: colors.text }}>Choose a Plan</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingHorizontal,
          paddingBottom: spacing[8],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text
          style={{ ...textStyles.bodyMedium, color: colors.textMuted, marginBottom: spacing[5] }}
        >
          Unlock unlimited voices, chats, and AI bots.
        </Text>

        {/* Billing toggle */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: radius.button,
            padding: spacing[0.5],
            marginBottom: spacing[6],
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {(['MONTHLY', 'YEARLY'] as BillingCycle[]).map(cycle => (
            <TouchableOpacity
              key={cycle}
              onPress={() => setBillingCycle(cycle)}
              style={{
                flex: 1,
                paddingVertical: spacing[2],
                alignItems: 'center',
                borderRadius: radius.button - 2,
                backgroundColor: billingCycle === cycle ? colors.primary[500] : 'transparent',
              }}
            >
              <Text
                style={{
                  ...textStyles.labelSmall,
                  color: billingCycle === cycle ? colors.textInverse : colors.textMuted,
                }}
              >
                {cycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plans */}
        {loadingPlans ? (
          <ActivityIndicator color={colors.primary[500]} style={{ marginTop: spacing[10] }} />
        ) : (
          plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={plan.slug === currentPlanSlug}
              billingCycle={billingCycle}
              onSelect={handleSelectPlan}
              selecting={selecting === plan.slug}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
