import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from '../Modal';
import AppInput from '../AppInput';
import AppButton from '../AppButton';
import { spacing } from '../../theme';
import { MockUserProfile } from '../../mock/users';

export interface EditProfileModalProps {
    visible: boolean;
    initialUser: MockUserProfile;
    onClose: () => void;
    onSave: (name: string, username: string, bio: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    visible,
    initialUser,
    onClose,
    onSave
}) => {
    const [name, setName] = useState(initialUser.name);
    const [username, setUsername] = useState(initialUser.username);
    const [bio, setBio] = useState(initialUser.bio || '');

    const handleSave = () => {
        if (!name.trim() || !username.trim()) return;
        onSave(name.trim(), username.trim(), bio.trim());
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose} title="Edit Profile">
            <View style={styles.content}>
                <AppInput
                    label="Display Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Your Name"
                />

                <AppInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="your.username"
                    autoCapitalize="none"
                />

                <AppInput
                    label="Bio"
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell your team about yourself..."
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
                        title="Save"
                        variant="primary"
                        size="md"
                        disabled={!name.trim() || !username.trim()}
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

export default EditProfileModal;
