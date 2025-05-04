import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AuthButton from '../components/AuthButton';
import { logOut } from '../firebase/authServices';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logOut();
      if (result.success) {
        router.replace('/login');
      } else {
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <AuthButton 
          title="Log Out" 
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
}); 