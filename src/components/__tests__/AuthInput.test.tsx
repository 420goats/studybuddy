import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { View, TextInput } from 'react-native'; // Added missing import
import AuthInput from '../AuthInput';

// Mock child component (e.g., a password toggle icon)
const MockChild = () => <View testID="mock-child" />;

describe('AuthInput Component', () => {
  test('renders text input with placeholder', () => {
    render(<AuthInput placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();
  });

  test('displays error message when error prop exists', () => {
    render(<AuthInput error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeTruthy();
    expect(screen.getByText('Invalid email')).toHaveStyle({
      color: 'red',
      fontSize: 13,
    });
  });

  test('hides error message when no error prop', () => {
    render(<AuthInput />);
    expect(screen.queryByTestId('error-text')).toBeNull();
  });

  test('renders child components', () => {
    render(<AuthInput children={<MockChild />} />);
    expect(screen.getByTestId('mock-child')).toBeTruthy();
  });

  test('has correct input styling', () => {
    render(<AuthInput />);
    const input = screen.getByTestId('auth-input');
    expect(input).toHaveStyle({
      padding: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
    });
  });

  test('forwards TextInput props', () => {
    const onChangeTextMock = jest.fn();
    render(<AuthInput onChangeText={onChangeTextMock} />);
    
    fireEvent.changeText(screen.getByTestId('auth-input'), 'test@email.com');
    expect(onChangeTextMock).toHaveBeenCalledWith('test@email.com');
  });
});