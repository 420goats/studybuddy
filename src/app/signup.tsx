import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'expo-router';

// Hides the default header for a cleaner screen layout (not working ATM)
export const options = {
  headerShown: false,
};

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handles signup logic (placeholder ATM)
  const handleSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    // Simulated account creation
    Alert.alert('Success', `Welcome, ${name}!`);
    router.replace('/home'); // Navigate to main screen after signup
  };

  return (
    <View style={styles.container}>
      {/* Prompt and instructions */}
      <Text style={styles.heading}>Create your account</Text>
      <Text style={styles.subheading}>Join StudyBuddy to start your learning journey</Text>

      {/* Input fields for account information */}
      <AuthInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
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

      {/* Create account button */}
      <AuthButton title="Create Account" onPress={handleSignUp} />

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
