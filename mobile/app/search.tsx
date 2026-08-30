import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Header, SearchBar, AppText, Chip, EmptyState } from '../src/components';
import { colors, spacing } from '../src/theme';

export default function GlobalSearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    return (
        <Screen style={styles.container}>
            <Header title="Search" />

            <View style={styles.content}>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search people, messages, groups..."
                    showCancel
                    onCancel={() => router.back()}
                />

                {/* Filter Chips */}
                <View style={styles.chipRow}>
                    {['All', 'People', 'Chats', 'Messages', 'Media'].map((tab) => (
                        <Chip
                            key={tab}
                            label={tab}
                            selected={activeTab === tab}
                            onPress={() => setActiveTab(tab)}
                        />
                    ))}
                </View>

                {/* Results / Empty View */}
                <View style={styles.resultContainer}>
                    {query.trim().length === 0 ? (
                        <EmptyState
                            icon="search-outline"
                            title="Global Search"
                            description="Search across all conversations, team members, media and files."
                        />
                    ) : (
                        <EmptyState
                            icon="alert-circle-outline"
                            title="No Results Found"
                            description={`No matches found for "${query}". Try another search term.`}
                        />
                    )}
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        padding: spacing.md
    },
    chipRow: {
        flexDirection: 'row',
        marginTop: spacing.md,
        gap: spacing.xs
    },
    resultContainer: {
        marginTop: spacing['2xl']
    }
});
