import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Modal as RNModal,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import AppText from '../AppText';

export interface ImageLightboxModalProps {
    visible: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
    visible,
    imageUrl,
    onClose
}) => {
    if (!imageUrl) return null;

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.backdrop}>
                {/* Top Control Bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.controlBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.rightControls}>
                        <TouchableOpacity
                            style={styles.controlBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="share-outline" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.controlBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="download-outline" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Full Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                </View>
            </SafeAreaView>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'space-between'
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        zIndex: 10
    },
    rightControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md
    },
    controlBtn: {
        padding: spacing.xs
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullImage: {
        width: '100%',
        height: '100%'
    }
});

export default ImageLightboxModal;
