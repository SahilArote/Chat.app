import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    SearchBar,
    AppText,
    Chip,
    EmptyState,
    SearchResultItem,
    RecentSearchesSection,
    Card
} from '../src/components';
import { colors, spacing, radius } from '../src/theme';
import searchRepository, { SearchCategory, SearchResult } from '../src/repositories/SearchRepository';
import { mockUsers } from '../src/mock/users';

export default function GlobalSearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<SearchCategory>('All');
    const [results, setResults] = useState<SearchResult>({
        people: [],
        conversations: [],
        messages: [],
        media: [],
        files: []
    });
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const categories: SearchCategory[] = ['All', 'People', 'Messages', 'Media', 'Files'];

    const loadRecent = useCallback(async () => {
        const list = await searchRepository.getRecentSearches();
        setRecentSearches(list);
    }, []);

    useEffect(() => {
        loadRecent();
    }, [loadRecent]);

    const performSearch = useCallback(
        async (q: string, cat: SearchCategory) => {
            if (!q.trim()) {
                setResults({ people: [], conversations: [], messages: [], media: [], files: [] });
                return;
            }
            const res = await searchRepository.search(q, cat);
            setResults(res);
        },
        []
    );

    useEffect(() => {
        performSearch(query, category);
    }, [query, category, performSearch]);

    const handleSelectRecent = (term: string) => {
        setQuery(term);
        performSearch(term, category);
    };

    const handleRemoveRecent = async (term: string) => {
        const updated = await searchRepository.removeRecentSearch(term);
        setRecentSearches(updated);
    };

    const handleClearAllRecent = async () => {
        await searchRepository.clearRecentSearches();
        setRecentSearches([]);
    };

    const handleOpenChat = (convId: string) => {
        searchRepository.addRecentSearch(query);
        router.push(`/chat/${convId}`);
    };

    const handleOpenUser = (userId: string) => {
        searchRepository.addRecentSearch(query);
        router.push(`/user/${userId}`);
    };

    const totalResultsCount =
        results.people.length +
        results.conversations.length +
        results.messages.length +
        results.media.length +
        results.files.length;

    const hasQuery = query.trim().length > 0;

    return (
        <Screen style={styles.container}>
            {/* ─── 1. SEARCH INPUT HEADER ──────────────────────────── */}
            <View style={styles.header}>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search people, messages, files..."
                    showCancel
                    onCancel={() => router.back()}
                />
            </View>

            {/* ─── 2. CATEGORY FILTER CHIPS ────────────────────────── */}
            <View style={styles.filterSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            selected={category === cat}
                            onPress={() => setCategory(cat)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* ─── 3. RESULTS OR DEFAULT DISCOVERY ─────────────────── */}
            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {!hasQuery ? (
                    <>
                        {/* Recent Searches */}
                        <RecentSearchesSection
                            searches={recentSearches}
                            onSelectSearch={handleSelectRecent}
                            onRemoveSearch={handleRemoveRecent}
                            onClearAll={handleClearAllRecent}
                        />

                        {/* Suggested Team Contacts */}
                        <View style={styles.suggestedSection}>
                            <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                                SUGGESTED CONTACTS
                            </AppText>
                            <Card variant="outlined" style={{ padding: 0 }}>
                                {mockUsers.slice(0, 4).map((user) => (
                                    <SearchResultItem
                                        key={user.id}
                                        type="person"
                                        title={user.name}
                                        subtitle={`@${user.username} • ${user.bio || 'Pulse member'}`}
                                        avatarUri={user.avatar}
                                        searchQuery=""
                                        onPress={() => router.push(`/user/${user.id}`)}
                                    />
                                ))}
                            </Card>
                        </View>
                    </>
                ) : totalResultsCount === 0 ? (
                    <EmptyState
                        icon="search-outline"
                        title="No Results Found"
                        description={`We couldn't find anything matching "${query}". Try checking for typos or using broader keywords.`}
                        style={{ paddingVertical: spacing['3xl'] }}
                    />
                ) : (
                    <View style={styles.resultsContainer}>
                        {/* People Results */}
                        {results.people.length > 0 && (
                            <View style={styles.resultGroup}>
                                <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                                    PEOPLE ({results.people.length})
                                </AppText>
                                <Card variant="outlined" style={{ padding: 0 }}>
                                    {results.people.map((p) => (
                                        <SearchResultItem
                                            key={p.id}
                                            type="person"
                                            title={p.name}
                                            subtitle={`@${p.username} • ${p.bio || ''}`}
                                            avatarUri={p.avatar}
                                            searchQuery={query}
                                            onPress={() => handleOpenUser(p.id)}
                                        />
                                    ))}
                                </Card>
                            </View>
                        )}

                        {/* Conversation Results */}
                        {results.conversations.length > 0 && (
                            <View style={styles.resultGroup}>
                                <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                                    CHATS ({results.conversations.length})
                                </AppText>
                                <Card variant="outlined" style={{ padding: 0 }}>
                                    {results.conversations.map((c) => (
                                        <SearchResultItem
                                            key={c.id}
                                            type="conversation"
                                            title={c.name}
                                            subtitle={c.lastMessage}
                                            avatarUri={c.avatar}
                                            meta={c.lastMessageTimestamp}
                                            searchQuery={query}
                                            onPress={() => handleOpenChat(c.id)}
                                        />
                                    ))}
                                </Card>
                            </View>
                        )}

                        {/* Message Results */}
                        {results.messages.length > 0 && (
                            <View style={styles.resultGroup}>
                                <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                                    MESSAGES ({results.messages.length})
                                </AppText>
                                <Card variant="outlined" style={{ padding: 0 }}>
                                    {results.messages.map((m) => (
                                        <SearchResultItem
                                            key={m.id}
                                            type="message"
                                            title={m.senderName}
                                            subtitle={m.text}
                                            meta={m.timestamp}
                                            searchQuery={query}
                                            onPress={() => handleOpenChat(m.conversationId)}
                                        />
                                    ))}
                                </Card>
                            </View>
                        )}

                        {/* Media Results */}
                        {results.media.length > 0 && (
                            <View style={styles.resultGroup}>
                                <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                                    MEDIA ({results.media.length})
                                </AppText>
                                <Card variant="outlined" style={{ padding: 0 }}>
                                    {results.media.map((med) => (
                                        <SearchResultItem
                                            key={med.id}
                                            type="media"
                                            title={med.senderName}
                                            subtitle={med.text || 'Shared Image'}
                                            mediaUrl={med.mediaUrl}
                                            meta={med.timestamp}
                                            searchQuery={query}
                                            onPress={() => handleOpenChat(med.conversationId)}
                                        />
                                    ))}
                                </Card>
                            </View>
                        )}

                        {/* File Results */}
                        {results.files.length > 0 && (
                            <View style={styles.resultGroup}>
                                <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                                    FILES ({results.files.length})
                                </AppText>
                                <Card variant="outlined" style={{ padding: 0 }}>
                                    {results.files.map((f) => (
                                        <SearchResultItem
                                            key={f.id}
                                            type="file"
                                            title={f.fileName || 'Document'}
                                            subtitle={`${f.fileSize || '1.0 MB'} • ${f.senderName}`}
                                            meta={f.timestamp}
                                            searchQuery={query}
                                            onPress={() => handleOpenChat(f.conversationId)}
                                        />
                                    ))}
                                </Card>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xs
    },
    filterSection: {
        paddingVertical: spacing.xs
    },
    filterScroll: {
        paddingHorizontal: spacing.lg,
        gap: spacing.xs
    },
    scrollArea: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        paddingBottom: spacing['4xl']
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    suggestedSection: {
        marginTop: spacing.xs
    },
    resultsContainer: {
        gap: spacing.md
    },
    resultGroup: {
        marginBottom: spacing.xs
    }
});
