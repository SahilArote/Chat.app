import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../AppText';
import { colors } from '../../theme';

export interface TextMessageProps {
    text: string;
    isOutgoing: boolean;
}

export const TextMessage: React.FC<TextMessageProps> = ({ text, isOutgoing }) => {
    return (
        <View style={styles.container}>
            <AppText
                variant="body"
                color={isOutgoing ? '#FFFFFF' : colors.textPrimary}
                style={styles.text}
            >
                {text}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 2
    },
    text: {
        lineHeight: 20
    }
});

export default TextMessage;
