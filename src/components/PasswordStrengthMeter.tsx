import React from 'react';
import { View, Text } from 'react-native';

type Strength = {
  score: number;
  label: string;
  color: string;
};

type Props = {
  password: string;
};

const calculatePasswordStrength = (password: string): Strength => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  const labels = ['Very Weak', 'Weak', 'Okay', 'Good', 'Strong'];
  const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff'];

  return {
    score,
    label: labels[score - 1] || 'Too Short',
    color: colors[score - 1] || '#ccc',
  };
};

const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  if (!password) return null;

  const { score, label, color } = calculatePasswordStrength(password);
  const barWidthPercent = `${(score / 5) * 100}%`;

  return (
<<<<<<< HEAD
    <View testID="strength-meter" style={{ marginBottom: 16 }}>
=======
    <View style={{ marginBottom: 16 }}>
>>>>>>> c5d2080698172150f428392472847de13447fe53
      {/* Background bar */}
      <View
        style={{
          width: '100%',
          height: 6,
          backgroundColor: '#eee',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* Filled strength bar */}
        <View
<<<<<<< HEAD
          testID="progress-bar"
=======
>>>>>>> c5d2080698172150f428392472847de13447fe53
          style={{
            height: '100%',
            width: barWidthPercent,
            backgroundColor: color,
          }}
        />
      </View>

      <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
        Strength: {label}
      </Text>
    </View>
  );
};

export default PasswordStrengthMeter;
