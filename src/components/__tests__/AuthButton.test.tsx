import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AuthButton from '../AuthButton';

describe('AuthButton Component', () => {
  test('renders with correct title', () => {
    render(<AuthButton title="Login" />);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  test('applies custom styles', () => {
    render(<AuthButton title="Login" />);
    const button = screen.getByTestId('auth-button');
    const text = screen.getByText('Login');
    
    // Check button styles
    expect(button).toHaveStyle({
      backgroundColor: 'black',
      padding: 15,
      borderRadius: 8,
    });
    
    // Check text styles
    expect(text).toHaveStyle({
      color: 'white',
      fontSize: 16,
    });
  });

  test('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    render(<AuthButton title="Login" onPress={mockOnPress} />);
    
    fireEvent.press(screen.getByText('Login'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('is disabled when disabled prop is true', () => {
    render(<AuthButton title="Login" disabled={true} />);
    const button = screen.getByTestId('auth-button');
    expect(button).toBeDisabled();
  });
});