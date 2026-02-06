import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';
import * as Haptics from 'expo-haptics';

interface FeedCardProps {
    user: {
        name: string;
        avatar: string;
        location: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
    index: number;
}

const FeedCard: React.FC<FeedCardProps> = ({ user, content, image, likes, comments, time, index }) => {
    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(500)}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: user.avatar || 'https://i.pravatar.cc/100' }} style={styles.avatar} />
                    <View>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userMeta}>{user.location} • {time}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MoreHorizontal size={20} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <Text style={styles.content}>{content}</Text>

            {image && (
                <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />
            )}

            {/* Actions */}
            <View style={styles.footer}>
                <View style={styles.actionsLeft}>
                    <TouchableOpacity onPress={handleLike} style={styles.actionItem}>
                        <Heart size={22} color={COLORS.primary} strokeWidth={2} />
                        <Text style={styles.actionText}>{likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <MessageCircle size={22} color={COLORS.secondary} strokeWidth={2} />
                        <Text style={styles.actionText}>{comments}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Share2 size={22} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryLight,
    },
    userName: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
    },
    userMeta: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    content: {
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 20,
        marginBottom: SPACING.sm,
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 16,
        marginBottom: SPACING.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.xs,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    actionsLeft: {
        flexDirection: 'row',
        gap: SPACING.lg,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textLight,
    },
});

export default FeedCard;
