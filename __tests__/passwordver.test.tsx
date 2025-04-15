import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../src/app/login';

jest.mock('expo-router');
jest.mock('../src/firebase/authServices');

describe('Login Screen', () => {
  it('renders email input', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });
});