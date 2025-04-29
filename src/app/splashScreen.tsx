import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetFirstTimeState, getFirstTimeState } from '../utils/storageUtils';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // Check if it's the first time opening the app
        const isFirstTime = await getFirstTimeState();
        
        // Add a 2-second delay before navigation
        setTimeout(async () => {
          if (isFirstTime) {
            // It's the first time, set the flag and navigate to signup
            await AsyncStorage.setItem('isFirstTime', 'false');
            router.replace('/signup');
          } else {
            // Not the first time, navigate to login
            router.replace('/login');
          }
        }, 2000);
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleLongPress = async () => {
    const success = await resetFirstTimeState();
    if (success) {
      Alert.alert(
        'Reset Successful',
        'The app has been reset to first-time state. Please restart the app.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', 'Failed to reset the app state.');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onLongPress={handleLongPress}>
        <Image 
          source={require('../assets/images/StudyBuddy-Logo.png')} 
          style={styles.logo}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});