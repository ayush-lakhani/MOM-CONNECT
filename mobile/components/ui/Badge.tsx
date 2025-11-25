import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

type Props = {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
};

export default function Badge({ label, variant = 'primary' }: Props) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return COLORS.success;
      case 'warning':
        return COLORS.warning;
      case 'danger':
        return COLORS.danger;
      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  text: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
});