import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, message: error.message };
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
