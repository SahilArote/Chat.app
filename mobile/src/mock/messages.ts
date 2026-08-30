export type MessageType = 'text' | 'image' | 'audio' | 'file';

export interface MockMessageReply {
    messageId: string;
    senderName: string;
    text: string;
}

export interface MockMessageReaction {
    emoji: string;
    count: number;
    userReacted: boolean;
}

export interface MockMessage {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    type: MessageType;
    text?: string;
    mediaUrl?: string;
    fileSize?: string;
    fileName?: string;
    audioDuration?: string;
    timestamp: string;
    createdAt: string; // ISO date for date grouping
    status: 'sending' | 'sent' | 'delivered' | 'read';
    replyTo?: MockMessageReply;
    reactions?: MockMessageReaction[];
}

export const mockMessages: Record<string, MockMessage[]> = {
    conv_1: [
        {
            id: 'msg_101',
            conversationId: 'conv_1',
            senderId: 'user_alex',
            senderName: 'Alex Rivera',
            type: 'text',
            text: 'Hey Sahil! Did you check the new gesture animations in Phase 2?',
            timestamp: '12:40 PM',
            createdAt: '2026-08-30T12:40:00Z',
            status: 'read'
        },
        {
            id: 'msg_102',
            conversationId: 'conv_1',
            senderId: 'user_sahil',
            senderName: 'Sahil Arote',
            type: 'text',
            text: 'Yes! The 60fps physics curves feel super responsive on Android 🔥',
            timestamp: '12:41 PM',
            createdAt: '2026-08-30T12:41:00Z',
            status: 'read',
            replyTo: {
                messageId: 'msg_101',
                senderName: 'Alex Rivera',
                text: 'Hey Sahil! Did you check the new gesture animations in Phase 2?'
            },
            reactions: [{ emoji: '🔥', count: 2, userReacted: true }]
        },
        {
            id: 'msg_103',
            conversationId: 'conv_1',
            senderId: 'user_alex',
            senderName: 'Alex Rivera',
            type: 'image',
            text: 'Check out this design mockup for the chat header & action sheet!',
            mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
            timestamp: '12:43 PM',
            createdAt: '2026-08-30T12:43:00Z',
            status: 'read'
        },
        {
            id: 'msg_104',
            conversationId: 'conv_1',
            senderId: 'user_alex',
            senderName: 'Alex Rivera',
            type: 'text',
            text: 'Check out the new haptic feedback animations!',
            timestamp: '12:45 PM',
            createdAt: '2026-08-30T12:45:00Z',
            status: 'delivered'
        }
    ],
    conv_2: [
        {
            id: 'msg_201',
            conversationId: 'conv_2',
            senderId: 'user_sarah',
            senderName: 'Sarah Jenkins',
            type: 'text',
            text: 'Good morning engineering team! Today we finalize Phase 6 & 7.',
            timestamp: '10:00 AM',
            createdAt: '2026-08-30T10:00:00Z',
            status: 'read'
        },
        {
            id: 'msg_202',
            conversationId: 'conv_2',
            senderId: 'user_david',
            senderName: 'David Kim',
            type: 'text',
            text: 'Redis clustering test passed with 0 latency spike ⚡',
            timestamp: '11:20 AM',
            createdAt: '2026-08-30T11:20:00Z',
            status: 'read',
            reactions: [{ emoji: '🚀', count: 3, userReacted: false }]
        }
    ]
};

export default mockMessages;
