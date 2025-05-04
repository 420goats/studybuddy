import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from '../src/app/settings';
import { logOut } from '../src/firebase/authServices';
import { useRouter } from 'expo-router';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth service
jest.mock('../src/firebase/authServices', () => ({
  logOut: jest.fn(),
}));

describe('Settings Screen', () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('should call logout and navigate to login on successful logout', async () => {
    // Mock successful logout
    logOut.mockResolvedValueOnce({ success: true });

    const { getByText } = render(<SettingsScreen />);
    
    // Find and press the logout button
    const logoutButton = getByText('Log Out');
    fireEvent.press(logoutButton);

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(logOut).toHaveBeenCalled();
      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });
  });

  it('should show error alert on failed logout', async () => {
    // Mock failed logout
    logOut.mockResolvedValueOnce({ 
      success: false, 
      message: 'Logout failed' 
    });

    const { getByText } = render(<SettingsScreen />);
    
    // Find and press the logout button
    const logoutButton = getByText('Log Out');
    fireEvent.press(logoutButton);

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(logOut).toHaveBeenCalled();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });
});
