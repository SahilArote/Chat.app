import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../Avatar';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';
import { MockGroupMember, GroupMemberRole } from '../../mock/groups';

export interface MemberItemProps {
    member: MockGroupMember;
    isCurrentUserAdmin: boolean;
    onPromote?: (member: MockGroupMember) => void;
    onDemote?: (member: MockGroupMember) => void;
    onRemove?: (member: MockGroupMember) => void;
    onPress?: (member: MockGroupMember) => void;
}

export const MemberItem: React.FC<MemberItemProps> = ({
    member,
    isCurrentUserAdmin,
    onPromote,
    onDemote,
    onRemove,
    onPress
}) => {
    const getRoleBadge = (role: GroupMemberRole) => {
        switch (role) {
            case 'owner':
                return { label: 'Owner', bg: 'rgba(236, 72, 153, 0.15)', text: '#EC4899' };
            case 'admin':
                return { label: 'Admin', bg: 'rgba(99, 102, 241, 0.15)', text: colors.primary };
            case 'member':
            default:
                return null;
        }
    };

    const roleBadge = getRoleBadge(member.role);

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            onPress={() => onPress && onPress(member)}
        >
            <Avatar
                uri={member.avatar}
                name={member.name}
                size="sm"
                status={member.status}
            />

            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <AppText variant="chatName" color={colors.textPrimary} style={styles.name}>
                        {member.name}
                    </AppText>
                    {roleBadge && (
                        <View style={[styles.badge, { backgroundColor: roleBadge.bg }]}>
                            <AppText
                                variant="caption"
                                color={roleBadge.text}
                                weight="700"
                                style={{ fontSize: 10 }}
                            >
                                {roleBadge.label}
                            </AppText>
                        </View>
                    )}
                </View>
                <AppText variant="caption" color={colors.textMuted}>
                    @{member.username}
                </AppText>
            </View>

            {isCurrentUserAdmin && member.role !== 'owner' && (
                <View style={styles.actions}>
                    {member.role === 'member' && onPromote && (
                        <TouchableOpacity
                            onPress={() => onPromote(member)}
                            style={styles.actionBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="shield-outline" size={18} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                    {member.role === 'admin' && onDemote && (
                        <TouchableOpacity
                            onPress={() => onDemote(member)}
                            style={styles.actionBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="shield-half-outline" size={18} color={colors.warning} />
                        </TouchableOpacity>
                    )}
                    {onRemove && (
                        <TouchableOpacity
                            onPress={() => onRemove(member)}
                            style={styles.actionBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="remove-circle-outline" size={18} color={colors.error} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    info: {
        flex: 1,
        marginLeft: spacing.md
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    name: {
        fontWeight: '600'
    },
    badge: {
        marginLeft: spacing.xs + 2,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: radius.full
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm
    },
    actionBtn: {
        padding: spacing.xs
    }
});

export default MemberItem;
