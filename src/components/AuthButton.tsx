import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export default function AuthButton({ title, onPress, loading = false }: AuthButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
