import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  iconBg: string;
  iconColor: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, iconBg, iconColor, value, onPress, danger }: MenuItemProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      <View style={styles.menuRight}>
        {value ? <Text style={styles.menuValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>User</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Subscription Card */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subCardLeft}>
            <View style={styles.subBadge}>
              <Ionicons name="star" size={12} color="#ffffff" />
              <Text style={styles.subBadgeText}>FREE</Text>
            </View>
            <Text style={styles.subTitle}>Free Plan</Text>
            <Text style={styles.subSubtitle}>Upgrade to unlock unlimited voices</Text>
          </View>
          <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.85}>
            <Text style={styles.upgradeBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Usage Stats */}
        <Text style={styles.sectionTitle}>Usage This Month</Text>
        <View style={styles.usageRow}>
          <View style={styles.usageStat}>
            <Text style={styles.usageValue}>0</Text>
            <Text style={styles.usageLabel}>Voices Cloned</Text>
          </View>
          <View style={styles.usageDivider} />
          <View style={styles.usageStat}>
            <Text style={styles.usageValue}>0</Text>
            <Text style={styles.usageLabel}>Conversations</Text>
          </View>
          <View style={styles.usageDivider} />
          <View style={styles.usageStat}>
            <Text style={styles.usageValue}>0 min</Text>
            <Text style={styles.usageLabel}>Audio Generated</Text>
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="card-outline"
            label="Subscription"
            iconBg="#ede9fe"
            iconColor="#7c3aed"
            value="Free"
          />
          <MenuItem
            icon="bar-chart-outline"
            label="Usage & Limits"
            iconBg="#dbeafe"
            iconColor="#2563eb"
          />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Privacy & Security"
            iconBg="#dcfce7"
            iconColor="#16a34a"
          />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            iconBg="#f1f5f9"
            iconColor="#64748b"
          />
          <MenuItem
            icon="information-circle-outline"
            label="About AwaazAI"
            iconBg="#f1f5f9"
            iconColor="#64748b"
          />
        </View>

        {/* Logout */}
        <View style={styles.menuGroup}>
          <MenuItem
            icon="log-out-outline"
            label="Log Out"
            iconBg="#fee2e2"
            iconColor="#dc2626"
            danger
          />
        </View>

        <Text style={styles.version}>AwaazAI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  subCardLeft: {
    flex: 1,
  },
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
    marginBottom: 8,
  },
  subBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  subSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  upgradeBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  upgradeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  usageRow: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 28,
  },
  usageStat: {
    flex: 1,
    alignItems: 'center',
  },
  usageValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  usageLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  usageDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e2e8f0',
  },
  menuGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  menuLabelDanger: {
    color: '#dc2626',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuValue: {
    fontSize: 13,
    color: '#94a3b8',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 8,
  },
});
