import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Avatar,
    Card,
    AppButton,
    Switch,
    MemberItem,
    AddMembersModal,
    EditGroupModal,
    GroupPermissionsModal
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { MockGroup, MockGroupMember } from '../../src/mock/groups';
import groupRepository from '../../src/repositories/GroupRepository';

export default function GroupInfoScreen() {
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
    const router = useRouter();

    const [group, setGroup] = useState<MockGroup | null>(null);
    const [muteNotifications, setMuteNotifications] = useState(false);
    const [memberSearch, setMemberSearch] = useState('');

    // Modals state
    const [addMembersVisible, setAddMembersVisible] = useState(false);
    const [editInfoVisible, setEditInfoVisible] = useState(false);
    const [permissionsVisible, setPermissionsVisible] = useState(false);

    const loadGroup = useCallback(async () => {
        if (!conversationId) return;
        const data = await groupRepository.getGroupById(conversationId);
        if (data) setGroup(data);
    }, [conversationId]);

    useEffect(() => {
        loadGroup();
    }, [loadGroup]);

    const handleAddMembers = async (newMembers: MockGroupMember[]) => {
        if (!conversationId) return;
        const updated = await groupRepository.addMembers(conversationId, newMembers);
        setGroup(updated);
    };

    const handleRemoveMember = async (member: MockGroupMember) => {
        if (!conversationId) return;
        const updated = await groupRepository.removeMember(conversationId, member.userId);
        setGroup(updated);
    };

    const handlePromote = async (member: MockGroupMember) => {
        if (!conversationId) return;
        const updated = await groupRepository.updateMemberRole(conversationId, member.userId, 'admin');
        setGroup(updated);
    };

    const handleDemote = async (member: MockGroupMember) => {
        if (!conversationId) return;
        const updated = await groupRepository.updateMemberRole(conversationId, member.userId, 'member');
        setGroup(updated);
    };

    const handleSaveInfo = async (name: string, description: string) => {
        if (!conversationId) return;
        const updated = await groupRepository.updateGroupInfo(conversationId, name, description);
        setGroup(updated);
    };

    const handleSavePermissions = async (onlyAdminsCanPost: boolean, onlyAdminsCanEditInfo: boolean) => {
        if (!conversationId) return;
        const updated = await groupRepository.updatePermissions(conversationId, onlyAdminsCanPost, onlyAdminsCanEditInfo);
        setGroup(updated);
    };

    const handleLeave = async () => {
        if (!conversationId) return;
        await groupRepository.leaveGroup(conversationId, 'user_sahil');
        router.replace('/(app)');
    };

    const handleDelete = async () => {
        if (!conversationId) return;
        await groupRepository.deleteGroup(conversationId);
        router.replace('/(app)');
    };

    if (!group) {
        return (
            <Screen>
                <Header title="Group Info" />
                <View style={styles.loadingContainer}>
                    <AppText variant="body" color={colors.textSecondary}>
                        Loading group details...
                    </AppText>
                </View>
            </Screen>
        );
    }

    const filteredMembers = group.members.filter(
        (m) =>
            m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
            m.username.toLowerCase().includes(memberSearch.toLowerCase())
    );

    return (
        <Screen scrollable>
            <Header
                title="Group Info"
                rightAction={
                    <TouchableOpacity
                        onPress={() => setEditInfoVisible(true)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <AppText variant="button" color={colors.primary}>
                            Edit
                        </AppText>
                    </TouchableOpacity>
                }
            />

            <View style={styles.content}>
                {/* ─── 1. HERO HEADER ───────────────────────────────────── */}
                <View style={styles.hero}>
                    <Avatar
                        uri={group.avatar}
                        name={group.name}
                        size="xl"
                    />
                    <AppText variant="screenTitle" color={colors.textPrimary} align="center" style={styles.groupName}>
                        {group.name}
                    </AppText>
                    <AppText variant="bodySmall" color={colors.textSecondary} align="center">
                        {group.isChannel ? 'Broadcast Channel' : 'Group'} • {group.members.length} Members
                    </AppText>
                    {group.description ? (
                        <AppText variant="bodySmall" color={colors.textMuted} align="center" style={styles.description}>
                            {group.description}
                        </AppText>
                    ) : null}
                </View>

                {/* ─── 2. CHANNEL BANNER ────────────────────────────────── */}
                {group.onlyAdminsCanPost && (
                    <Card variant="outlined" style={styles.channelBanner}>
                        <View style={styles.channelRow}>
                            <Ionicons name="megaphone-outline" size={20} color={colors.primary} />
                            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                <AppText variant="caption" color={colors.primary} weight="700">
                                    ANNOUNCEMENT MODE ACTIVE
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Only group admins can send messages to this conversation.
                                </AppText>
                            </View>
                        </View>
                    </Card>
                )}

                {/* ─── 3. QUICK ACTION BUTTONS ──────────────────────────── */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.gridBtn} activeOpacity={0.7}>
                        <Ionicons name="call-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Audio
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.gridBtn} activeOpacity={0.7}>
                        <Ionicons name="videocam-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Video
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.gridBtn}
                        activeOpacity={0.7}
                        onPress={() => setAddMembersVisible(true)}
                    >
                        <Ionicons name="person-add-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Add
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* ─── 4. SETTINGS & PERMISSIONS ────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        SETTINGS
                    </AppText>

                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={styles.settingText}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Mute Notifications
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Silence message tones & alerts
                                </AppText>
                            </View>
                            <Switch value={muteNotifications} onValueChange={setMuteNotifications} />
                        </View>

                        <TouchableOpacity
                            style={styles.settingNavRow}
                            activeOpacity={0.7}
                            onPress={() => setPermissionsVisible(true)}
                        >
                            <View style={styles.settingText}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Group Permissions
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Admins posting, editing group info
                                </AppText>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* ─── 5. MEMBERS LIST ──────────────────────────────────── */}
                <View style={styles.section}>
                    <View style={styles.memberHeaderRow}>
                        <AppText variant="label" color={colors.textSecondary}>
                            MEMBERS ({group.members.length})
                        </AppText>
                        <TouchableOpacity onPress={() => setAddMembersVisible(true)}>
                            <AppText variant="caption" color={colors.primary} weight="700">
                                + Add Member
                            </AppText>
                        </TouchableOpacity>
                    </View>

                    <Card variant="outlined" style={{ padding: 0 }}>
                        {filteredMembers.map((member) => (
                            <MemberItem
                                key={member.userId}
                                member={member}
                                isCurrentUserAdmin={true}
                                onPromote={handlePromote}
                                onDemote={handleDemote}
                                onRemove={handleRemoveMember}
                                onPress={(m) => router.push(`/user/${m.userId}`)}
                            />
                        ))}
                    </Card>
                </View>

                {/* ─── 6. DANGER ACTIONS ────────────────────────────────── */}
                <View style={styles.dangerSection}>
                    <AppButton
                        title="Leave Group"
                        variant="secondary"
                        size="md"
                        fullWidth
                        onPress={handleLeave}
                        style={{ marginBottom: spacing.sm }}
                    />
                    <AppButton
                        title="Delete Group"
                        variant="danger"
                        size="md"
                        fullWidth
                        onPress={handleDelete}
                    />
                </View>
            </View>

            {/* Modals */}
            <AddMembersModal
                visible={addMembersVisible}
                existingMemberUserIds={group.members.map((m) => m.userId)}
                onClose={() => setAddMembersVisible(false)}
                onAddMembers={handleAddMembers}
            />

            <EditGroupModal
                visible={editInfoVisible}
                initialName={group.name}
                initialDescription={group.description}
                onClose={() => setEditInfoVisible(false)}
                onSave={handleSaveInfo}
            />

            <GroupPermissionsModal
                visible={permissionsVisible}
                initialOnlyAdminsCanPost={group.onlyAdminsCanPost}
                initialOnlyAdminsCanEditInfo={group.onlyAdminsCanEditInfo}
                onClose={() => setPermissionsVisible(false)}
                onSave={handleSavePermissions}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing['4xl']
    },
    hero: {
        alignItems: 'center',
        marginVertical: spacing.lg
    },
    groupName: {
        marginTop: spacing.md,
        marginBottom: 2
    },
    description: {
        marginTop: spacing.xs,
        maxWidth: 300,
        lineHeight: 18
    },
    channelBanner: {
        marginBottom: spacing.md,
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        borderColor: colors.primary
    },
    channelRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg
    },
    gridBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md
    },
    section: {
        marginVertical: spacing.sm
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    memberHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
        paddingHorizontal: spacing.xs
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.sm
    },
    settingNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.sm
    },
    settingText: {
        flex: 1,
        marginRight: spacing.md
    },
    dangerSection: {
        marginTop: spacing.xl
    }
});
