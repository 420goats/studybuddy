import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'expo-router';
import { logIn } from '../firebase/authServices';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handles login logic
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    const response = await logIn(email, password);
    if (response.success) {
      Alert.alert("Welcome back!");
      router.replace("/home"); // Navigate to home after successful login
    } else {
      Alert.alert("Login Failed", response.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Greeting and instructions */}
      <Text style={styles.heading}>Welcome back</Text>
      <Text style={styles.subheading}>Log in to continue your study journey</Text>

      {/* Input fields for user credentials */}
      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login button */}
      <AuthButton title="Log In" onPress={handleLogin} />

      {/* Links for users who need to sign up or reset password */}
      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <Text style={styles.link} onPress={() => router.push('/signup')}>
          Sign Up
        </Text>
      </Text>

      <Text style={styles.footerText}>
        Forgot your password?{' '}
        <Text style={styles.link} onPress={() => router.push('/reset-password')}>
          Reset
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
    marginTop: 16,
    fontSize: 14,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
