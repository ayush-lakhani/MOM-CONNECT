import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { dashboardAPI } from '../../utils/api';
import { AuthContext } from '../../utils/AuthContext';
import { Stack } from 'expo-router';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../constants/colors';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (user?._id) fetch();
  }, [user]);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getDashboard(user._id);
      setData(res.data);
    } catch (e) { } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'My Profile' }} />

      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{data?.name?.[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{data?.name}</Text>
            <Text style={styles.profileEmail}>{data?.email}</Text>
            {data?.isVerified && <Badge label="✔ Verified Mom" variant="success" />}
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bio}>
          Mom of 2 👶 • Baking Enthusiast 🍰 • Sharing my journey & tips!
        </Text>
      </Card>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Followers</Text>
          <Text style={styles.statValue}>1.2k</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Following</Text>
          <Text style={styles.statValue}>450</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Likes</Text>
          <Text style={styles.statValue}>5.8k</Text>
        </Card>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>My Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'posts' ? (
        <View style={styles.grid}>
          {/* Placeholder for grid images */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={styles.gridItem} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No saved items yet</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  profileCard: { margin: 16, padding: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: COLORS.white, fontWeight: '800', fontSize: 28 },
  profileName: { fontWeight: '800', fontSize: 20, color: COLORS.textDark },
  profileEmail: { fontSize: 14, color: COLORS.textGray, marginTop: 2 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.borderGray },
  editBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.textDark },
  bio: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  statCard: { flex: 0.31, alignItems: 'center', paddingVertical: 16 },
  statLabel: { fontSize: 12, color: COLORS.textGray, marginBottom: 4 },
  statValue: { fontWeight: '800', fontSize: 18, color: COLORS.textDark },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.borderGray, marginBottom: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textGray },
  activeTabText: { color: COLORS.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '33.33%', aspectRatio: 1, borderWidth: 1, borderColor: COLORS.white, backgroundColor: '#ddd' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.textGray },
});