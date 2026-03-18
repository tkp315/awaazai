import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import { useSubscriptionStore } from '@/modules/subscription';
import type { IPaymentRecord, PaymentStatus } from '@/modules/subscription';

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  SUCCESS: { label: 'Paid', color: '#16a34a', icon: 'checkmark-circle' },
  PENDING: { label: 'Pending', color: '#d97706', icon: 'time-outline' },
  FAILED: { label: 'Failed', color: '#dc2626', icon: 'close-circle' },
  REFUNDED: { label: 'Refunded', color: '#6366f1', icon: 'return-up-back-outline' },
};

function PaymentRow({ record }: { record: IPaymentRecord }) {
  const { colors, spacing, radius, textStyles } = useTheme();
  const status = STATUS_CONFIG[record.status];
  const date = record.paidAt ?? record.createdAt;
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceHover,
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: spacing[11],
          height: spacing[11],
          borderRadius: radius.avatar,
          backgroundColor: colors.surfaceHover,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing[3],
        }}
      >
        <Ionicons name="card-outline" size={22} color={colors.primary[500]} />
      </View>

      {/* Details */}
      <View style={{ flex: 1 }}>
        <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
          {record.subscription.plan.name} Plan
        </Text>
        <Text style={{ ...textStyles.bodySmall, color: colors.textMuted, marginTop: 2 }}>
          {record.subscription.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'} · {formattedDate}
        </Text>
      </View>

      {/* Amount + Status */}
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ ...textStyles.labelMedium, color: colors.text }}>
          ₹{record.amount.toLocaleString('en-IN')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Ionicons name={status.icon} size={12} color={status.color} />
          <Text style={{ ...textStyles.caption, color: status.color }}>{status.label}</Text>
        </View>
      </View>
    </View>
  );
}

export default function PaymentsScreen(): React.JSX.Element {
  const { colors, spacing, layout, textStyles, radius } = useTheme();
  const router = useRouter();
  const { payments, loadingPayments, fetchPayments } = useSubscriptionStore();

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalPaid = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

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
        <Text style={{ ...textStyles.h4, color: colors.text }}>Payment History</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        {payments.length > 0 && (
          <View
            style={{
              marginHorizontal: layout.screenPaddingHorizontal,
              marginBottom: spacing[5],
              backgroundColor: colors.primary[950],
              borderRadius: radius.card,
              padding: spacing[5],
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>Total Spent</Text>
              <Text style={{ ...textStyles.h3, color: colors.textInverse, marginTop: spacing[1] }}>
                ₹{totalPaid.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>Transactions</Text>
              <Text style={{ ...textStyles.h3, color: colors.textInverse, marginTop: spacing[1] }}>
                {payments.filter(p => p.status === 'SUCCESS').length}
              </Text>
            </View>
          </View>
        )}

        {/* List */}
        <View
          style={{
            marginHorizontal: layout.screenPaddingHorizontal,
            backgroundColor: colors.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          }}
        >
          {loadingPayments ? (
            <ActivityIndicator
              color={colors.primary[500]}
              style={{ paddingVertical: spacing[10] }}
            />
          ) : payments.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing[10] }}>
              <Ionicons name="receipt-outline" size={48} color={colors.border} />
              <Text
                style={{
                  ...textStyles.labelLarge,
                  color: colors.textMuted,
                  marginTop: spacing[3],
                }}
              >
                No payments yet
              </Text>
              <Text
                style={{
                  ...textStyles.bodySmall,
                  color: colors.border,
                  marginTop: spacing[1],
                }}
              >
                Your payment history will appear here
              </Text>
            </View>
          ) : (
            payments.map(record => <PaymentRow key={record.id} record={record} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
