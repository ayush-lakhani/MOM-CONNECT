import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface PostCardProps {
    user: {
        name: string;
        profileImage: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    onLike: () => void;
    onComment: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ user, content, image, likes, comments, onLike, onComment }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image source={{ uri: user.profileImage || 'https://via.placeholder.com/50' }} style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{user.name}</Text>
                    <Text style={styles.timeAgo}>2 hours ago</Text>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textGray} />
                </TouchableOpacity>
            </View>

            {image && <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />}

            <View style={styles.contentContainer}>
                <View style={styles.actions}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity onPress={onLike} style={styles.actionIcon}>
                            <Ionicons name="heart-outline" size={28} color={Colors.textDark} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onComment} style={styles.actionIcon}>
                            <Ionicons name="chatbubble-outline" size={26} color={Colors.textDark} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon}>
                            <Ionicons name="paper-plane-outline" size={26} color={Colors.textDark} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="bookmark-outline" size={26} color={Colors.textDark} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.likes}>{likes} likes</Text>

                <Text style={styles.caption}>
                    <Text style={styles.captionUser}>{user.name}</Text> {content}
                </Text>

                <TouchableOpacity onPress={onComment}>
                    <Text style={styles.viewComments}>View all {comments} comments</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderGray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.borderGray,
    },
    username: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textDark,
    },
    timeAgo: {
        fontSize: 11,
        color: Colors.textGray,
    },
    moreBtn: {
        marginLeft: 'auto',
    },
    postImage: {
        width: '100%',
        height: 400,
    },
    contentContainer: {
        padding: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        marginRight: 16,
    },
    likes: {
        fontWeight: '700',
        fontSize: 14,
        color: Colors.textDark,
        marginBottom: 6,
    },
    caption: {
        fontSize: 14,
        color: Colors.textDark,
        lineHeight: 20,
        marginBottom: 6,
    },
    captionUser: {
        fontWeight: '700',
    },
    viewComments: {
        fontSize: 13,
        color: Colors.textGray,
        marginTop: 2,
    },
});

export default PostCard;
