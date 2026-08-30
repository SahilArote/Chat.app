import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText';
import Chip from '../Chip';
import { colors, radius, spacing } from '../../theme';

export const SharedMediaGrid: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'links'>('media');

    const mockMedia = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300'
    ];

    const mockDocs = [
        { name: 'Pulse_Architecture_v2.pdf', size: '2.4 MB', date: 'Aug 28' },
        { name: 'Sprint_Design_Review.docx', size: '1.1 MB', date: 'Aug 24' },
        { name: 'Backend_Endpoints_Spec.json', size: '340 KB', date: 'Aug 20' }
    ];

    const mockLinks = [
        { title: 'Expo Router Documentation', url: 'docs.expo.dev/router', icon: 'globe-outline' },
        { title: 'Pulse Chat GitHub Repository', url: 'github.com/SahilArote/Chat.app', icon: 'logo-github' },
        { title: 'React Native Reanimated Docs', url: 'docs.swmansion.com/reanimated', icon: 'code-slash-outline' }
    ];

    return (
        <View style={styles.container}>
            {/* Tab Filter Chips */}
            <View style={styles.tabRow}>
                <Chip
                    label="Media (6)"
                    selected={activeTab === 'media'}
                    onPress={() => setActiveTab('media')}
                />
                <Chip
                    label="Docs (3)"
                    selected={activeTab === 'docs'}
                    onPress={() => setActiveTab('docs')}
                />
                <Chip
                    label="Links (3)"
                    selected={activeTab === 'links'}
                    onPress={() => setActiveTab('links')}
                />
            </View>

            {/* Content Area */}
            {activeTab === 'media' && (
                <View style={styles.mediaGrid}>
                    {mockMedia.map((url, i) => (
                        <Image key={i} source={{ uri: url }} style={styles.mediaThumb} />
                    ))}
                </View>
            )}

            {activeTab === 'docs' && (
                <View style={styles.listSection}>
                    {mockDocs.map((doc, i) => (
                        <View key={i} style={styles.docRow}>
                            <View style={styles.docIcon}>
                                <Ionicons name="document-text" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.docInfo}>
                                <AppText variant="bodySmall" color={colors.textPrimary} weight="600" numberOfLines={1}>
                                    {doc.name}
                                </AppText>
                                <AppText variant="caption" color={colors.textMuted}>
                                    {doc.size} • {doc.date}
                                </AppText>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {activeTab === 'links' && (
                <View style={styles.listSection}>
                    {mockLinks.map((link, i) => (
                        <View key={i} style={styles.linkRow}>
                            <View style={styles.linkIcon}>
                                <Ionicons name={link.icon as any} size={18} color={colors.primary} />
                            </View>
                            <View style={styles.linkInfo}>
                                <AppText variant="bodySmall" color={colors.textPrimary} weight="600" numberOfLines={1}>
                                    {link.title}
                                </AppText>
                                <AppText variant="caption" color={colors.primarySubtle} numberOfLines={1}>
                                    {link.url}
                                </AppText>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    tabRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md
    },
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6
    },
    mediaThumb: {
        width: '31.5%',
        aspectRatio: 1,
        borderRadius: radius.sm
    },
    listSection: {
        gap: spacing.xs
    },
    docRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border
    },
    docIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm
    },
    docInfo: {
        flex: 1
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border
    },
    linkIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm
    },
    linkInfo: {
        flex: 1
    }
});

export default SharedMediaGrid;
