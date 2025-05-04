import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let message = 'Failed to log in. Please try again.';
    if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email. Please check your email or sign up.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/network-request-failed') {
      message = 'Network error. Please check your internet connection.';
    }
    return { success: false, message };
  }
};

export const signUp = async (
  displayName: string,
  email: string, 
  username: string,
  password: string

) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's profile with their display name
    await updateProfile(userCredential.user, { displayName });

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      createdAt: new Date(),
      name: displayName,
      email: email,
      username: username
    });

    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    let message = 'Failed to send reset email. Please try again.';
    if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many attempts. Please try again later.';
    }
    return { success: false, message };
  }
};
