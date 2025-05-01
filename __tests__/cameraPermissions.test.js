import React from 'react';
import { render } from '@testing-library/react-native';
import CameraScreen from '../src/app/camera';

// create two spies for the permission-request functions
const mockRequestCameraPermission = jest.fn();
const mockRequestMediaPermission  = jest.fn();

jest.mock('expo-camera', () => {
  const React = require('react');
  return {
    // dummy CameraView so the tree still renders
    CameraView: () => null,
    // useCameraPermissions returns [status, requestFn]
    useCameraPermissions: () => [{ granted: false }, mockRequestCameraPermission],
  };
});

jest.mock('expo-media-library', () => ({
  // usePermissions returns [status, requestFn]
  usePermissions: () => [{ granted: false }, mockRequestMediaPermission],
  createAssetAsync: jest.fn(),
  createAlbumAsync: jest.fn(),
}));

// stubs for unrelated modules
jest.mock('expo-router',       () => ({ useRouter: () => ({}) }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

describe('CameraScreen permission behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asks the camera and media libraries for permissions on mount', () => {
    render(<CameraScreen />);
    expect(mockRequestCameraPermission).toHaveBeenCalled();
    expect(mockRequestMediaPermission).toHaveBeenCalled();
  });
});
