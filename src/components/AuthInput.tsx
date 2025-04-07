import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';

interface AuthInputProps extends TextInputProps {
  children?: React.ReactNode;
}

const AuthInput: React.FC<AuthInputProps> = ({ children, ...props }) => {
  return (
    <View style={styles.inputWrapper}>
      <TextInput 
      style={styles.input} 
      placeholderTextColor="#555" //Adjust this to change placeholder text
      {...props} />
      {children && <View style={styles.showPassIcon}>{children}</View>}
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
});

export default AuthInput;
