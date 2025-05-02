import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAXe2iSjgASjtLqqUNZhJnNiR5hGk9tmpI",
    authDomain: "studybuddy-8f3a1.firebaseapp.com",
    projectId: "studybuddy-8f3a1",
    storageBucket: "studybuddy-8f3a1.firebasestorage.app",
    messagingSenderId: "978295916555",
    appId: "1:978295916555:web:8bc013ac7903ce21d05f0e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);