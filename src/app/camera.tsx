import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Image, Dimensions, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';
import { auth } from '../firebase/firebaseConfig';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type CaptureState = 'idle' | 'first_countdown' | 'first_capturing' | 'second_countdown' | 'second_capturing' | 'adding_caption';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CAMERA_PREVIEW_SIZE = SCREEN_WIDTH - 40; // 20px padding on each side
const COUNTDOWN_SECONDS = 3;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [firstPhotoUri, setFirstPhotoUri] = useState<string | null>(null);
  const [secondPhotoUri, setSecondPhotoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("back");
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (captureState === 'first_countdown' || captureState === 'second_countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      } else {
        if (captureState === 'first_countdown') {
          setCaptureState('first_capturing');
          captureFirstPhoto();
        } else {
          setCaptureState('second_capturing');
          captureSecondPhoto();
        }
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [captureState, countdown]);

  async function startPhotoSequence() {
    setCountdown(COUNTDOWN_SECONDS);
    setCaptureState('first_countdown');
  }

  async function captureFirstPhoto() {
    try {
      if (!cameraRef.current) return;
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        exif: false,
      });

      if (!photo) throw new Error('Failed to capture first photo');
      
      setFirstPhotoUri(photo.uri);
      
      await new Promise(resolve => {
        setCameraFacing(current => current === "back" ? "front" : "back");
        setTimeout(resolve, 500);
      });
      
      setCountdown(COUNTDOWN_SECONDS);
      setCaptureState('second_countdown');
      
    } catch (error) {
      console.error('Error capturing first photo:', error);
      resetCaptureState();
      Alert.alert('Error', 'Failed to capture first photo. Please try again.');
    }
  }

  async function captureSecondPhoto() {
    try {
      if (!cameraRef.current || !firstPhotoUri) return;
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        exif: false,
      });

      if (!photo) throw new Error('Failed to capture second photo');

      setSecondPhotoUri(photo.uri);
      setCaptureState('adding_caption');
      
    } catch (error) {
      console.error('Error capturing/saving photos:', error);
      Alert.alert('Error', 'Failed to capture or save photos. Please try again.');
      resetCaptureState();
    }
  }

  async function savePost() {
    if (!firstPhotoUri || !secondPhotoUri) {
      Alert.alert('Error', 'Missing photos. Please try again.');
      resetCaptureState();
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Save the post data to Firebase
      const postsRef = collection(db, 'posts');
      const newPost = {
        postImage: firstPhotoUri,
        selfieImage: secondPhotoUri,
        username: currentUser.displayName || 'Anonymous',
        caption: caption.trim() || 'Study session',
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
        likedBy: []
      };

      await addDoc(postsRef, newPost);

      Alert.alert(
        'Success',
        'Post created successfully!',
        [{ text: 'OK', onPress: () => router.push('/feed') }]
      );
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Error', 'Failed to save the post. Please try again.');
    } finally {
      resetCaptureState();
    }
  }

  function resetCaptureState() {
    setFirstPhotoUri(null);
    setSecondPhotoUri(null);
    setCaption('');
    setCountdown(COUNTDOWN_SECONDS);
    setCaptureState('idle');
    setCameraFacing('back');
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required</Text>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={requestPermission}
        >
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
        <BottomNav currentRoute="/camera" />
      </View>
    );
  }

  if (captureState === 'adding_caption') {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'web' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.previewContainer}>
              <View style={styles.photoPreview}>
                <Image source={{ uri: firstPhotoUri! }} style={styles.previewImage} />
                <Image 
                  source={{ uri: secondPhotoUri! }} 
                  style={[styles.previewImage, styles.selfiePreview]} 
                />
              </View>
              
              <View style={styles.captionContainer}>
                <TextInput
                  style={styles.captionInput}
                  placeholder="Add a caption..."
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  maxLength={200}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={resetCaptureState}
                >
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.postButton]} 
                  onPress={savePost}
                >
                  <Text style={[styles.buttonText, styles.postButtonText]}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <BottomNav currentRoute="/camera" />
      </KeyboardAvoidingView>
    );
  }

  const showCountdown = captureState === 'first_countdown' || captureState === 'second_countdown';

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.mainCamera} 
          facing={cameraFacing}
          active={true}
        >
          <View style={styles.overlay}>
            {showCountdown && (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View style={styles.captureButtonContainer}>
        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={startPhotoSequence}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>

      <BottomNav currentRoute="/camera" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Space for capture button and nav
  },
  mainCamera: {
    width: CAMERA_PREVIEW_SIZE,
    height: CAMERA_PREVIEW_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 100, // Space for bottom nav
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    padding: 3,
    borderWidth: 3,
    borderColor: 'black',
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 35,
    backgroundColor: 'black',
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Space for bottom nav
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  selfiePreview: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  captionContainer: {
    marginTop: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  captionInput: {
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
  },
  postButton: {
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Extra padding for keyboard
  },
});