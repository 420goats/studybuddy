import React from 'react';
import { render } from '@testing-library/react-native';
import FeedScreen from '../src/app/feed';

jest.mock('expo-router');
jest.mock('../src/components/BottomNav', () => 'BottomNav');

describe('Feed Screen', () => {
  it('renders', () => {
    render(<FeedScreen />);
  });

  it('shows loading indicator', () => {
    const { getByTestId } = render(<FeedScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
}); 