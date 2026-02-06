import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';

interface ProductUploadPreviewProps {
    images: any[];
    onRemove: (index: number) => void;
}

export default function ProductUploadPreview({ images, onRemove }: ProductUploadPreviewProps) {
    if (images.length === 0) return null;

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {images.map((img, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: img.uri }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemove(index)}
                    >
                        <X size={16} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.md,
        height: 120,
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: SPACING.sm,
        borderRadius: 12,
        position: 'relative',
        ...SHADOWS.sm,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    removeButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.error,
        borderRadius: 12,
        padding: 4,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
});
