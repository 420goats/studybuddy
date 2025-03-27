import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function useGoogleAuth() {
  const redirectUri = 'https://auth.expo.io/@sanydagher/studybuddy';

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '978295916555-d9ak76kur86vr1903u22t8rp15hbtq6o.apps.googleusercontent.com', // ✅ Your Web client ID
      redirectUri,
      scopes: ['profile', 'email'],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const credential = GoogleAuthProvider.credential(
        null,
        response.authentication.accessToken
      );

      signInWithCredential(auth, credential)
        .then((userCred) => {
          console.log('Logged in user:', userCred.user.email);
        })
        .catch((err) => {
          console.error('Firebase sign-in error:', err);
        });
    }
  }, [response]);

  return {
    promptAsync,
    request,
  };
}

