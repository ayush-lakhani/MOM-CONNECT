import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, DollarSign, Tag, FileText, Camera } from 'lucide-react-native';
import ProductUploadPreview from '../components/ProductUploadPreview';
import { useProductUpload } from '../hooks/useProductUpload';
import { AuthContext } from '../utils/AuthContext';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';

const CATEGORIES = ['Baby Gear', 'Clothes 0-6m', 'Clothes 6m+', 'Toys 0-12m', 'Toys 1-3y', 'Books', 'Health', 'Pregnancy'];

export default function SellProductScreen() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const { createListing, uploading, progress } = useProductUpload();

    const [images, setImages] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);

    const pickImages = async () => {
        if (images.length >= 5) {
            Alert.alert('Limit Reached', 'You can upload up to 5 images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5 - images.length,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets]);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async () => {
        if (!title || !price || !description || images.length === 0) {
            Alert.alert('Missing Fields', 'Please fill all fields and add at least one image.');
            return;
        }

        if (parseInt(price) < 50) {
            Alert.alert('Price too low', 'Minimum price must be ₹50.');
            return;
        }

        const success = await createListing(
            { name: title, price: parseInt(price), description, category },
            images,
            user
        );

        if (success) {
            Alert.alert('Success', 'Your product is now live! 🚀');
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{
                title: 'Sell Item',
                headerStyle: { backgroundColor: COLORS.background },
                headerTintColor: COLORS.text,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                        <Text style={{ color: COLORS.primary, fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>
                )
            }} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Image Picker */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Product Photos ({images.length}/5)</Text>
                        <ProductUploadPreview images={images} onRemove={handleRemoveImage} />

                        {images.length < 5 && (
                            <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
                                <Camera size={24} color={COLORS.primary} />
                                <Text style={styles.uploadText}>Add Photos</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Form Fields */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Title</Text>
                        <View style={styles.inputContainer}>
                            <Tag size={20} color={COLORS.textLight} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex. Graco Stroller, Good Condition"
                                value={title}
                                onChangeText={setTitle}
                                maxLength={50}
                            />
                        </View>

                        <Text style={styles.label}>Price (₹)</Text>
                        <View style={styles.inputContainer}>
                            <DollarSign size={20} color={COLORS.textLight} />
                            <TextInput
                                style={styles.input}
                                placeholder="499"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                            />
                        </View>

                        <Text style={styles.label}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.label}>Description</Text>
                        <View style={[styles.inputContainer, styles.textArea]}>
                            <FileText size={20} color={COLORS.textLight} style={{ marginTop: 10 }} />
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                placeholder="Describe your item..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </View>

                    {/* Fee Info */}
                    <View style={styles.feeInfo}>
                        <Text style={styles.feeText}>Listing Fee: ₹49</Text>
                        <Text style={styles.feeSubtext}>Securely paid via Razorpay</Text>
                    </View>

                </ScrollView>

                {/* Submit Button */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleSubmit} disabled={uploading} activeOpacity={0.8}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            style={styles.submitButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {uploading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <ActivityIndicator color={COLORS.white} />
                                    <Text style={styles.submitText}>Uploading... {Math.round(progress * 100)}%</Text>
                                </View>
                            ) : (
                                <Text style={styles.submitText}>List It Now (Pay ₹49)</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.md,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    uploadButton: {
        height: 120,
        borderWidth: 2,
        borderColor: COLORS.primaryLight,
        borderStyle: 'dashed',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        gap: 8,
    },
    uploadText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        height: 50,
        gap: 10,
        ...SHADOWS.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    textArea: {
        height: 120,
        alignItems: 'flex-start',
    },
    categoryScroll: {
        flexDirection: 'row',
        marginVertical: SPACING.xs,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    categoryChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryText: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    categoryTextActive: {
        color: COLORS.white,
        fontWeight: '700',
    },
    feeInfo: {
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    feeText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    feeSubtext: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    footer: {
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    submitButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.md,
    },
    submitText: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.white,
    },
});
