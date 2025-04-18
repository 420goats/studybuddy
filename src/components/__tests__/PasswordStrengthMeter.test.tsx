import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

describe('PasswordStrengthMeter Component', () => {
  test('renders nothing when password is empty', () => {
    const { queryByTestId } = render(<PasswordStrengthMeter password="" />);
    expect(queryByTestId('strength-meter')).toBeNull();
  });

  test('shows "Very Weak" for score 1', () => {
    render(<PasswordStrengthMeter password="a" />);
    expect(screen.getByText('Strength: Very Weak')).toBeTruthy();
  });

  test('shows "Weak" for score 2', () => {
    render(<PasswordStrengthMeter password="abc123" />);
    expect(screen.getByText('Strength: Weak')).toBeTruthy();
  });

  test('shows "Okay" for score 3', () => {
    render(<PasswordStrengthMeter password="Abc123" />);
    expect(screen.getByText('Strength: Okay')).toBeTruthy();
  });

  test('shows "Good" for score 4', () => {
    render(<PasswordStrengthMeter password="Abc123!" />);
    expect(screen.getByText('Strength: Good')).toBeTruthy();
  });

  test('shows "Strong" for score 5', () => {
    render(<PasswordStrengthMeter password="Abc123!Long" />);
    expect(screen.getByText('Strength: Strong')).toBeTruthy();
  });

  test('progress bar width matches strength score', () => {
    render(<PasswordStrengthMeter password="Abc123!" />);
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle({ width: '80%' }); // 4/5 = 80%
  });

  test('progress bar color matches strength level', () => {
    render(<PasswordStrengthMeter password="Abc123!" />);
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle({ backgroundColor: '#34c759' }); // Good color
  });
});