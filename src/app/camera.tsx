import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert,  Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

type CaptureState = 'idle' | 'first_countdown' | 'first_capturing' | 'second_countdown' | 'second_capturing';

const PREVIEW_WIDTH = 150;
const PREVIEW_HEIGHT = 200;
const COUNTDOWN_SECONDS = 3;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [firstPhotoUri, setFirstPhotoUri] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("back");
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestPermission();
    requestMediaPermission();
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

      await Promise.all([
        saveToGallery(firstPhotoUri),
        saveToGallery(photo.uri)
      ]);

      Alert.alert(
        'Success',
        'Both photos have been saved to your gallery.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error capturing/saving photos:', error);
      Alert.alert('Error', 'Failed to capture or save photos. Please try again.');
    } finally {
      resetCaptureState();
    }
  }

  function resetCaptureState() {
    setFirstPhotoUri(null);
    setCountdown(COUNTDOWN_SECONDS);
    setCaptureState('idle');
  }

  async function saveToGallery(uri: string) {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('StudyBuddy', asset, false);
      return true;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      return false;
    }
  }

  if (!permission || !permission.granted || !mediaPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Camera and media permissions are required</Text>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => {
            requestPermission();
            requestMediaPermission();
          }}
        >
          <Text style={styles.text}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const showCountdown = captureState === 'first_countdown' || captureState === 'second_countdown';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.mainCamera} 
          facing={cameraFacing}
          active={true}
        >
          <View style={styles.overlay}>
            <View style={styles.upperButtonContainer}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity 
                style={styles.flipButton} 
                onPress={() => setCameraFacing(prev => prev === "back" ? "front" : "back")}
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
              {showCountdown && (
                <View style={[styles.countdownContainer, { marginLeft: 20 }]}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              )}
            </View>

            <View style={styles.previewContainer}>
              {firstPhotoUri ? (
                <Image source={{ uri: firstPhotoUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.previewOutline} />
              )}
            </View>

            <View style={styles.bottomButtonContainer}>
              {captureState === 'idle' ? (
                <TouchableOpacity 
                  style={styles.captureButton} 
                  onPress={startPhotoSequence}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
            </View>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  mainCamera: {
    flex: 1,
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  upperButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    zIndex: 3,
  },
  bottomButtonContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
    gap: 30,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
  loadingContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
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
  previewContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
    overflow: 'hidden',
    zIndex: 2,
    borderRadius: 20,
  },
  previewOutline: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
  },
});
