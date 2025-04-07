import React, { useState } from 'react';
import {Text, StyleSheet, Alert, Image, Platform} from 'react-native';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'expo-router';
import { signUp } from '../firebase/authServices';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const checkUsernameExists = async (username: string) => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('username','==', username));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;  //If empty, username is available
  }

  // Handles signup logic
  const handleSignUp = async () => {
    if (!name || !email || !username  || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    

    if (password != confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const result = await signUp(name, email, username, password);
    if (result.success) {
      Alert.alert('Success', `Welcome, ${name}!`);
    } else {
      Alert.alert('Signup Failed', result.message || 'Something went wrong.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true} // Ensures it works on Android as well
      extraScrollHeight={Platform.OS === 'ios' ? 40 : 100} // Adjusts for different platforms
    >
      {/*StudyBuddy Logo*/}
      <Image source={require('../assets/images/StudyBuddy-Logo.png')} style={styles.logo} />
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
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {/* Password input */}
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
      >
        
        {/* show/hide password eye icon*/}
        <Feather
         name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#555"
          onPress={() => setShowPassword((prev) => !prev)} // 👈 toggle visibility
      />
      </AuthInput>

      <AuthInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
        }}
        onBlur={() => setConfirmPasswordTouched(true)}
        secureTextEntry={!showPassword}
      />

      {confirmPasswordTouched && password !== confirmPassword && (
        <Text style={styles.passMatchErrorText}>Passwords do not match.</Text>
      )}

      {/* Create account button */}
      <AuthButton title="Create Account" onPress={handleSignUp} />

      {/* Link for users who need to log in */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => router.push('/login')}>
          Log In
        </Text>
      </Text>
    </KeyboardAwareScrollView>
  );
}

// Styling
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: 30,
  },
  logo: {
    width: 155,
    height: 155,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  passMatchErrorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});
