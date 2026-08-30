import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, AppInput, Avatar, AppButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';

export default function CreateGroupScreen() {
    const router = useRouter();
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const mockContacts = [
        { id: 'user_1', name: 'Sahil Arote', role: 'Engineering Lead' },
        { id: 'user_2', name: 'Alex Rivera', role: 'Designer' },
        { id: 'user_3', name: 'Sarah Jenkins', role: 'Product Manager' }
    ];

    const toggleMember = (id: string) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter(m => m !== id));
        } else {
            setSelectedMembers([...selectedMembers, id]);
        }
    };

    const handleCreate = () => {
        router.back();
    };

    return (
        <Screen scrollable>
            <Header title="New Group" />

            <View style={styles.content}>
                <AppInput
                    label="Group Name"
                    placeholder="Enter group name..."
                    value={groupName}
                    onChangeText={setGroupName}
                />

                <AppText variant="label" color={colors.textSecondary} style={styles.sectionTitle}>
                    SELECT MEMBERS ({selectedMembers.length} selected)
                </AppText>

                <View style={styles.contactList}>
                    {mockContacts.map((contact) => {
                        const isSelected = selectedMembers.includes(contact.id);
                        return (
                            <TouchableOpacity
                                key={contact.id}
                                style={styles.contactRow}
                                activeOpacity={0.7}
                                onPress={() => toggleMember(contact.id)}
                            >
                                <Avatar name={contact.name} size="sm" />
                                <View style={styles.contactInfo}>
                                    <AppText variant="chatName" color={colors.textPrimary}>
                                        {contact.name}
                                    </AppText>
                                    <AppText variant="caption" color={colors.textMuted}>
                                        {contact.role}
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
                </View>

                <AppButton
                    title="Create Group"
                    size="lg"
                    fullWidth
                    disabled={!groupName.trim() || selectedMembers.length === 0}
                    onPress={handleCreate}
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
    sectionTitle: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs
    },
    contactList: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    contactInfo: {
        marginLeft: spacing.md,
        flex: 1
    },
    createBtn: {
        marginTop: spacing.xl
    }
});
