import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY', // Your Firebase API key
  authDomain: 'YOUR_AUTH_DOMAIN', // Your Firebase Auth domain
  projectId: 'YOUR_PROJECT_ID', // Your Firebase Project ID
  storageBucket: 'YOUR_STORAGE_BUCKET', // Your Firebase storage bucket
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID', // Your Firebase messaging sender ID
  appId: 'YOUR_APP_ID', // Your Firebase app ID
};

// Initialize Firebase if it hasn’t been initialized already
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig); // Initialize Firebase with the config
  } else {
    firebase.app(); // Use the existing Firebase instance if already initialized
  }
  
  // Password Reset Function
  const sendPasswordResetEmail = async (email: string) => {
    try {
      // Try sending the password reset email using Firebase Auth
      await firebase.auth().sendPasswordResetEmail(email);
      return { success: true }; // Return success if email is sent
    } catch (error) {
      // Return failure and error message if something goes wrong
      return { success: false, error: error.message };
    }
  };
  
  // Reset Password Form Component
  const ResetPasswordForm: React.FC = () => {
    // State to store the email, success message, and error message
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault(); // Prevent page refresh on form submission
  
      // If no email is provided, show an error message
      if (!email) {
        setError('Please enter an email address.');
        return;
      }
  
      // Call the function to send the password reset email
      const result = await sendPasswordResetEmail(email);
  
      // If the email was sent successfully, show a success message
      if (result.success) {
        setMessage('Password reset email sent! Please check your inbox.');
        setError(null); // Clear any previous errors
      } else {
        // If there was an error, show the error message
        setError(`Failed to send password reset email: ${result.error}`);
        setMessage(null); // Clear any previous success message
      }
    };