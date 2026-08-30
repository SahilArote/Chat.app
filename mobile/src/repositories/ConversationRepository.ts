import { MockConversation, mockConversations } from '../mock/conversations';

export interface IConversationRepository {
    getConversations(filter?: string): Promise<MockConversation[]>;
    getConversationById(id: string): Promise<MockConversation | undefined>;
    togglePin(id: string): Promise<MockConversation>;
    toggleMute(id: string): Promise<MockConversation>;
    toggleArchive(id: string): Promise<MockConversation>;
    markAsRead(id: string): Promise<MockConversation>;
    deleteConversation(id: string): Promise<void>;
}

export class MockConversationRepository implements IConversationRepository {
    private data: MockConversation[] = [...mockConversations];

    async getConversations(filter: string = 'All'): Promise<MockConversation[]> {
        return new Promise((resolve) => {
            let result = this.data.filter((c) => !c.isArchived);

            if (filter === 'Direct') {
                result = result.filter((c) => c.type === 'direct');
            } else if (filter === 'Groups') {
                result = result.filter((c) => c.type === 'group');
            } else if (filter === 'Unread') {
                result = result.filter((c) => c.unreadCount > 0);
            } else if (filter === 'Pinned') {
                result = result.filter((c) => c.isPinned);
            } else if (filter === 'Archived') {
                result = this.data.filter((c) => c.isArchived);
            }

            // Pinned chats appear at top
            result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

            resolve(result);
        });
    }

    async getConversationById(id: string): Promise<MockConversation | undefined> {
        return this.data.find((c) => c.id === id);
    }

    async togglePin(id: string): Promise<MockConversation> {
        const item = this.data.find((c) => c.id === id);
        if (!item) throw new Error('Conversation not found');
        item.isPinned = !item.isPinned;
        return { ...item };
    }

    async toggleMute(id: string): Promise<MockConversation> {
        const item = this.data.find((c) => c.id === id);
        if (!item) throw new Error('Conversation not found');
        item.isMuted = !item.isMuted;
        return { ...item };
    }

    async toggleArchive(id: string): Promise<MockConversation> {
        const item = this.data.find((c) => c.id === id);
        if (!item) throw new Error('Conversation not found');
        item.isArchived = !item.isArchived;
        return { ...item };
    }

    async markAsRead(id: string): Promise<MockConversation> {
        const item = this.data.find((c) => c.id === id);
        if (!item) throw new Error('Conversation not found');
        item.unreadCount = item.unreadCount > 0 ? 0 : 1;
        return { ...item };
    }

    async deleteConversation(id: string): Promise<void> {
        this.data = this.data.filter((c) => c.id !== id);
    }
}

export const conversationRepository = new MockConversationRepository();
export default conversationRepository;
