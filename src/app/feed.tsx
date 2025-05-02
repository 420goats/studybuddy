import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Post from '../components/Post';
import BottomNav from '../components/BottomNav';

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setPosts(loadedPosts);
      setLoading(false);
    }, (error) => {
      console.error('Error loading posts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" testID="activity-indicator" />
        </View>
        <BottomNav currentRoute="/" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text>No posts yet.</Text>
        </View>
        <BottomNav currentRoute="/" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Post
            id={item.id}
            username={item.username}
            selfieImage={item.selfieImage}
            postImage={item.postImage}
            caption={item.caption}
            timestamp={item.timestamp}
            likedBy={item.likedBy}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <BottomNav currentRoute="/" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBDB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
