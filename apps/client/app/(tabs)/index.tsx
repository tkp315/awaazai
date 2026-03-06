import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.username}>User</Text>
          </View>
          <View style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#334155" />
          </View>
        </View>

        {/* Hero CTA */}
        <TouchableOpacity style={styles.heroCta} activeOpacity={0.85}>
          <View style={styles.heroCtaIcon}>
            <Ionicons name="mic" size={28} color="#ffffff" />
          </View>
          <View style={styles.heroCtaText}>
            <Text style={styles.heroCtaTitle}>Start a Conversation</Text>
            <Text style={styles.heroCtaSubtitle}>Chat with a cloned voice</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: '#ede9fe' }]}>
              <Ionicons name="add-circle" size={24} color="#7c3aed" />
            </View>
            <Text style={styles.actionLabel}>Clone Voice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="chatbubbles" size={24} color="#2563eb" />
            </View>
            <Text style={styles.actionLabel}>My Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="people" size={24} color="#16a34a" />
            </View>
            <Text style={styles.actionLabel}>My Voices</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Voices */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Voices</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <Ionicons name="mic-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No voices yet</Text>
          <Text style={styles.emptySubtitle}>Clone your first voice to get started</Text>
          <TouchableOpacity style={styles.emptyBtn} activeOpacity={0.8}>
            <Text style={styles.emptyBtnText}>Clone a Voice</Text>
          </TouchableOpacity>
        </View>
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
  greeting: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  username: {
    fontSize: 22,
    color: '#0f172a',
    fontWeight: '700',
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  heroCta: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  heroCtaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroCtaText: {
    flex: 1,
  },
  heroCtaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  heroCtaSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 16,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
