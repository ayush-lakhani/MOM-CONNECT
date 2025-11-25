import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', disabled = false, style }: Props) {
  const getStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.base, styles.secondary, disabled && styles.disabled];
      case 'outline':
        return [styles.base, styles.outline, disabled && styles.disabled];
      default:
        return [styles.base, styles.primary, disabled && styles.disabled];
    }
  };

  return (
    <TouchableOpacity style={[...getStyle(), style]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center' },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: { borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.white },
  disabled: { opacity: 0.5 },
  text: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
});