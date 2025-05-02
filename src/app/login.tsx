import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'expo-router';
import { logIn } from '../firebase/authServices';
import { Ionicons } from '@expo/vector-icons';

// Use require to import the PNG image
const Logo = require('../assets/images/StudyBuddy-Logo.png');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles login logic
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    const response = await logIn(email, password);
    if (response.success) {
      router.replace('/feed');
    } else {
      Alert.alert("Login Failed", response.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={Logo} style={styles.logo} /> {/* Use Image to display the PNG */}
          
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
            returnKeyType="next"
          />
          <View style={styles.passwordContainer}>
            <AuthInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <AuthButton title="Log In" onPress={handleLogin} loading={loading} />

          {/* Links for users who need to sign up or reset password */}
          <View style={styles.footerContainer}>
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>
                <Text>Don't have an account? </Text>
                <Text style={styles.link} onPress={() => router.push('/signup')}>
                  Sign Up
                </Text>
              </Text>
            </View>

            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>
                <Text>Forgot your password? </Text>
                <Text style={styles.link} onPress={() => router.push('/reset-password')}>
                  Reset
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logo: {
    width: 130, // Adjust width as needed
    height: 130, // Adjust height as needed
    resizeMode: 'contain',
    alignSelf: 'center', // Center the logo
    marginBottom: 30, // Add some space below the logo
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 24,
    color: '#555',
  },
  footerContainer: {
    marginTop: 20,
  },
  footerTextContainer: {
    marginBottom: 15,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
});