import React, { useRef } from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text, Platform, TouchableWithoutFeedback } from 'react-native';

interface AuthInputProps extends TextInputProps {
  children?: React.ReactNode;
  error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ children, error, ...props }) => {
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    if (Platform.OS === 'web' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.inputWrapper}>
        <TextInput 
          ref={inputRef}
          style={styles.input} 
          placeholderTextColor="#555" 
          {...props}
        />
        {children && <View style={styles.showPassIcon}>{children}</View>}
        
        {error && (
          <View style={styles.errorWrapper}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
