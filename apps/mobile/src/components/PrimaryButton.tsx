import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function PrimaryButton({
  label,
  onPress
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#154734',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700'
  }
});
