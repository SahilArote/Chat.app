import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { colors, radius, typography } from '../theme';
import AppText from './AppText';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
    uri?: string | null;
    name?: string;
    size?: AvatarSize;
    status?: 'online' | 'offline';
    style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
    uri,
    name = '',
    size = 'md',
    status,
    style
}) => {
    const sizeMap: Record<AvatarSize, { size: number; fontSize: number; dotSize: number }> = {
        xs: { size: 28, fontSize: 11, dotSize: 7 },
        sm: { size: 36, fontSize: 13, dotSize: 9 },
        md: { size: 48, fontSize: 17, dotSize: 12 },
        lg: { size: 64, fontSize: 22, dotSize: 15 },
        xl: { size: 84, fontSize: 30, dotSize: 18 }
    };

    const current = sizeMap[size];

    const getInitials = (n: string) => {
        if (!n) return '?';
        const parts = n.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return n.slice(0, 2).toUpperCase();
    };

    const getInitialsBg = (n: string) => {
        const bgColors = ['#6366F1', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B'];
        let hash = 0;
        for (let i = 0; i < n.length; i++) {
            hash = n.charCodeAt(i) + ((hash << 5) - hash);
        }
        return bgColors[Math.abs(hash) % bgColors.length];
    };

    return (
        <View style={[styles.container, { width: current.size, height: current.size }, style]}>
            {uri ? (
                <Image
                    source={{ uri }}
                    style={[
                        styles.image,
                        {
                            width: current.size,
                            height: current.size,
                            borderRadius: radius.full
                        } as ImageStyle
                    ]}
                />
            ) : (
                <View
                    style={[
                        styles.fallback,
                        {
                            width: current.size,
                            height: current.size,
                            borderRadius: radius.full,
                            backgroundColor: getInitialsBg(name)
                        }
                    ]}
                >
                    <AppText
                        style={{
                            fontSize: current.fontSize,
                            fontWeight: '700',
                            color: '#FFFFFF'
                        }}
                    >
                        {getInitials(name)}
                    </AppText>
                </View>
            )}

            {status && (
                <View
                    style={[
                        styles.statusDot,
                        {
                            width: current.dotSize,
                            height: current.dotSize,
                            borderRadius: radius.full,
                            backgroundColor: status === 'online' ? colors.online : colors.textMuted
                        }
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        resizeMode: 'cover'
    },
    fallback: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: colors.background
    }
});

export default Avatar;
