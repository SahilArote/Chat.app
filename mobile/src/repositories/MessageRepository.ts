import { MockMessage, mockMessages } from '../mock/messages';

export interface IMessageRepository {
    getMessages(conversationId: string): Promise<MockMessage[]>;
    sendMessage(conversationId: string, message: Partial<MockMessage>): Promise<MockMessage>;
    deleteMessage(conversationId: string, messageId: string): Promise<void>;
    toggleReaction(conversationId: string, messageId: string, emoji: string): Promise<MockMessage>;
}

export class MockMessageRepository implements IMessageRepository {
    private data: Record<string, MockMessage[]> = { ...mockMessages };

    async getMessages(conversationId: string): Promise<MockMessage[]> {
        return new Promise((resolve) => {
            const list = this.data[conversationId] || [];
            // Sort ascending by time
            resolve([...list]);
        });
    }

    async sendMessage(conversationId: string, msg: Partial<MockMessage>): Promise<MockMessage> {
        if (!this.data[conversationId]) {
            this.data[conversationId] = [];
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMessage: MockMessage = {
            id: `msg_${Date.now()}`,
            conversationId,
            senderId: msg.senderId || 'user_sahil',
            senderName: msg.senderName || 'Sahil Arote',
            type: msg.type || 'text',
            text: msg.text,
            mediaUrl: msg.mediaUrl,
            fileSize: msg.fileSize,
            fileName: msg.fileName,
            audioDuration: msg.audioDuration,
            timestamp: timeStr,
            createdAt: now.toISOString(),
            status: 'delivered',
            replyTo: msg.replyTo,
            reactions: []
        };

        this.data[conversationId].push(newMessage);
        return newMessage;
    }

    async deleteMessage(conversationId: string, messageId: string): Promise<void> {
        if (this.data[conversationId]) {
            this.data[conversationId] = this.data[conversationId].filter((m) => m.id !== messageId);
        }
    }

    async toggleReaction(conversationId: string, messageId: string, emoji: string): Promise<MockMessage> {
        const list = this.data[conversationId] || [];
        const msg = list.find((m) => m.id === messageId);
        if (!msg) throw new Error('Message not found');

        if (!msg.reactions) msg.reactions = [];
        const existing = msg.reactions.find((r) => r.emoji === emoji);

        if (existing) {
            if (existing.userReacted) {
                existing.count -= 1;
                existing.userReacted = false;
                if (existing.count <= 0) {
                    msg.reactions = msg.reactions.filter((r) => r.emoji !== emoji);
                }
            } else {
                existing.count += 1;
                existing.userReacted = true;
            }
        } else {
            msg.reactions.push({ emoji, count: 1, userReacted: true });
        }

        return { ...msg };
    }
}

export const messageRepository = new MockMessageRepository();
export default messageRepository;
