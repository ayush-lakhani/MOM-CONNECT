import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { Search, Plus } from 'lucide-react-native';
import FeedCard from '../../components/FeedCard';
import { usePosts } from '../../hooks/usePosts';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const { posts, loading } = usePosts();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>MomConnect</Text>
        <Text style={styles.headerSubtitle}>Community</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <FeedCard
            user={item.user}
            content={item.content}
            image={item.image}
            likes={item.likes}
            comments={item.comments}
            time={item.time}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/create-post')}
      >
        <Plus size={32} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  listContent: {
    padding: SPACING.md,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
    elevation: 8,
    zIndex: 100,
  },
});