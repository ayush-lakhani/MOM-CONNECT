import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../utils/AuthContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SideDrawer({ visible, onClose }: Props) {
  const router = useRouter();
  const { logout, user } = useContext(AuthContext);

  const go = (path: string) => {
    onClose();
    setTimeout(() => router.push(path), 120);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace('/(auth)/login');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.drawer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{STRINGS.app_name}</Text>
            <Text style={styles.userName}>{user?.name || 'Mom'}</Text>

            <TouchableOpacity onPress={() => go('/(tabs)/home')} style={styles.item}>
              <Text style={styles.itemIcon}>🏠</Text>
              <Text style={styles.itemText}>{STRINGS.home}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => go('/(tabs)/community')} style={styles.item}>
              <Text style={styles.itemIcon}>👥</Text>
              <Text style={styles.itemText}>{STRINGS.community}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => go('/(tabs)/marketplace')} style={styles.item}>
              <Text style={styles.itemIcon}>🛍️</Text>
              <Text style={styles.itemText}>{STRINGS.marketplace}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => go('/(tabs)/dashboard')} style={styles.item}>
              <Text style={styles.itemIcon}>📊</Text>
              <Text style={styles.itemText}>{STRINGS.dashboard}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity onPress={handleLogout} style={[styles.item, styles.logoutItem]}>
              <Text style={styles.itemIcon}>🚪</Text>
              <Text style={styles.logoutText}>{STRINGS.logout}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start' },
  drawer: {
    width: '75%',
    maxWidth: 300,
    backgroundColor: COLORS.white,
    paddingTop: 52,
    paddingHorizontal: 16,
    height: '100%',
    elevation: 6,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.primaryDark, marginBottom: 4 },
  userName: { fontSize: 14, color: COLORS.textGray, marginBottom: 20 },
  item: { flexDirection: 'row', paddingVertical: 12, alignItems: 'center' },
  itemIcon: { fontSize: 20, marginRight: 12 },
  itemText: { fontSize: 16, color: COLORS.textDark, fontWeight: '600' },
  logoutItem: { marginTop: 12 },
  logoutText: { fontSize: 16, color: COLORS.danger, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.borderGray, marginVertical: 12 },
});