import { AuthContext } from '../../utils/AuthContext';
import { COLORS, SPACING, SHADOWS } from '../../utils/theme';
import { Edit2, Check, X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../lib/axios';
import ProductCard from '../../components/ProductCard';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useContext, useState, useEffect } from 'react';

// Local IP managed in axios.ts

export default function ProfileScreen() {
    const { user, token, logout, setUser } = useContext(AuthContext);
    const [myListings, setMyListings] = useState([]);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editBio, setEditBio] = useState(user?.bio || 'Super Mom');
    const [editImage, setEditImage] = useState(user?.profileImage);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch listings
        const fetchListings = async () => {
            try {
                // We technically need a real endpoint, assuming filters work or we just fetch all
                // For now, let's just fetch all and filter in client (not efficient but quickest)
                const res = await api.get('/products');
                const my = res.data.filter((p: any) => p.seller?._id === user?._id || p.seller?.email === user?.email);
                setMyListings(my);
            } catch (e) {
                console.error(e);
            }
        };
        if (user) fetchListings();

        // Sync local state when user updates
        setEditName(user?.name || '');
        setEditBio(user?.bio || 'Super Mom');
        setEditImage(user?.profileImage);

    }, [user]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            // @ts-ignore
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setEditImage(result.assets[0].uri);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const body = {
                name: editName,
                bio: editBio,
                profileImage: editImage // sending URI or base64 if implemented
            };

            const list = await api.put('/auth/profile', body);

            // Update local user context
            setUser(list.data.user);
            setIsEditing(false);
            Alert.alert('Success', 'Profile Updated!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: isEditing ? (editImage || 'https://i.pravatar.cc/150') : (user?.profileImage || 'https://i.pravatar.cc/150') }}
                        style={styles.avatar}
                    />
                    {isEditing && (
                        <TouchableOpacity style={styles.camBtn} onPress={pickImage}>
                            <Camera size={16} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                {isEditing ? (
                    <View style={styles.editForm}>
                        <TextInput
                            style={styles.nameInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Your Name"
                        />
                        <TextInput
                            style={styles.bioInput}
                            value={editBio}
                            onChangeText={setEditBio}
                            placeholder="Bio (e.g. Super Mom)"
                        />
                        <View style={styles.editActions}>
                            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
                                <X size={20} color="#666" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveProfile} style={styles.saveBtn} disabled={saving}>
                                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Check size={20} color="#fff" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={styles.infoRow}>
                            <Text style={styles.name}>{user?.name || 'MomConnect User'}</Text>
                            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
                                <Edit2 size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.bio}>{user?.bio || 'Super Mom • Bengaluru'}</Text>
                    </>
                )}

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statNum}>{myListings.length}</Text>
                        <Text style={styles.statLabel}>Listings</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNum}>{user?.totalViews || 0}k</Text>
                        <Text style={styles.statLabel}>Views</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNum}>{user?.followers || 0}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Listings</Text>
            </View>

            <FlatList
                data={myListings}
                renderItem={({ item }) => <ProductCard {...item} onPress={() => { }} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text>No active listings</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 50 }}
            />

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { alignItems: 'center', padding: 20, backgroundColor: '#FFF0F5' },
    avatarContainer: { position: 'relative', marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
    camBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, padding: 6, borderRadius: 20 },

    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    name: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    editBtn: { padding: 4 },
    bio: { color: '#666', marginBottom: 20 },

    // Edit Styles
    editForm: { alignItems: 'center', width: '100%', marginBottom: 10 },
    nameInput: { fontSize: 20, fontWeight: 'bold', borderBottomWidth: 1, borderColor: '#ccc', textAlign: 'center', minWidth: 200, marginBottom: 8 },
    bioInput: { fontSize: 14, color: '#666', borderBottomWidth: 1, borderColor: '#ccc', textAlign: 'center', minWidth: 200, marginBottom: 12 },
    editActions: { flexDirection: 'row', gap: 20 },
    saveBtn: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 20 },
    cancelBtn: { backgroundColor: '#eee', padding: 10, borderRadius: 20 },

    statsRow: { flexDirection: 'row', gap: 40, marginTop: 10 },
    stat: { alignItems: 'center' },
    statNum: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    statLabel: { fontSize: 12, color: '#666' },

    sectionHeader: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    empty: { padding: 20, alignItems: 'center' },
    logoutBtn: { margin: 20, padding: 15, backgroundColor: '#f8f8f8', borderRadius: 10, alignItems: 'center' },
    logoutText: { fontWeight: 'bold', color: '#666' }
});
