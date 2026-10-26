import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme'

type Props = TextInputProps & { label: string; error?: string };

export default function FormInput({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        style={[styles.input, !!error && styles.inputError, style]}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontWeight: '600', marginBottom: 6, color: colors.ink },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.ink,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, marginTop: 4 },
});