import React, { useEffect, useContext } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, AuthContext } from '../utils/AuthContext';
import { useRouter } from 'expo-router';

import SplashScreen from '../components/SplashScreen';
import { useState } from 'react';

function LayoutInner() {
  const { loading, user } = useContext(AuthContext);
  const router = useRouter();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    if (isSplashVisible || loading) return;

    if (!user) {
      router.replace('/(auth)/login');
    } else {
      router.replace('/(tabs)/home'); // Changed to home as per standard flow
    }
  }, [isSplashVisible, loading, user, router]);

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutInner />
    </AuthProvider>
  );
}