import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's profile with their display name
    await updateProfile(userCredential.user, { displayName });

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
