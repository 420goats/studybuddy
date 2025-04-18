import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';

interface AuthInputProps extends TextInputProps {
  children?: React.ReactNode;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ children, error, ...props }) => {
  return (
    <View style={styles.inputWrapper}>
      <TextInput 
        testID="auth-input"
        style={styles.input} 
        placeholderTextColor="#555" 
        {...props} 
      />
      {children && <View style={styles.showPassIcon}>{children}</View>}
      
      {error && (
        <View style={styles.errorWrapper}>
          <Text testID="error-text" style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  showPassIcon: {
    position: 'absolute',
    right: 15,
    top: 18, 
  },
  errorWrapper: {
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginLeft: 5,
  },
});

export default AuthInput;