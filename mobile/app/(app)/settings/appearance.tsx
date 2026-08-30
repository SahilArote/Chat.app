import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, Card, Switch } from '../../../src/components';
import { colors, radius, spacing } from '../../../src/theme';

export default function AppearanceSettingsScreen() {
    const [selectedTheme, setSelectedTheme] = useState<'obsidian' | 'midnight' | 'deepspace'>('obsidian');
    const [selectedColor, setSelectedColor] = useState('#6366F1');
    const [fontSize, setFontSize] = useState<'Small' | 'Default' | 'Large'>('Default');
    const [amoledPureBlack, setAmoledPureBlack] = useState(true);

    const themeCards = [
        { id: 'obsidian' as const, name: 'Obsidian Dark', desc: 'AMOLED pure dark with high contrast', bg: '#0A0D14' },
        { id: 'midnight' as const, name: 'Midnight Blue', desc: 'Subtle deep navy tones', bg: '#0F172A' },
        { id: 'deepspace' as const, name: 'Deep Space', desc: 'Charcoal graphite finish', bg: '#18181B' }
    ];

    const accentColors = [
        { name: 'Indigo', hex: '#6366F1' },
        { name: 'Emerald', hex: '#10B981' },
        { name: 'Violet', hex: '#8B5CF6' },
        { name: 'Coral', hex: '#F43F5E' },
        { name: 'Amber', hex: '#F59E0B' }
    ];

    return (
        <Screen scrollable>
            <Header title="Appearance" />

            <View style={styles.content}>
                {/* ─── 1. THEME PRESETS ─────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        THEME PRESETS
                    </AppText>
                    <Card variant="outlined" style={{ padding: 0 }}>
                        {themeCards.map((theme) => {
                            const isSelected = selectedTheme === theme.id;
                            return (
                                <TouchableOpacity
                                    key={theme.id}
                                    style={[styles.themeRow, isSelected && styles.themeRowSelected]}
                                    activeOpacity={0.7}
                                    onPress={() => setSelectedTheme(theme.id)}
                                >
                                    <View style={[styles.themeSwatch, { backgroundColor: theme.bg }]} />
                                    <View style={styles.themeInfo}>
                                        <AppText variant="chatName" color={colors.textPrimary}>
                                            {theme.name}
                                        </AppText>
                                        <AppText variant="caption" color={colors.textSecondary}>
                                            {theme.desc}
                                        </AppText>
                                    </View>
                                    <Ionicons
                                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={20}
                                        color={isSelected ? colors.primary : colors.textMuted}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </Card>
                </View>

                {/* ─── 2. ACCENT COLOR PALETTE ──────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        ACCENT COLOR
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.colorRow}>
                            {accentColors.map((color) => {
                                const isSelected = selectedColor === color.hex;
                                return (
                                    <TouchableOpacity
                                        key={color.hex}
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: color.hex },
                                            isSelected && styles.colorCircleActive
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedColor(color.hex)}
                                    >
                                        {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Card>
                </View>

                {/* ─── 3. FONT SCALE ────────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        TEXT SIZE
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.fontRow}>
                            {(['Small', 'Default', 'Large'] as const).map((size) => {
                                const isSelected = fontSize === size;
                                return (
                                    <TouchableOpacity
                                        key={size}
                                        style={[styles.fontBtn, isSelected && styles.fontBtnActive]}
                                        onPress={() => setFontSize(size)}
                                    >
                                        <AppText
                                            variant="bodySmall"
                                            color={isSelected ? '#FFFFFF' : colors.textSecondary}
                                            weight={isSelected ? '700' : '400'}
                                        >
                                            {size}
                                        </AppText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Card>
                </View>

                {/* ─── 4. AMOLED PURE BLACK ─────────────────────────────── */}
                <View style={styles.section}>
                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1, marginRight: spacing.md }}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    AMOLED Pure Black
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Turns true pitch black (#000000) for OLED battery savings
                                </AppText>
                            </View>
                            <Switch value={amoledPureBlack} onValueChange={setAmoledPureBlack} />
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
    themeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    themeRowSelected: {
        backgroundColor: colors.primarySubtle
    },
    themeSwatch: {
        width: 34,
        height: 34,
        borderRadius: radius.sm,
        borderWidth: 1.5,
        borderColor: colors.border
    },
    themeInfo: {
        flex: 1,
        marginLeft: spacing.md
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    colorCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorCircleActive: {
        borderWidth: 3,
        borderColor: '#FFFFFF'
    },
    fontRow: {
        flexDirection: 'row',
        gap: spacing.sm
    },
    fontBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border
    },
    fontBtnActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
