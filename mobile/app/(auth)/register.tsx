import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import Button from '../../components/ui/Button';

export default function Register() {
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      await register({ name, email, phone, password });
      Alert.alert('Success', 'Account created successfully', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/dashboard') }
      ]);
    } catch (e: any) {
      Alert.alert('Registration failed', e?.response?.data?.message || e?.message || 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerSection}>
        <Text style={styles.headerEmoji}>📝</Text>
        <Text style={styles.title}>{STRINGS.create_account}</Text>
        <Text style={styles.subtitle}>Join the MomConnect community</Text>
      </View>

      <View style={styles.formSection}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={!submitting}
        />
        <TextInput
          placeholder={STRINGS.email}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!submitting}
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!submitting}
        />
        <TextInput
          placeholder={STRINGS.password}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!submitting}
        />
        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!submitting}
        />

        <Button
          title={submitting ? STRINGS.please_wait : "Create Account"}
          onPress={submit}
          disabled={submitting}
          style={{ marginTop: 12 }}
        />

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={styles.link}>Already have an account? <Text style={{ fontWeight: '800' }}>{STRINGS.login}</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  headerSection: { flex: 0.8, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  headerEmoji: { fontSize: 60, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.primaryDark, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textGray, textAlign: 'center', marginTop: 6 },
  formSection: { flex: 2, padding: 20, backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 5 },
  input: { borderWidth: 1, borderColor: COLORS.borderGray, padding: 14, borderRadius: 10, marginBottom: 12, backgroundColor: '#fafafa', fontSize: 16 },
  link: { color: COLORS.textGray, textAlign: 'center', fontSize: 14 },
});