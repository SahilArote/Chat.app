import React from 'react';
import {
    View,
    Modal as RNModal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ViewStyle
} from 'react-native';
import { colors, radius, spacing, shadows } from '../theme';
import AppText from './AppText';

export interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
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
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.sheetContainer, shadows.xl, style]}>
                            {/* Drag Indicator */}
                            <View style={styles.handleBar} />

                            {title && (
                                <View style={styles.header}>
                                    <AppText variant="sectionTitle" color={colors.textPrimary}>
                                        {title}
                                    </AppText>
                                </View>
                            )}

                            <View style={styles.content}>{children}</View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.backdrop,
        justifyContent: 'flex-end'
    },
    sheetContainer: {
        backgroundColor: colors.surfaceElevated,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing['3xl'],
        borderTopWidth: 1,
        borderColor: colors.border
    },
    handleBar: {
        width: 36,
        height: 4,
        borderRadius: radius.full,
        backgroundColor: colors.borderLight,
        alignSelf: 'center',
        marginVertical: spacing.md
    },
    header: {
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    content: {
        paddingTop: spacing.xs
    }
});

export default BottomSheet;
