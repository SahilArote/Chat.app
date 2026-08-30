import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    AppInput,
    Avatar,
    AppButton,
    Switch,
    Card
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { mockUsers } from '../../src/mock/users';
import groupRepository from '../../src/repositories/GroupRepository';

export default function CreateGroupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isChannel, setIsChannel] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleSelectUser = (id: string) => {
        if (selectedUserIds.includes(id)) {
            setSelectedUserIds(selectedUserIds.filter((uid) => uid !== id));
        } else {
            setSelectedUserIds([...selectedUserIds, id]);
        }
    };

    const handleCreateGroup = async () => {
        if (!name.trim()) return;

        setLoading(true);

        const initialMembers = [
            {
                userId: 'user_sahil',
                name: 'Sahil Arote',
                username: 'sahil.arote',
                role: 'owner' as const,
                status: 'online' as const,
                joinedAt: 'Today'
            },
            ...mockUsers
                .filter((u) => selectedUserIds.includes(u.id))
                .map((u) => ({
                    userId: u.id,
                    name: u.name,
                    username: u.username,
                    avatar: u.avatar,
                    role: 'member' as const,
                    status: u.status,
                    joinedAt: 'Today'
                }))
        ];

        await groupRepository.createGroup({
            name: name.trim(),
            description: description.trim(),
            isChannel,
            onlyAdminsCanPost: isChannel,
            onlyAdminsCanEditInfo: true,
            members: initialMembers
        });

        setLoading(false);
        router.back();
    };

    return (
        <Screen scrollable>
            <Header title="New Group or Channel" />

            <View style={styles.content}>
                {/* Name & Description Inputs */}
                <AppInput
                    label="Group / Channel Name"
                    placeholder="e.g. Mobile Engineering"
                    value={name}
                    onChangeText={setName}
                    leftIcon={<Ionicons name="people-outline" size={18} color={colors.textSecondary} />}
                />

                <AppInput
                    label="Description (Optional)"
                    placeholder="What is this group about?"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={2}
                    leftIcon={<Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />}
                />

                {/* Broadcast Channel Mode Toggle */}
                <Card variant="outlined" style={styles.channelCard}>
                    <View style={styles.toggleRow}>
                        <View style={{ flex: 1, marginRight: spacing.md }}>
                            <AppText variant="body" color={colors.textPrimary} weight="600">
                                Broadcast Channel
                            </AppText>
                            <AppText variant="caption" color={colors.textSecondary}>
                                Only you and designated admins can post updates
                            </AppText>
                        </View>
                        <Switch value={isChannel} onValueChange={setIsChannel} />
                    </View>
                </Card>

                {/* Member Selection Section */}
                <View style={styles.sectionHeader}>
                    <AppText variant="label" color={colors.textSecondary}>
                        SELECT PARTICIPANTS ({selectedUserIds.length} selected)
                    </AppText>
                </View>

                <Card variant="outlined" style={{ padding: 0 }}>
                    {mockUsers
                        .filter((u) => u.id !== 'user_sahil')
                        .map((user) => {
                            const isSelected = selectedUserIds.includes(user.id);
                            return (
                                <TouchableOpacity
                                    key={user.id}
                                    style={styles.contactRow}
                                    activeOpacity={0.7}
                                    onPress={() => toggleSelectUser(user.id)}
                                >
                                    <Avatar
                                        uri={user.avatar}
                                        name={user.name}
                                        size="sm"
                                        status={user.status}
                                    />
                                    <View style={styles.contactInfo}>
                                        <AppText variant="chatName" color={colors.textPrimary}>
                                            {user.name}
                                        </AppText>
                                        <AppText variant="caption" color={colors.textMuted}>
                                            @{user.username}
                                        </AppText>
                                    </View>

                                    <Ionicons
                                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={22}
                                        color={isSelected ? colors.primary : colors.textMuted}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                </Card>

                <AppButton
                    title={isChannel ? 'Create Channel' : 'Create Group'}
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!name.trim()}
                    onPress={handleCreateGroup}
                    style={styles.createBtn}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg
    },
    channelCard: {
        marginBottom: spacing.lg
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    contactInfo: {
        marginLeft: spacing.md,
        flex: 1
    },
    createBtn: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg
    }
});
