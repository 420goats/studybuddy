import AsyncStorage from '@react-native-async-storage/async-storage';

export const resetFirstTimeState = async () => {
  try {
    await AsyncStorage.removeItem('isFirstTime');
    return true;
  } catch (error) {
    console.error('Error resetting first time state:', error);
    return false;
  }
};

export const getFirstTimeState = async () => {
  try {
    const isFirstTime = await AsyncStorage.getItem('isFirstTime');
    return isFirstTime === null;
  } catch (error) {
    console.error('Error getting first time state:', error);
    return true; // Default to first time if there's an error
  }
}; 