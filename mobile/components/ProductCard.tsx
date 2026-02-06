import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { COLORS, SHADOWS, SPACING } from '../utils/theme';

interface ProductCardProps {
    name: string;
    price: number;
    image: string;
    seller: string;
    onPress: () => void;
    onBuy?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, seller, onPress, onBuy }) => {
    const heartScale = useSharedValue(1);

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }]
    }));

    const handleHeartPress = () => {
        heartScale.value = withSpring(1.5, {}, () => {
            heartScale.value = withSpring(1);
        });
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={[styles.card, SHADOWS.xl]}
        >
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.heartBtn}
                        onPress={handleHeartPress}
                    >
                        <Animated.View style={heartStyle}>
                            <Heart size={20} color={COLORS.primary} fill={COLORS.primaryLight} />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.category}>BABY CARE</Text>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>

                    <View style={styles.footer}>
                        <Text style={styles.price}>₹{price}</Text>
                        <TouchableOpacity style={styles.buyBtn} onPress={onBuy}>
                            <Text style={styles.buyText}>Buy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        width: '48%',
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        height: 170,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heartBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 20,
        ...SHADOWS.sm,
    },
    content: {
        padding: 12,
    },
    category: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 20,
        marginBottom: 8,
        height: 40, // Fixed height for 2 lines
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    buyBtn: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    buyText: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '600',
    }
});

export default ProductCard;
