import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../Skeleton';
import { radius, spacing } from '../../theme';

export const ChatRoomSkeleton: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Incoming message skeleton */}
            <View style={[styles.bubbleWrapper, styles.incomingWrapper]}>
                <Skeleton width={200} height={42} borderRadius={radius.lg} />
            </View>

            {/* Outgoing message skeleton */}
            <View style={[styles.bubbleWrapper, styles.outgoingWrapper]}>
                <Skeleton width={240} height={56} borderRadius={radius.lg} />
            </View>

            {/* Incoming media skeleton */}
            <View style={[styles.bubbleWrapper, styles.incomingWrapper]}>
                <Skeleton width={220} height={140} borderRadius={radius.lg} />
            </View>

            {/* Outgoing message skeleton */}
            <View style={[styles.bubbleWrapper, styles.outgoingWrapper]}>
                <Skeleton width={180} height={38} borderRadius={radius.lg} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: spacing.md
    },
    bubbleWrapper: {
        flexDirection: 'row'
    },
    incomingWrapper: {
        justifyContent: 'flex-start'
    },
    outgoingWrapper: {
        justifyContent: 'flex-end'
    }
});

export default ChatRoomSkeleton;
