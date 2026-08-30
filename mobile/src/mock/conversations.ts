export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface MockConversation {
    id: string;
    type: 'direct' | 'group';
    name: string;
    avatar?: string;
    lastMessage: string;
    lastMessageSenderId?: string;
    lastMessageTimestamp: string;
    unreadCount: number;
    isPinned: boolean;
    isMuted: boolean;
    isArchived: boolean;
    isTyping?: boolean;
    typingUserName?: string;
    lastMessageStatus?: MessageDeliveryStatus;
    participantIds: string[];
}

export const mockConversations: MockConversation[] = [
    {
        id: 'conv_1',
        type: 'direct',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        lastMessage: 'Check out the new haptic feedback animations!',
        lastMessageTimestamp: '12:45 PM',
        unreadCount: 3,
        isPinned: true,
        isMuted: false,
        isArchived: false,
        isTyping: true,
        typingUserName: 'Alex',
        lastMessageStatus: 'delivered',
        participantIds: ['user_sahil', 'user_alex']
    },
    {
        id: 'conv_2',
        type: 'group',
        name: 'Pulse Engineering Core',
        avatar: undefined,
        lastMessage: 'David: Redis clustering test passed with 0 latency spike ⚡',
        lastMessageTimestamp: '11:20 AM',
        unreadCount: 0,
        isPinned: true,
        isMuted: true,
        isArchived: false,
        lastMessageStatus: 'read',
        participantIds: ['user_sahil', 'user_alex', 'user_david', 'user_sarah']
    },
    {
        id: 'conv_3',
        type: 'direct',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        lastMessage: 'The interactive prototype review is scheduled for 3 PM.',
        lastMessageTimestamp: 'Yesterday',
        unreadCount: 1,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        lastMessageStatus: 'read',
        participantIds: ['user_sahil', 'user_sarah']
    },
    {
        id: 'conv_4',
        type: 'direct',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        lastMessage: 'I have pushed the migration scripts for user profiles.',
        lastMessageTimestamp: 'Yesterday',
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        lastMessageStatus: 'delivered',
        participantIds: ['user_sahil', 'user_david']
    },
    {
        id: 'conv_5',
        type: 'group',
        name: 'Design & UI/UX Guild',
        avatar: undefined,
        lastMessage: 'Elena: Dark mode contrast ratios look great on OLED',
        lastMessageTimestamp: 'Aug 28',
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        lastMessageStatus: 'sent',
        participantIds: ['user_sahil', 'user_alex', 'user_elena']
    },
    {
        id: 'conv_6',
        type: 'direct',
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        lastMessage: 'Docker multi-stage builds are cached and ready.',
        lastMessageTimestamp: 'Aug 27',
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        lastMessageStatus: 'read',
        participantIds: ['user_sahil', 'user_marcus']
    }
];

export default mockConversations;
