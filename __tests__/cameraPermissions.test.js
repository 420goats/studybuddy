import React from 'react';
import { render } from '@testing-library/react-native';
import CameraScreen from '../src/app/camera';

// Create a mock function for the permission request
const mockRequestPermission = jest.fn();

// Mock expo-camera
jest.mock('expo-camera', () => ({
  useCameraPermissions: () => [{ granted: false }, mockRequestPermission],
}));

// Mock other dependencies with minimal implementations
jest.mock('expo-router', () => ({ useRouter: () => ({}) }));
jest.mock('@expo/vector-icons', () => ({ Feather: () => null, Ionicons: () => null }));
jest.mock('@react-native-async-storage/async-storage', () => ({}));

describe('CameraScreen', () => {
  it('requests camera permissions on mount', () => {
    render(<CameraScreen />);
    expect(mockRequestPermission).toHaveBeenCalled();
  });
});
