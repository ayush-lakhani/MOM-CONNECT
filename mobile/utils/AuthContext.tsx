import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER } from '../hooks/useUser';

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('authToken');
        const u = await AsyncStorage.getItem('user');
        if (t && u) {
          setToken(t);
          setUser(JSON.parse(u));
        }
      } catch (e) {
        console.warn('Auth bootstrap error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    // 1. Check if this user exists in our "mock database" (AsyncStorage)
    const storedUsersJson = await AsyncStorage.getItem('registered_users');
    const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : {};

    let userToLogin = storedUsers[email];

    // 2. Fallback: If no custom user found, use the default MOCK_USER (Priya)
    // ONLY if the email matches the default or is empty (for quick demo login)
    if (!userToLogin) {
      if (email === 'priya@example.com' || email === '') {
        userToLogin = MOCK_USER;
      } else {
        // Dynamic fallback: Create a temporary user for this email so they don't get stuck
        // This solves "I entered my email but got Priya"
        userToLogin = {
          _id: 'temp_user_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          city: 'Guest City',
          avatar: 'https://i.pravatar.cc/150?u=' + email,
          listings: [],
          stats: { sold: 0, active: 0, earnings: 0 },
          rating: 0
        };
      }
    }

    const fakeToken = 'mock_jwt_token_' + Date.now();
    await AsyncStorage.setItem('authToken', fakeToken);
    await AsyncStorage.setItem('user', JSON.stringify(userToLogin));

    setToken(fakeToken);
    setUser(userToLogin);
    return userToLogin;
  };

  const register = async (payload: any) => {
    const fakeToken = 'mock_jwt_token_' + Date.now();

    const newUser = {
      _id: 'new_user_' + Date.now(),
      name: payload.name,
      email: payload.email,
      city: 'Mumbai',
      avatar: 'https://i.pravatar.cc/150?u=' + payload.email,
      listings: [],
      stats: { sold: 0, active: 0, earnings: 0 },
      rating: 5.0
    };

    // Save to "Mock DB"
    const storedUsersJson = await AsyncStorage.getItem('registered_users');
    const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : {};
    storedUsers[payload.email] = newUser;
    await AsyncStorage.setItem('registered_users', JSON.stringify(storedUsers));

    // Log them in
    await AsyncStorage.setItem('authToken', fakeToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setToken(fakeToken);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};