import { MockUserProfile, mockUsers } from '../mock/users';

export type PresenceStatus = 'online' | 'away' | 'dnd' | 'offline';

export interface UserPresence {
    status: PresenceStatus;
    customStatus?: string;
    customEmoji?: string;
    lastSeen?: string;
}

export interface IUserRepository {
    getCurrentUser(): Promise<MockUserProfile>;
    getUserById(id: string): Promise<MockUserProfile | undefined>;
    updateProfile(data: Partial<MockUserProfile>): Promise<MockUserProfile>;
    updatePresence(presence: UserPresence): Promise<MockUserProfile>;
    blockUser(userId: string): Promise<void>;
    reportUser(userId: string, reason: string): Promise<void>;
}

export class MockUserRepository implements IUserRepository {
    private users: MockUserProfile[] = [...mockUsers];
    private currentUser: MockUserProfile = { ...mockUsers[0] };
    private presence: UserPresence = {
        status: 'online',
        customStatus: 'Building Pulse Chat 🚀',
        customEmoji: '⚡'
    };
    private blockedUserIds: string[] = [];

    async getCurrentUser(): Promise<MockUserProfile> {
        return { ...this.currentUser };
    }

    async getUserById(id: string): Promise<MockUserProfile | undefined> {
        return this.users.find((u) => u.id === id);
    }

    async updateProfile(data: Partial<MockUserProfile>): Promise<MockUserProfile> {
        this.currentUser = { ...this.currentUser, ...data };
        return { ...this.currentUser };
    }

    async updatePresence(presence: UserPresence): Promise<MockUserProfile> {
        this.presence = presence;
        this.currentUser.status = presence.status === 'offline' ? 'offline' : 'online';
        return { ...this.currentUser };
    }

    async getPresence(): Promise<UserPresence> {
        return { ...this.presence };
    }

    async blockUser(userId: string): Promise<void> {
        if (!this.blockedUserIds.includes(userId)) {
            this.blockedUserIds.push(userId);
        }
    }

    async reportUser(userId: string, reason: string): Promise<void> {
        // Mock report submission
    }
}

export const userRepository = new MockUserRepository();
export default userRepository;
