import React from 'react';
import { render } from '@testing-library/react-native';
import FeedScreen from '../src/app/feed';

jest.mock('expo-router');
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));
jest.mock('@expo/vector-icons', () => ({
  Feather: () => 'FeatherIcon',
}));

describe('Feed Screen', () => {
  it('shows loading indicator', () => {
    const { getByTestId } = render(<FeedScreen />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });
}); 