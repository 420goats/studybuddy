import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useGoogleAuth } from '../useGoogleAuth';

export default function IndexScreen() {
  const { promptAsync, request } = useGoogleAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudyBuddy</Text>
      <Button
        title="Sign in with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
