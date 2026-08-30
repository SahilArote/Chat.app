import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Header, AppText, Card, Switch, AppButton, Toast } from '../../../src/components';
import { colors, radius, spacing } from '../../../src/theme';

export default function StorageSettingsScreen() {
    const [autoDownloadWifi, setAutoDownloadWifi] = useState(true);
    const [autoDownloadCellular, setAutoDownloadCellular] = useState(false);
    const [cacheSize, setCacheSize] = useState('26.0 MB');
    const [toastMessage, setToastMessage] = useState('');

    const handleClearCache = () => {
        setCacheSize('0.0 KB');
        setToastMessage('Media cache cleared! 26.0 MB of storage freed.');
    };

    return (
        <Screen scrollable>
            <Header title="Storage & Data" />

            <View style={styles.content}>
                {toastMessage ? (
                    <Toast type="success" message={toastMessage} style={{ marginBottom: spacing.md }} />
                ) : null}

                {/* ─── 1. STORAGE BREAKDOWN GRAPHIC ─────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        DEVICE STORAGE USAGE
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.storageHeader}>
                            <AppText variant="display" color={colors.textPrimary}>
                                {cacheSize}
                            </AppText>
                            <AppText variant="caption" color={colors.textSecondary}>
                                Used by Pulse Chat
                            </AppText>
                        </View>

                        {/* Multi-Color Progress Bar */}
                        <View style={styles.progressBar}>
                            <View style={[styles.progressSegment, { flex: 54, backgroundColor: '#EC4899' }]} />
                            <View style={[styles.progressSegment, { flex: 24, backgroundColor: '#6366F1' }]} />
                            <View style={[styles.progressSegment, { flex: 14, backgroundColor: '#10B981' }]} />
                            <View style={[styles.progressSegment, { flex: 8, backgroundColor: '#F59E0B' }]} />
                        </View>

                        {/* Legend */}
                        <View style={styles.legendGrid}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#EC4899' }]} />
                                <AppText variant="caption" color={colors.textSecondary}>Videos (14.1 MB)</AppText>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#6366F1' }]} />
                                <AppText variant="caption" color={colors.textSecondary}>Photos (6.2 MB)</AppText>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                                <AppText variant="caption" color={colors.textSecondary}>Audio (3.8 MB)</AppText>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                                <AppText variant="caption" color={colors.textSecondary}>Docs (1.9 MB)</AppText>
                            </View>
                        </View>

                        <AppButton
                            title="Clear Media Cache"
                            variant="secondary"
                            size="md"
                            fullWidth
                            disabled={cacheSize === '0.0 KB'}
                            onPress={handleClearCache}
                            style={{ marginTop: spacing.md }}
                        />
                    </Card>
                </View>

                {/* ─── 2. AUTO-DOWNLOAD RULES ───────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        MEDIA AUTO-DOWNLOAD
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    When Connected to Wi-Fi
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Photos, audio notes, and incoming media
                                </AppText>
                            </View>
                            <Switch value={autoDownloadWifi} onValueChange={setAutoDownloadWifi} />
                        </View>

                        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    When Using Cellular Data
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Reduce cellular data consumption
                                </AppText>
                            </View>
                            <Switch value={autoDownloadCellular} onValueChange={setAutoDownloadCellular} />
                        </View>
                    </Card>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing['4xl']
    },
    section: {
        marginVertical: spacing.xs
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    storageHeader: {
        marginBottom: spacing.md
    },
    progressBar: {
        flexDirection: 'row',
        height: 10,
        borderRadius: radius.full,
        overflow: 'hidden',
        backgroundColor: colors.surfaceElevated,
        marginBottom: spacing.md
    },
    progressSegment: {
        height: '100%'
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.xs
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '45%'
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    textCol: {
        flex: 1,
        marginRight: spacing.md
    }
});
