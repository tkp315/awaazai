import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks';
import type { LimitKey } from '@/modules/subscription';

interface PaywallModalProps {
  visible: boolean;
  limitKey: LimitKey;
  onClose: () => void;
}

const LIMIT_COPY: Record<LimitKey, { icon: string; title: string; description: string }> = {
  VOICE_CLONES: {
    icon: 'mic',
    title: 'Voice Clone Limit Reached',
    description: 'You have reached the maximum number of voice clones on your current plan. Upgrade to clone more voices.',
  },
  VOICE_CHATS: {
    icon: 'chatbubbles',
    title: 'Chat Limit Reached',
    description: 'You have used all your voice chats this month. Upgrade for unlimited conversations.',
  },
  AI_BOTS: {
    icon: 'hardware-chip',
    title: 'Bot Limit Reached',
    description: 'You have reached the maximum number of AI bots. Upgrade to create more bots.',
  },
};

export function PaywallModal({ visible, limitKey, onClose }: PaywallModalProps): React.JSX.Element {
  const { colors, spacing, radius, textStyles } = useTheme();
  const router = useRouter();
  const copy = LIMIT_COPY[limitKey];

  const handleUpgrade = () => {
    onClose();
    router.push('/(routes)/subscription/plans');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: radius.bottomSheet,
            borderTopRightRadius: radius.bottomSheet,
            padding: spacing[6],
          }}
          onPress={e => e.stopPropagation()}
        >
          {/* Icon */}
          <View style={{ alignItems: 'center', marginBottom: spacing[4] }}>
            <View
              style={{
                width: spacing[16],
                height: spacing[16],
                borderRadius: spacing[8],
                backgroundColor: colors.primary[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={copy.icon as any} size={32} color={colors.primary[500]} />
            </View>
          </View>

          {/* Title */}
          <Text style={{ ...textStyles.h4, color: colors.text, textAlign: 'center', marginBottom: spacing[2] }}>
            {copy.title}
          </Text>

          {/* Description */}
          <Text style={{ ...textStyles.bodyMedium, color: colors.textMuted, textAlign: 'center', marginBottom: spacing[6] }}>
            {copy.description}
          </Text>

          {/* Upgrade button */}
          <TouchableOpacity
            onPress={handleUpgrade}
            style={{
              backgroundColor: colors.primary[500],
              borderRadius: radius.button,
              paddingVertical: spacing[3.5],
              alignItems: 'center',
              marginBottom: spacing[3],
            }}
            activeOpacity={0.85}
          >
            <Text style={{ ...textStyles.buttonMedium, color: colors.textInverse }}>View Plans</Text>
          </TouchableOpacity>

          {/* Dismiss */}
          <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', paddingVertical: spacing[2] }}>
            <Text style={{ ...textStyles.bodySmall, color: colors.textMuted }}>Maybe later</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
