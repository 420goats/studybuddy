import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../src/app/login';

jest.mock('expo-router');
jest.mock('../src/firebase/authServices');
jest.mock('expo-font');
jest.mock('@expo/vector-icons');

describe('Login Screen', () => {
  it('renders without crashing', () => {
    render(<LoginScreen />);
  });
});