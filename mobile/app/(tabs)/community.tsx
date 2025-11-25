import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { communityAPI } from '../../utils/api';
import { AuthContext } from '../../utils/AuthContext';
import PostCard from '../../components/PostCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../constants/colors';

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Recipes', 'Tips', 'Questions', 'Events'];
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await communityAPI.getPosts();
      setPosts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const create = async () => {
    if (!newPost.trim()) return Alert.alert('Write something');
    try {
      await communityAPI.createPost({ text: newPost, category }); // Assuming backend handles category
      setNewPost('');
      fetchPosts();
    } catch (e) {
      Alert.alert('Error', 'Could not create post');
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.categories}>
        <FlatList
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catChip, category === item && styles.catChipActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.catText, category === item && styles.catTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      <View style={styles.newPostCard}>
        <TextInput
          placeholder={`Share your ${category === 'All' ? 'story' : category.toLowerCase()}...`}
          style={styles.input}
          value={newPost}
          onChangeText={setNewPost}
          multiline
          numberOfLines={3}
        />
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.micBtn}><Text style={styles.micText}>🎤</Text></TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.shareBtn} onPress={create}>
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity onPress={fetchPosts}><Text style={{ fontSize: 20 }}>🔄</Text></TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <PostCard
            user={item.user || { name: 'Mom', _id: 'unknown' }} // Fallback
            content={item.content || item.text} // Handle both fields
            image={item.image}
            likes={item.likes?.length || 0}
            comments={item.comments?.length || 0}
            onLike={() => communityAPI.likePost(item._id)}
            onComment={() => { }}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primaryDark },
  categories: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  catChipActive: { backgroundColor: COLORS.primary },
  catText: { fontWeight: '600', color: COLORS.textGray },
  catTextActive: { color: COLORS.white },
  newPostCard: { margin: 12, padding: 12, backgroundColor: '#fafafa', borderRadius: 12, borderWidth: 1, borderColor: COLORS.borderGray },
  input: { minHeight: 60, textAlignVertical: 'top', fontSize: 16 },
  postActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  micBtn: { padding: 8 },
  micText: { fontSize: 20 },
  shareBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  shareBtnText: { color: COLORS.white, fontWeight: '700' },
  listContent: { paddingBottom: 80 },
});