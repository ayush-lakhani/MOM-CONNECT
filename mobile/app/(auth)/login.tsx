import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import Button from '../../components/ui/Button';

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }
    try {
      setSubmitting(true);
      await login(email, password);
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message || e?.message || 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerSection}>
        <Text style={styles.headerEmoji}>👩‍👧‍👦</Text>
        <Text style={styles.title}>{STRINGS.welcome}</Text>
        <Text style={styles.subtitle}>to {STRINGS.app_name}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder={STRINGS.email}
          placeholderTextColor={COLORS.textLight}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!submitting}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder={STRINGS.password}
            placeholderTextColor={COLORS.textLight}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!submitting}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Text style={{ fontSize: 18 }}>{showPassword ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>

        <Button title={submitting ? STRINGS.please_wait : STRINGS.login} onPress={submit} disabled={submitting} style={{ marginTop: 24 }} />

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={{ marginTop: 20 }}>
          <Text style={styles.link}>Don't have an account? <Text style={{ fontWeight: '800', color: COLORS.primary }}>{STRINGS.create_account}</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  headerSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerEmoji: { fontSize: 80, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.primaryDark, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textGray, textAlign: 'center', marginTop: 6 },
  formSection: { padding: 24, backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 1, borderColor: COLORS.borderGray, padding: 16, borderRadius: 12, marginBottom: 16, backgroundColor: '#fafafa', fontSize: 16, color: COLORS.textDark },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderGray, borderRadius: 12, backgroundColor: '#fafafa', marginBottom: 16 },
  passwordInput: { flex: 1, padding: 16, fontSize: 16, color: COLORS.textDark },
  eyeIcon: { padding: 16 },
  link: { color: COLORS.textGray, textAlign: 'center', fontSize: 14 },
});