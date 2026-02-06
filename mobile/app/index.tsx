import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#F1C043" />
            </View>
        );
    }

    return <Redirect href={user ? "/(tabs)/marketplace" : "/(auth)/login"} />;
}
