import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { COLORS } from '../../constants/colors';

export default function Home() {
  const [mood, setMood] = useState<string | null>(null);
  const moods = [
    { name: 'Happy', emoji: '😊' },
    { name: 'Tired', emoji: '😴' },
    { name: 'Stressed', emoji: '😰' },
    { name: 'Calm', emoji: '😌' },
    { name: 'Energetic', emoji: '⚡' },
  ];
  const suggestions: Record<string, string> = {
    Happy: '🎉 Keep shining! Share your joy with the community!',
    Tired: '😴 Try a 5-min guided rest — breathe slowly.',
    Stressed: '🧘 Do 3 slow deep breaths: in-4, hold-4, out-6.',
    Calm: '🌿 Perfect time for a short creative activity.',
    Energetic: '💪 Use energy for a quick productive task!',
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />

      <View style={styles.greeting}>
        <Text style={styles.greetingEmoji}>👋</Text>
        <Text style={styles.greetingText}>Welcome back, Mom!</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>How are you feeling today?</Text>
        <View style={styles.moods}>
          {moods.map((m) => (
            <TouchableOpacity
              key={m.name}
              style={[styles.moodBtn, mood === m.name && styles.moodActive]}
              onPress={() => setMood(m.name)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={styles.moodName}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {mood && <View style={styles.suggestion}><Text style={styles.suggestionText}>{suggestions[mood]}</Text></View>}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>📚 Featured Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>🧹</Text>
          <View>
            <Text style={styles.tipTitle}>Quick Cleaning Hack</Text>
            <Text style={styles.tipDesc}>Baking soda + lemon = sparkling surfaces</Text>
          </View>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>👶</Text>
          <View>
            <Text style={styles.tipTitle}>Baby Sleep Routine</Text>
            <Text style={styles.tipDesc}>Consistent bedtime improves sleep quality</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>💡 Wellness Corner</Text>
        <Badge label="Self-Care" variant="primary" />
        <Badge label="Mental Health" variant="success" />
        <Badge label="Time Management" variant="warning" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light, padding: 12 },
  greeting: { alignItems: 'center', marginBottom: 20, marginTop: 12 },
  greetingEmoji: { fontSize: 48, marginBottom: 8 },
  greetingText: { fontSize: 24, fontWeight: '800', color: COLORS.primaryDark },
  card: { marginBottom: 16 },
  cardTitle: { fontWeight: '800', fontSize: 16, color: COLORS.textDark, marginBottom: 12 },
  moods: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  moodBtn: { alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: COLORS.lightGray },
  moodActive: { backgroundColor: '#ffe6f0', borderWidth: 2, borderColor: COLORS.primary },
  moodEmoji: { fontSize: 24, marginBottom: 4 },
  moodName: { fontSize: 12, fontWeight: '600', color: COLORS.textDark },
  suggestion: { backgroundColor: '#FFF0F6', padding: 12, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  suggestionText: { color: COLORS.textDark, fontSize: 14, lineHeight: 20 },
  tipItem: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-start' },
  tipIcon: { fontSize: 28, marginRight: 12 },
  tipTitle: { fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  tipDesc: { fontSize: 12, color: COLORS.textGray },
});