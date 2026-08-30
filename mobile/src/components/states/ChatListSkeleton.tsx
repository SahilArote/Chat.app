import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../Skeleton';
import { colors, radius, spacing } from '../../theme';

export const ChatListSkeleton: React.FC = () => {
    const rows = [1, 2, 3, 4, 5, 6];

    return (
        <View style={styles.container}>
            {rows.map((r) => (
                <View key={r} style={styles.row}>
                    <Skeleton width={48} height={48} borderRadius={radius.full} />
                    <View style={styles.textContainer}>
                        <View style={styles.topLine}>
                            <Skeleton width="45%" height={14} borderRadius={radius.sm} />
                            <Skeleton width={38} height={10} borderRadius={radius.sm} />
                        </View>
                        <Skeleton width="75%" height={12} borderRadius={radius.sm} style={{ marginTop: 8 }} />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xs
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.md
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default ChatListSkeleton;
