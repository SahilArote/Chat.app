import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';

export interface OfflineBannerProps {
    visible: boolean;
    isReconnecting?: boolean;
    onRetry?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
    visible,
    isReconnecting = false,
    onRetry
}) => {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons
                    name={isReconnecting ? 'sync-outline' : 'cloud-offline-outline'}
                    size={16}
                    color="#FFFFFF"
                    style={styles.icon}
                />
                <AppText variant="caption" color="#FFFFFF" weight="600" style={styles.text}>
                    {isReconnecting ? 'Connecting to Pulse Network...' : 'Waiting for network connection...'}
                </AppText>
            </View>

            {onRetry && !isReconnecting && (
                <TouchableOpacity onPress={onRetry} style={styles.retryBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                    <AppText variant="caption" color="#FFFFFF" weight="700" style={styles.retryText}>
                        Retry
                    </AppText>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.warning,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        width: '100%'
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    icon: {
        marginRight: spacing.xs
    },
    text: {
        fontSize: 11
    },
    retryBtn: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.full
    },
    retryText: {
        fontSize: 10
    }
});

export default OfflineBanner;
