import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';

export interface ImageMessageProps {
    mediaUrl: string;
    caption?: string;
    isOutgoing: boolean;
    onPress: (url: string) => void;
}

export const ImageMessage: React.FC<ImageMessageProps> = ({
    mediaUrl,
    caption,
    isOutgoing,
    onPress
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onPress(mediaUrl)}
                style={styles.imageWrapper}
            >
                <Image source={{ uri: mediaUrl }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>

            {caption ? (
                <AppText
                    variant="body"
                    color={isOutgoing ? '#FFFFFF' : colors.textPrimary}
                    style={styles.caption}
                >
                    {caption}
                </AppText>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 2
    },
    imageWrapper: {
        borderRadius: radius.md,
        overflow: 'hidden',
        marginBottom: spacing.xs
    },
    image: {
        width: 240,
        height: 160
    },
    caption: {
        marginTop: 2,
        lineHeight: 19
    }
});

export default ImageMessage;
