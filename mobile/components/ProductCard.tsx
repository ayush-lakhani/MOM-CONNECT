import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';

interface ProductCardProps {
    name: string;
    price: number;
    image: string;
    seller: string;
    onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, seller, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.price}>${price.toFixed(2)}</Text>
                <Text style={styles.seller}>by {seller}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        marginBottom: 16,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
    },
    details: {
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 4,
    },
    seller: {
        fontSize: 12,
        color: Colors.textLight,
    },
});

export default ProductCard;
