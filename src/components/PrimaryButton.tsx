import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  loading?: boolean;
  disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, variant = 'solid', loading, disabled }: Props) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        outline && styles.outline,
        pressed && { opacity: 0.85 },
        (disabled || loading) && { opacity: 0.5 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, outline && { color: colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  text: { color: '#fff', fontWeight: '700', fontSize: 15 },
});