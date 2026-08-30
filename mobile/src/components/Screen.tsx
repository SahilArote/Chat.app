import React from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ViewStyle,
    ScrollViewProps
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../theme';

export interface ScreenProps {
    children: React.ReactNode;
    scrollable?: boolean;
    edges?: Edge[];
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    scrollViewProps?: ScrollViewProps;
}

export const Screen: React.FC<ScreenProps> = ({
    children,
    scrollable = false,
    edges = ['top', 'left', 'right', 'bottom'],
    style,
    contentContainerStyle,
    scrollViewProps
}) => {
    const content = scrollable ? (
        <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            {...scrollViewProps}
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.fixedContent, style]}>{children}</View>
    );

    return (
        <SafeAreaView edges={edges} style={[styles.container, style]}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {content}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    keyboardAvoid: {
        flex: 1
    },
    fixedContent: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1
    }
});

export default Screen;
