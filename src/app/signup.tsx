import React, { useState, useEffect, useCallback } from 'react';
import { 
  Text, 
  StyleSheet, 
  Alert, 
  Image, 
  Platform, 
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'expo-router';
import { signUp } from '../firebase/authServices';
import { Feather, Ionicons } from '@expo/vector-icons';
import { isEmailInUse, isUsernameInUse, handlePasswordChange } from '../utils/authUtils';
import { debounce } from 'lodash';

const Logo = require('../assets/images/StudyBuddy-Logo.png');

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [usernameError, setUsernameError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmailFormat = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidUsernameFormat = (username: string) =>
    /^[a-zA-Z0-9_]{3,15}$/.test(username); // Alphanumeric + underscore, 3-15 chars

  const checkEmail = useCallback(
    debounce(async (emailToCheck: string) => {
      console.log('🔍 Checking if email is in use:', emailToCheck);
      try {
        const exists = await isEmailInUse(emailToCheck);
        console.log('📧 Email exists:', exists);
        setEmailError(exists ? 'This email is already in use.' : undefined);
      } catch (error) {
        console.log('❌ Error checking email:', error);
        setEmailError('Failed to check email.');
      }
    }, 500),
    []
  );

  const checkUsername = useCallback(
    debounce(async (usernameToCheck: string) => {
      console.log('🔍 Checking if username is in use:', usernameToCheck);
      try {
        const exists = await isUsernameInUse(usernameToCheck);
        console.log('👤 Username exists:', exists);
        setUsernameError(exists ? 'This username is already taken.' : undefined);
      } catch (error) {
        console.log('❌ Error checking username:', error);
        setUsernameError('Failed to check username.');
      }
    }, 500),
    []
  );

  useEffect(() => {
    const trimmed = email.trim();
    if (isValidEmailFormat(trimmed)) {
      console.log('✅ Valid email format:', trimmed);
      checkEmail(trimmed);
    } else {
      console.log('❌ Invalid email format:', trimmed);
    }
  }, [email, checkEmail]);

  useEffect(() => {
    const trimmed = username.trim();
    if (isValidUsernameFormat(trimmed)) {
      console.log('✅ Valid username format:', trimmed);
      checkUsername(trimmed);
    } else {
      console.log('❌ Invalid username format:', trimmed);
    }
  }, [username, checkUsername]);

  const handleSignUp = async () => {
    console.log('🚀 Attempting to sign up...');

    if (!name || !email || !username || !password || !confirmPassword) {
      console.log('❗Missing fields');
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (emailError || usernameError) {
      console.log('❗Validation errors:', { emailError, usernameError });
      return;
    }

    if (password !== confirmPassword) {
      console.log('❗Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signUp(name, email, username, password);
    if (result.success) {
      console.log('✅ Signup successful');
      Alert.alert('Success', `Welcome, ${name}!`);
      router.replace('/login')
    } else {
      console.log('❌ Signup failed:', result.message);
      Alert.alert('Signup Failed', result.message || 'Something went wrong.');
    }

    setLoading(false);
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
          <Image source={Logo} style={styles.logo} />

          <Text style={styles.heading}>Create your account</Text>
          <Text style={styles.subheading}>Join StudyBuddy to start your study journey</Text>

          <AuthInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <AuthInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (!isValidEmailFormat(text.trim())) {
                setEmailError("Please enter a valid email address.");
              } else {
                setEmailError(undefined);
              }
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={emailError}
            returnKeyType="next"
          />

          <AuthInput
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (!isValidUsernameFormat(text.trim())) {
                setUsernameError("Username must be 3–15 characters and alphanumeric/underscores.");
              } else {
                setUsernameError(undefined);
              }
            }}
            autoCapitalize="none"
            error={usernameError}
            returnKeyType="next"
          />

          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => handlePasswordChange(text, setPassword, setPasswordErrors)}
            secureTextEntry
            error={confirmPasswordTouched && passwordErrors.length > 0 ? passwordErrors.join('\n') : undefined}
            returnKeyType="next"
          />

          <AuthInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            onBlur={() => setConfirmPasswordTouched(true)}
            secureTextEntry
            error={confirmPasswordTouched && password !== confirmPassword ? 'Passwords do not match.' : undefined}
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <AuthButton 
            title="Sign Up" 
            onPress={handleSignUp}
            loading={loading}
          />

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              <Text>Already have an account? </Text>
              <Text style={styles.link} onPress={() => router.push('/login')}>
                Log In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

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
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
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
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
