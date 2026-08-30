import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    AppText,
    AppButton,
    AppInput,
    AppIconButton,
    Avatar,
    Badge,
    Divider,
    Card,
    Header,
    BottomSheet,
    Modal,
    Toast,
    Loader,
    Skeleton,
    EmptyState,
    ErrorState,
    Switch,
    Chip,
    SearchBar
} from '../src/components';
import { colors, spacing, radius } from '../src/theme';

export default function ComponentGalleryScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [switchVal, setSwitchVal] = useState(true);
    const [selectedChip, setSelectedChip] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showSheet, setShowSheet] = useState(false);

    return (
        <Screen scrollable>
            <Header
                title="Pulse Component Gallery"
                subtitle="Phase 2 Core Library"
                showBack={false}
                rightAction={
                    <AppIconButton
                        icon={<Ionicons name="sparkles" size={18} color={colors.primary} />}
                        onPress={() => setShowSheet(true)}
                        variant="filled"
                    />
                }
            />

            <View style={styles.content}>
                {/* ─── 1. SEARCH BAR ────────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>1. SearchBar</AppText>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search components, messages..."
                    />
                </View>

                {/* ─── 2. BUTTONS ───────────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>2. AppButton (Variants & Sizes)</AppText>
                    <View style={styles.buttonRow}>
                        <AppButton title="Primary" size="sm" />
                        <AppButton title="Secondary" variant="secondary" size="sm" />
                        <AppButton title="Outline" variant="outline" size="sm" />
                    </View>
                    <View style={[styles.buttonRow, { marginTop: spacing.sm }]}>
                        <AppButton
                            title="With Icon"
                            leftIcon={<Ionicons name="send" size={16} color="#FFFFFF" />}
                            size="md"
                        />
                        <AppButton title="Danger" variant="danger" size="md" />
                    </View>
                    <View style={{ marginTop: spacing.sm }}>
                        <AppButton title="Full Width Loading" loading fullWidth />
                    </View>
                </View>

                {/* ─── 3. INPUTS ────────────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>3. AppInput (Text & Password)</AppText>
                    <AppInput
                        label="Email Address"
                        placeholder="sahil@example.com"
                        value={inputValue}
                        onChangeText={setInputValue}
                        leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
                    />
                    <AppInput
                        label="Password"
                        placeholder="Enter secure password"
                        isPassword
                        leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
                        helperText="Must be at least 6 characters"
                    />
                </View>

                {/* ─── 4. AVATARS & BADGES ──────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>4. Avatar & Badge</AppText>
                    <View style={styles.row}>
                        <Avatar name="Sahil Arote" size="lg" status="online" />
                        <Avatar name="John Doe" size="md" status="offline" />
                        <Avatar name="Pulse Bot" size="sm" />
                        <Badge count={5} />
                        <Badge count={120} variant="success" />
                        <Badge dot variant="warning" />
                    </View>
                </View>

                {/* ─── 5. CHIPS & SWITCH ────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>5. Chips & Switch</AppText>
                    <View style={styles.row}>
                        {['All', 'Direct', 'Groups', 'Unread'].map((cat) => (
                            <Chip
                                key={cat}
                                label={cat}
                                selected={selectedChip === cat}
                                onPress={() => setSelectedChip(cat)}
                            />
                        ))}
                    </View>
                    <View style={[styles.row, { marginTop: spacing.md, justifyContent: 'space-between' }]}>
                        <AppText variant="body">Push Notifications</AppText>
                        <Switch value={switchVal} onValueChange={setSwitchVal} />
                    </View>
                </View>

                {/* ─── 6. TOAST & CARDS ─────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>6. Toast & Card</AppText>
                    <Toast type="success" message="Message delivered successfully" style={{ marginBottom: spacing.md }} />
                    <Card variant="elevated" padding="md">
                        <AppText variant="chatName">Elevated Interactive Card</AppText>
                        <AppText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 4 }}>
                            Demonstrating shadow tokens and border radius from Phase 1.
                        </AppText>
                    </Card>
                </View>

                {/* ─── 7. SKELETON & LOADER ─────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>7. Skeleton Shimmer & Loader</AppText>
                    <View style={styles.row}>
                        <Skeleton width={48} height={48} borderRadius={radius.full} />
                        <View style={{ flex: 1, marginLeft: spacing.md }}>
                            <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
                            <Skeleton width="50%" height={12} />
                        </View>
                    </View>
                    <Loader text="Syncing messages..." />
                </View>

                {/* ─── 8. MODAL & BOTTOM SHEET TRIGGERS ─────────────────── */}
                <View style={styles.section}>
                    <AppText variant="sectionTitle" style={styles.sectionTitle}>8. Dialogs & Overlays</AppText>
                    <View style={styles.buttonRow}>
                        <AppButton title="Open Modal" variant="secondary" onPress={() => setShowModal(true)} />
                        <AppButton title="Open BottomSheet" variant="primary" onPress={() => setShowSheet(true)} />
                    </View>
                </View>

                <Divider label="STATE SAMPLES" />

                {/* ─── 9. EMPTY & ERROR STATES ──────────────────────────── */}
                <EmptyState
                    title="No Conversations Yet"
                    description="Start a chat with a teammate or create a group to begin messaging."
                    actionTitle="New Chat"
                    onAction={() => {}}
                />

                <ErrorState
                    title="Unable to Load Data"
                    message="Check your network connection and retry."
                    onRetry={() => {}}
                />
            </View>

            {/* Modal Dialog */}
            <Modal visible={showModal} onClose={() => setShowModal(false)} title="Confirm Action">
                <AppText variant="body" color={colors.textSecondary} style={{ marginBottom: spacing.lg }}>
                    Are you sure you want to proceed with this mock action?
                </AppText>
                <View style={styles.buttonRow}>
                    <AppButton title="Cancel" variant="ghost" onPress={() => setShowModal(false)} />
                    <AppButton title="Confirm" variant="primary" onPress={() => setShowModal(false)} />
                </View>
            </Modal>

            {/* Bottom Sheet */}
            <BottomSheet visible={showSheet} onClose={() => setShowSheet(false)} title="Quick Actions">
                <AppText variant="body" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
                    Select an action for this message:
                </AppText>
                <View style={{ gap: spacing.sm }}>
                    <AppButton title="Reply Message" variant="secondary" size="md" onPress={() => setShowSheet(false)} />
                    <AppButton title="Copy Text" variant="secondary" size="md" onPress={() => setShowSheet(false)} />
                    <AppButton title="Delete Message" variant="danger" size="md" onPress={() => setShowSheet(false)} />
                </View>
            </BottomSheet>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing['4xl']
    },
    section: {
        marginVertical: spacing.md
    },
    sectionTitle: {
        color: colors.primary,
        marginBottom: spacing.sm
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.sm
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm
    }
});
