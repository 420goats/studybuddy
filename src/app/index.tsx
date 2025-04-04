import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AuthButton from '../components/AuthButton';

// Hides the default header for a cleaner screen layout (not working ATM)
export const options = {
  headerShown: false,
};

export default function WelcomeScreen() {
  const router = useRouter();

  // Will handle Google sign in once Firebase is implemented
  const handleGoogleSignIn = () => {
    // Note: Add Firebase functionality here
  };

  return (
    <View style={styles.container}>
      {/* StudyBuddy logo */}
      <Image source={require('../assets/images/StudyBuddy-Logo.png')} style={styles.logo} />

      {/* Introductory text for the app */}
      <Text style={styles.description}>
        Stay motivated and accountable with friends while building productive study habits.
      </Text>

      {/* Navigate to signup screen */}
      <AuthButton title="Sign Up" onPress={() => router.push('/signup')} />

      {/* Navigate to login screen */}
      <AuthButton title="Log In" onPress={() => router.push('/login')} />

      {/* Divider and Google signup option (non-functional ATM) */}
      <Text style={styles.divider}>──────── or continue with ────────</Text>

      <Pressable onPress={handleGoogleSignIn}>
        <Image
          source={require('../assets/images/Google-Logo.png')}
          style={styles.icon}
        />
      </Pressable>

      {/* TOS and Privacy Policy */}
      <Text style={styles.termsText}>
        By clicking continue, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 120,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  divider: {
    marginTop: 24,
    marginBottom: 12,
    color: '#999',
    fontSize: 12,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  termsText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#000',
  },
});
