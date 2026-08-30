import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../Modal';
import AppText from '../AppText';
import AppInput from '../AppInput';
import AppButton from '../AppButton';
import { colors, radius, spacing } from '../../theme';
import { PresenceStatus, UserPresence } from '../../repositories/UserRepository';

export interface StatusSelectorModalProps {
    visible: boolean;
    initialPresence: UserPresence;
    onClose: () => void;
    onSave: (presence: UserPresence) => void;
}

export const StatusSelectorModal: React.FC<StatusSelectorModalProps> = ({
    visible,
    initialPresence,
    onClose,
    onSave
}) => {
    const [status, setStatus] = useState<PresenceStatus>(initialPresence.status);
    const [customText, setCustomText] = useState(initialPresence.customStatus || '');
    const [customEmoji, setCustomEmoji] = useState(initialPresence.customEmoji || '⚡');

    const statusOptions: Array<{ id: PresenceStatus; label: string; desc: string; dotColor: string }> = [
        { id: 'online', label: 'Online', desc: 'Visible to all contacts', dotColor: colors.online },
        { id: 'away', label: 'Away', desc: 'Appear away after inactivity', dotColor: colors.warning },
        { id: 'dnd', label: 'Do Not Disturb', desc: 'Mute incoming alerts & calls', dotColor: colors.error },
        { id: 'offline', label: 'Invisible', desc: 'Appear offline to everyone', dotColor: colors.textMuted }
    ];

    const handleSave = () => {
        onSave({
            status,
            customStatus: customText.trim() || undefined,
            customEmoji: customEmoji || undefined
        });
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose} title="Set Status & Presence">
            <View style={styles.content}>
                {/* Custom Status Input */}
                <AppInput
                    label="Custom Status"
                    placeholder="What are you working on?"
                    value={customText}
                    onChangeText={setCustomText}
                    leftIcon={<AppText style={{ fontSize: 18 }}>{customEmoji}</AppText>}
                />

                {/* Presence Status Radio Options */}
                <AppText variant="label" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
                    PRESENCE STATUS
                </AppText>

                <View style={styles.optionsList}>
                    {statusOptions.map((opt) => {
                        const isSelected = status === opt.id;
                        return (
                            <TouchableOpacity
                                key={opt.id}
                                style={[styles.optionRow, isSelected && styles.optionSelected]}
                                activeOpacity={0.7}
                                onPress={() => setStatus(opt.id)}
                            >
                                <View style={[styles.statusDot, { backgroundColor: opt.dotColor }]} />
                                <View style={styles.optionText}>
                                    <AppText variant="body" color={colors.textPrimary} weight="600">
                                        {opt.label}
                                    </AppText>
                                    <AppText variant="caption" color={colors.textSecondary}>
                                        {opt.desc}
                                    </AppText>
                                </View>
                                <Ionicons
                                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={20}
                                    color={isSelected ? colors.primary : colors.textMuted}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <AppButton
                    title="Save Status"
                    size="md"
                    fullWidth
                    onPress={handleSave}
                    style={{ marginTop: spacing.md }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        width: '100%'
    },
    optionsList: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    optionSelected: {
        backgroundColor: colors.primarySubtle
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.md
    },
    optionText: {
        flex: 1
    }
});

export default StatusSelectorModal;
