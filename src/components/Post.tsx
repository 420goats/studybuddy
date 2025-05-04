import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type PostProps = {
  id: string;
  username: string;
  selfieImage: string;
  postImage: string;
  caption: string;
  timestamp: Date;
  likedBy: string[];
};

const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp';
const windowWidth = Dimensions.get('window').width;

export default function Post({
  username,
  selfieImage,
  postImage,
  caption,
  timestamp,
}: PostProps) {
  const [isLiked, setIsLiked] = useState(false);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = Math.floor(diffInMinutes % 60);
      return `${hours}h ${minutes}m ago`;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: defaultAvatar }} style={styles.avatar} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
      </View>

      {/* Post Image with Selfie */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: postImage }} 
          style={styles.postImage}
          resizeMode="cover"
        />
        <Image 
          source={{ uri: selfieImage }} 
          style={styles.selfie}
          resizeMode="cover"
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike}>
          <AntDesign
            name={isLiked ? 'heart' : 'hearto'}
            size={24}
            color={isLiked ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionText}>
          <Text style={styles.username}>{username}</Text>
          <Text> </Text>
          <Text style={styles.caption}>{caption}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    fontWeight: '600',
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  imageContainer: {
    width: windowWidth,
    height: windowWidth,
    position: 'relative',
    padding: 20,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  selfie: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  actions: {
    flexDirection: 'row',
    padding: 10,
  },
  captionContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  captionText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  caption: {
    color: '#000',
  },
});
