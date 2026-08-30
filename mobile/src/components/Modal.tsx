import React from 'react';
import {
    View,
    Modal as RNModal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows } from '../theme';
import AppText from './AppText';

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
    style
}) => {
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.dialog, shadows.xl, style]}>
                            <View style={styles.header}>
                                {title && (
                                    <AppText variant="sectionTitle" color={colors.textPrimary}>
                                        {title}
                                    </AppText>
                                )}
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.closeButton}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    accessibilityLabel="Close dialog"
                                    accessibilityRole="button"
                                >
                                    <Ionicons name="close" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.body}>{children}</View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: colors.backdrop,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl
    },
    dialog: {
        width: '100%',
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md
    },
    closeButton: {
        padding: spacing.xs
    },
    body: {
        width: '100%'
    }
});

export default Modal;
