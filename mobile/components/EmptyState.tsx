import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PackageOpen } from 'lucide-react-native';
import { COLORS, SPACING } from '../utils/theme';

interface EmptyStateProps {
    title: string;
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
    return (
        <View style={styles.container}>
            <PackageOpen size={64} color={COLORS.primaryLight} strokeWidth={1} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.md,
    },
    message: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SPACING.sm,
    }
});

export default EmptyState;
