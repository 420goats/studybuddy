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