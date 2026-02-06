import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { authAPI } from '../utils/api';
import { AuthContext } from '../utils/AuthContext';
import { COLORS } from '../constants/colors';
import LoadingSpinner from './ui/LoadingSpinner';

interface UserSelectModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (userId: string) => void;
}

export default function UserSelectModal({ visible, onClose, onSelect }: UserSelectModalProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (visible) {
            fetchUsers();
        }
    }, [visible]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await authAPI.getUsers();
            setUsers(res.data.filter((u: any) => u._id !== user?._id));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Send to...</Text>
                        <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
                    </View>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.userItem} onPress={() => onSelect(item._id)}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{item.name?.[0] || '?'}</Text>
                                    </View>
                                    <Text style={styles.userName}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    content: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '70%', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    close: { fontSize: 24, color: '#666' },
    userItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { color: 'white', fontWeight: 'bold' },
    userName: { fontSize: 16, fontWeight: '600' },
});
