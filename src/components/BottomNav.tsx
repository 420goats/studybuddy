import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function BottomNav({ currentRoute }: { currentRoute: string }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => router.replace('/feed')}
      >
        <Feather 
          name="home" 
          size={24} 
          color={currentRoute === '/' ? 'black' : '#8E8E8F'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => router.replace('/camera')}
      >
        <Feather 
          name="camera" 
          size={24} 
          color={currentRoute === '/camera' ? 'black' : '#8E8E8F'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => router.replace('/friends')}
      >
        <Feather 
          name="users" 
          size={24} 
          color={currentRoute === '/friends' ? 'black' : '#8E8E8F'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => router.replace('/profile')}
      >
        <Feather 
          name="user" 
          size={24} 
          color={currentRoute === '/profile' ? 'black' : '#8E8E8F'} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#DBDBDB',
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
  },
  iconContainer: {
    padding: 10,
  },
}); 