import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { X, Image as ImageIcon } from 'lucide-react-native';
import api from '../lib/axios';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';
import { AuthContext } from '../utils/AuthContext';

// Use same IP

export default function CreatePostScreen() {
    const router = useRouter();
    const { token, user } = useContext(AuthContext);

    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        // Attempting to resolve the MediaType deprecation by using the legacy Option if types fail, 
        // or string if supported. The warning said 'Use ImagePicker.MediaType'. 
        // If TS complains, we might need a cast.
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Stick to Options for now to satisfy TS, ignore warning if needed or try cast
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!content.trim() && !image) {
            Alert.alert('Empty Post', 'Please write something or add an image.');
            return;
        }

        try {
            setLoading(true);

            // In real app, upload image to S3 first. 
            // Here sending URI (will only work on local device) or base64 if we implemented it.
            // For demo speed, we send user info inside body if backend verifies token but doesn't auto-populate?
            // Backend createPost uses req.user.id.

            const postData = {
                content,
                image: image, // Sending URI
                category: 'General'
            };

            await api.post('/community/posts', postData);

            router.back();

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not share post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <X size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.postBtn, (!content && !image) && styles.disabledBtn]}
                    onPress={handlePost}
                    disabled={loading || (!content && !image)}
                >
                    {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.postBtnText}>Post</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.userRow}>
                    <Image source={{ uri: user?.profileImage || 'https://i.pravatar.cc/100' }} style={styles.avatar} />
                    <View>
                        <Text style={styles.userName}>{user?.name || 'Mom'}</Text>
                        <Text style={styles.privacy}>Public</Text>
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="What's on your mind, Mom?"
                    placeholderTextColor={COLORS.textLight}
                    multiline
                    value={content}
                    onChangeText={setContent}
                    autoFocus
                />

                {image && (
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: image }} style={styles.previewParams} />
                        <TouchableOpacity style={styles.removeImg} onPress={() => setImage(null)}>
                            <X size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.toolBtn} onPress={pickImage}>
                    <ImageIcon size={24} color={COLORS.primary} />
                    <Text style={styles.toolText}>Photo</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    postBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    disabledBtn: {
        backgroundColor: '#ccc',
    },
    postBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: COLORS.text,
    },
    privacy: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    input: {
        fontSize: 18,
        color: COLORS.text,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    imagePreview: {
        marginTop: 10,
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
    },
    previewParams: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    removeImg: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 4,
        borderRadius: 12,
    },
    toolbar: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        padding: 16,
    },
    toolBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    toolText: {
        color: COLORS.primary,
        fontWeight: '600',
    }
});
