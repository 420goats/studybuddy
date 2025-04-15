import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

// Function to check if email is already in use
export const isEmailInUse = async (email: string): Promise<boolean> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));

    const result = await getDocs(q);
    return !result.empty;
  } 
    catch (error) {
    console.error('Error checking if email is in use:', error);
    return false;
  }
};

// Function to check if username is already in use
export const isUsernameInUse = async (username: string): Promise<boolean> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('username', '==', username));

    const result = await getDocs(q);
    return !result.empty; // Returns true if username is already in use
  }
  catch (error) {
      console.error('Error checking if username is in use:', error);
      return false;
  }
};

export const handlePasswordChange = (
    text: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    setPasswordErrors: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setPassword(text);
  
    const minLength = text.length >= 8;
    const hasUppercase = /[A-Z]/.test(text);
    const hasLowercase = /[a-z]/.test(text);
    const hasDigit = /\d/.test(text);
    const hasSpecialChar = /[@$!%*?&]/.test(text);
  
    const errors: string[] = [];
  
    if (!minLength) errors.push('Password must be at least 8 characters.');
    if (!hasUppercase) errors.push('Password must contain at least one uppercase letter.');
    if (!hasLowercase) errors.push('Password must contain at least one lowercase letter.');
    if (!hasDigit) errors.push('Password must contain at least one number.');
    if (!hasSpecialChar) errors.push('Password must contain at least one special character(@,$,!,%,*,?,&).');
  
    setPasswordErrors(errors); // Update password errors in real-time
  };

  export const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
