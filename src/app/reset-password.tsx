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
  ScrollView
} from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from '../firebase/authServices';

const Logo = require('../assets/images/StudyBuddy-Logo.png');

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await sendPasswordResetEmail(email);
      if (result.success) {
        Alert.alert(
          'Success',
          'Password reset email sent. Please check your inbox.',
          [{ text: 'OK', onPress: () => router.push('/login') }]
        );
      } else {
        setError(result.message || 'Failed to send reset email.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
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
          <Image source={Logo} style={styles.logo} />
          
          <Text style={styles.heading}>Reset Password</Text>
          <Text style={styles.subheading}>Enter your email to receive a password reset link</Text>

          <AuthInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleResetPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <AuthButton 
            title="Send Reset Link" 
            onPress={handleResetPassword}
            loading={loading}
          />

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              <Text>Remember your password? </Text>
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
