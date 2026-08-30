export type GroupMemberRole = 'owner' | 'admin' | 'member';

export interface MockGroupMember {
    userId: string;
    name: string;
    username: string;
    avatar?: string;
    role: GroupMemberRole;
    status: 'online' | 'offline';
    joinedAt: string;
}

export interface MockGroup {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    isChannel: boolean; // Channel / Broadcast mode
    onlyAdminsCanPost: boolean;
    onlyAdminsCanEditInfo: boolean;
    createdAt: string;
    createdBy: string;
    members: MockGroupMember[];
}

export const mockGroups: Record<string, MockGroup> = {
    conv_2: {
        id: 'conv_2',
        name: 'Pulse Engineering Core',
        description: 'Official development guild for Pulse Chat. Architecture, code reviews, and releases.',
        avatar: undefined,
        isChannel: false,
        onlyAdminsCanPost: false,
        onlyAdminsCanEditInfo: true,
        createdAt: '2026-08-01T10:00:00Z',
        createdBy: 'user_sahil',
        members: [
            {
                userId: 'user_sahil',
                name: 'Sahil Arote',
                username: 'sahil.arote',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                role: 'owner',
                status: 'online',
                joinedAt: 'Aug 1, 2026'
            },
            {
                userId: 'user_alex',
                name: 'Alex Rivera',
                username: 'alex.rivera',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                role: 'admin',
                status: 'online',
                joinedAt: 'Aug 2, 2026'
            },
            {
                userId: 'user_sarah',
                name: 'Sarah Jenkins',
                username: 'sarah.jenkins',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                role: 'member',
                status: 'offline',
                joinedAt: 'Aug 5, 2026'
            },
            {
                userId: 'user_david',
                name: 'David Kim',
                username: 'david.kim',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                role: 'member',
                status: 'online',
                joinedAt: 'Aug 10, 2026'
            }
        ]
    },
    conv_5: {
        id: 'conv_5',
        name: 'Design & UI/UX Guild',
        description: 'Design system, Figma files, animations, and AMOLED theme discussions.',
        avatar: undefined,
        isChannel: true, // Announcement channel
        onlyAdminsCanPost: true,
        onlyAdminsCanEditInfo: true,
        createdAt: '2026-08-15T12:00:00Z',
        createdBy: 'user_alex',
        members: [
            {
                userId: 'user_alex',
                name: 'Alex Rivera',
                username: 'alex.rivera',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                role: 'owner',
                status: 'online',
                joinedAt: 'Aug 15, 2026'
            },
            {
                userId: 'user_sahil',
                name: 'Sahil Arote',
                username: 'sahil.arote',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                role: 'member',
                status: 'online',
                joinedAt: 'Aug 15, 2026'
            }
        ]
    }
};

export default mockGroups;
