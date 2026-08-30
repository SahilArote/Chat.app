import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from '../Modal';
import AppInput from '../AppInput';
import AppButton from '../AppButton';
import { spacing } from '../../theme';

export interface EditGroupModalProps {
    visible: boolean;
    initialName: string;
    initialDescription: string;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
    visible,
    initialName,
    initialDescription,
    onClose,
    onSave
}) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name.trim(), description.trim());
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose} title="Edit Group Info">
            <View style={styles.content}>
                <AppInput
                    label="Group Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter group name"
                />

                <AppInput
                    label="Group Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter group description"
                    multiline
                    numberOfLines={3}
                />

                <View style={styles.buttonRow}>
                    <AppButton
                        title="Cancel"
                        variant="ghost"
                        size="md"
                        onPress={onClose}
                        style={{ flex: 1 }}
                    />
                    <AppButton
                        title="Save Changes"
                        variant="primary"
                        size="md"
                        disabled={!name.trim()}
                        onPress={handleSave}
                        style={{ flex: 1, marginLeft: spacing.sm }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        width: '100%'
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: spacing.md
    }
});

export default EditGroupModal;
