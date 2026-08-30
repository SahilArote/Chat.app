import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../BottomSheet';
import SearchBar from '../SearchBar';
import Avatar from '../Avatar';
import AppText from '../AppText';
import AppButton from '../AppButton';
import { colors, radius, spacing } from '../../theme';
import { mockUsers, MockUserProfile } from '../../mock/users';
import { MockGroupMember } from '../../mock/groups';

export interface AddMembersModalProps {
    visible: boolean;
    existingMemberUserIds: string[];
    onClose: () => void;
    onAddMembers: (newMembers: MockGroupMember[]) => void;
}

export const AddMembersModal: React.FC<AddMembersModalProps> = ({
    visible,
    existingMemberUserIds,
    onClose,
    onAddMembers
}) => {
    const [search, setSearch] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const availableUsers = mockUsers.filter(
        (u) =>
            !existingMemberUserIds.includes(u.id) &&
            (u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.username.toLowerCase().includes(search.toLowerCase()))
    );

    const toggleSelect = (userId: string) => {
        if (selectedUserIds.includes(userId)) {
            setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
        } else {
            setSelectedUserIds([...selectedUserIds, userId]);
        }
    };

    const handleConfirm = () => {
        const added: MockGroupMember[] = mockUsers
            .filter((u) => selectedUserIds.includes(u.id))
            .map((u) => ({
                userId: u.id,
                name: u.name,
                username: u.username,
                avatar: u.avatar,
                role: 'member',
                status: u.status,
                joinedAt: 'Today'
            }));

        onAddMembers(added);
        setSelectedUserIds([]);
        onClose();
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} title="Add Members">
            <View style={styles.container}>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search contacts..."
                    style={{ marginBottom: spacing.md }}
                />

                <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
                    {availableUsers.length === 0 ? (
                        <AppText
                            variant="bodySmall"
                            color={colors.textMuted}
                            align="center"
                            style={{ marginVertical: spacing.lg }}
                        >
                            No additional contacts available to add.
                        </AppText>
                    ) : (
                        availableUsers.map((user) => {
                            const isSelected = selectedUserIds.includes(user.id);
                            return (
                                <TouchableOpacity
                                    key={user.id}
                                    style={styles.userRow}
                                    activeOpacity={0.7}
                                    onPress={() => toggleSelect(user.id)}
                                >
                                    <Avatar
                                        uri={user.avatar}
                                        name={user.name}
                                        size="sm"
                                        status={user.status}
                                    />
                                    <View style={styles.userInfo}>
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
                        })
                    )}
                </ScrollView>

                <AppButton
                    title={`Add Selected (${selectedUserIds.length})`}
                    size="md"
                    fullWidth
                    disabled={selectedUserIds.length === 0}
                    onPress={handleConfirm}
                    style={{ marginTop: spacing.md }}
                />
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 400
    },
    userList: {
        maxHeight: 240
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    userInfo: {
        flex: 1,
        marginLeft: spacing.md
    }
});

export default AddMembersModal;
