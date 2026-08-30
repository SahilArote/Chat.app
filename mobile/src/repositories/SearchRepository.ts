import { mockUsers, MockUserProfile } from '../mock/users';
import { mockConversations, MockConversation } from '../mock/conversations';
import { mockMessages, MockMessage } from '../mock/messages';

export type SearchCategory = 'All' | 'People' | 'Messages' | 'Media' | 'Files';

export interface SearchResult {
    people: MockUserProfile[];
    conversations: MockConversation[];
    messages: MockMessage[];
    media: MockMessage[];
    files: MockMessage[];
}

export interface ISearchRepository {
    search(query: string, category?: SearchCategory): Promise<SearchResult>;
    getRecentSearches(): Promise<string[]>;
    addRecentSearch(query: string): Promise<string[]>;
    removeRecentSearch(query: string): Promise<string[]>;
    clearRecentSearches(): Promise<void>;
}

export class MockSearchRepository implements ISearchRepository {
    private recentSearches: string[] = ['Sahil', 'Engineering', 'Architecture', 'UI/UX', 'Release'];

    async search(query: string, category: SearchCategory = 'All'): Promise<SearchResult> {
        const q = query.trim().toLowerCase();
        if (!q) {
            return { people: [], conversations: [], messages: [], media: [], files: [] };
        }

        const allMessages: MockMessage[] = Object.values(mockMessages).flat();

        const people =
            category === 'All' || category === 'People'
                ? mockUsers.filter(
                      (u) =>
                          u.name.toLowerCase().includes(q) ||
                          u.username.toLowerCase().includes(q) ||
                          (u.bio && u.bio.toLowerCase().includes(q))
                  )
                : [];

        const conversations =
            category === 'All' || category === 'Messages'
                ? mockConversations.filter(
                      (c) =>
                          c.name.toLowerCase().includes(q) ||
                          c.lastMessage.toLowerCase().includes(q)
                  )
                : [];

        const messages =
            category === 'All' || category === 'Messages'
                ? allMessages.filter(
                      (m) => m.text && m.text.toLowerCase().includes(q) && m.type === 'text'
                  )
                : [];

        const media =
            category === 'All' || category === 'Media'
                ? allMessages.filter(
                      (m) =>
                          m.type === 'image' &&
                          (m.text ? m.text.toLowerCase().includes(q) : true)
                  )
                : [];

        const files =
            category === 'All' || category === 'Files'
                ? allMessages.filter(
                      (m) =>
                          m.type === 'file' &&
                          (m.fileName ? m.fileName.toLowerCase().includes(q) : true)
                  )
                : [];

        return { people, conversations, messages, media, files };
    }

    async getRecentSearches(): Promise<string[]> {
        return [...this.recentSearches];
    }

    async addRecentSearch(query: string): Promise<string[]> {
        const trimmed = query.trim();
        if (!trimmed) return this.recentSearches;
        this.recentSearches = [trimmed, ...this.recentSearches.filter((s) => s !== trimmed)].slice(0, 8);
        return [...this.recentSearches];
    }

    async removeRecentSearch(query: string): Promise<string[]> {
        this.recentSearches = this.recentSearches.filter((s) => s !== query);
        return [...this.recentSearches];
    }

    async clearRecentSearches(): Promise<void> {
        this.recentSearches = [];
    }
}

export const searchRepository = new MockSearchRepository();
export default searchRepository;
