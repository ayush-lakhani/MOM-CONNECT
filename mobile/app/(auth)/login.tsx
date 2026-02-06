import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { useLanguage } from '../../utils/LanguageContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('Validation', 'सत्यापन'), t('Please fill all fields', 'कृपया सभी फ़ील्ड भरें'));
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/marketplace');
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('Login Failed', 'लॉगिन विफल'), e?.response?.data?.message || t('Invalid credentials', 'अमान्य क्रेडेंशियल्स'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

        {/* Top Decorative Section */}
        <View style={styles.topSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            style={styles.gradientHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.logoContainer}>
              <Heart size={60} color={COLORS.white} fill={COLORS.white} />
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>MOM</Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Form Container */}
        <Animated.View
          entering={FadeInDown.duration(800)}
          layout={Layout.springify()}
          style={styles.formContainer}
        >
          <Text style={styles.welcomeText}>{t('Welcome Back', 'वापसी पर स्वागत है')}</Text>
          <Text style={styles.subText}>{t('Login to your MomConnect account', 'अपने मॉम कनेक्ट अकाउंट में लॉगिन करें')}</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>{t('Email Address', 'ईमेल पता')}</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={COLORS.textLight} style={styles.leftIcon} />
              <TextInput
                placeholder="email@example.com"
                placeholderTextColor={COLORS.textLight}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={[styles.inputWrapper, { marginTop: SPACING.lg }]}>
            <Text style={styles.label}>{t('Password', 'पासवर्ड')}</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={COLORS.textLight} style={styles.leftIcon} />
              <TextInput
                placeholder="********"
                placeholderTextColor={COLORS.textLight}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.rightIcon}
              >
                {showPassword ? <EyeOff size={20} color={COLORS.textLight} /> : <Eye size={20} color={COLORS.textLight} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotText}>{t('Forgot Password?', 'पासवर्ड भूल गए?')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={submitting}
            activeOpacity={0.8}
            style={styles.loginButton}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.loginBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginButtonText}>
                {submitting ? t('Wait...', 'प्रतीक्षा करें...') : t('Login Now', 'अभी लॉगिन करें')}
              </Text>
              {!submitting && <ArrowRight size={20} color={COLORS.white} />}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("Don't have an account?", "अकाउंट नहीं है?")} </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signupText}>{t('Create Now', 'अभी बनाएं')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    height: 300,
    width: width,
  },
  gradientHeader: {
    flex: 1,
    borderBottomLeftRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  logoBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  logoBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: -60,
    borderTopRightRadius: 60,
    padding: SPACING.xl,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
  },
  subText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: 30,
  },
  inputWrapper: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 56,
    ...SHADOWS.sm,
  },
  leftIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  rightIcon: {
    padding: 8,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 40,
    ...SHADOWS.md,
  },
  loginBtnGradient: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 40,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  signupText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 14,
  }
});