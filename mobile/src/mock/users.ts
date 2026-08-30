export interface MockUserProfile {
    id: string;
    username: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    status: 'online' | 'offline';
    lastSeen?: string;
}

export const mockUsers: MockUserProfile[] = [
    {
        id: 'user_sahil',
        username: 'sahil.arote',
        name: 'Sahil Arote',
        email: 'sahil@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Building Pulse Chat • Engineering Lead',
        status: 'online'
    },
    {
        id: 'user_alex',
        username: 'alex.rivera',
        name: 'Alex Rivera',
        email: 'alex@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Mobile UI/UX Designer & Reanimated enthusiast',
        status: 'online'
    },
    {
        id: 'user_sarah',
        username: 'sarah.jenkins',
        name: 'Sarah Jenkins',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bio: 'Product Manager • Pulse Core',
        status: 'offline',
        lastSeen: '15m ago'
    },
    {
        id: 'user_david',
        username: 'david.kim',
        name: 'David Kim',
        email: 'david@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        bio: 'Distributed Systems & Database Architect',
        status: 'online'
    },
    {
        id: 'user_elena',
        username: 'elena.rostova',
        name: 'Elena Rostova',
        email: 'elena@example.com',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        bio: 'Security & Cryptography Specialist',
        status: 'offline',
        lastSeen: '2h ago'
    },
    {
        id: 'user_marcus',
        username: 'marcus.vance',
        name: 'Marcus Vance',
        email: 'marcus@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'DevOps & Cloud Infrastructure',
        status: 'online'
    }
];

export default mockUsers;
