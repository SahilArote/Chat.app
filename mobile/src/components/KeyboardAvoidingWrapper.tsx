import React from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ViewStyle,
    StyleProp
} from 'react-native';

export interface KeyboardAvoidingWrapperProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    offset?: number;
}

export const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({
    children,
    style,
    offset = 0
}) => {
    return (
        <KeyboardAvoidingView
            style={[styles.container, style]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? offset : 0}
        >
            {children}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default KeyboardAvoidingWrapper;
