import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'expo-router';

// Hides the default header for a cleaner screen layout (not working ATM)
export const options = {
  headerShown: false,
};

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  // Handles password reset logic (placeholder ATM)
  const handleReset = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    // Simulated password reset
    Alert.alert('Check your email', 'We’ve sent a reset link if the account exists.');
    router.back(); // Navigate back to the previous screen (login)
  };

  return (
    <View style={styles.container}>
      {/* Prompt and instructions */}
      <Text style={styles.heading}>Reset password</Text>
      <Text style={styles.subheading}>Enter your email to receive reset code</Text>

      {/* Input field for email */}
      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Send code button */}
      <AuthButton title="Send Code" onPress={handleReset} />

      {/* Link for users who need to log in */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => router.push('/login')}>
          Log In
        </Text>
      </Text>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 24,
    color: '#555',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
