import { MockGroup, MockGroupMember, mockGroups, GroupMemberRole } from '../mock/groups';

export interface IGroupRepository {
    getGroupById(id: string): Promise<MockGroup | undefined>;
    addMembers(groupId: string, newMembers: MockGroupMember[]): Promise<MockGroup>;
    removeMember(groupId: string, userId: string): Promise<MockGroup>;
    updateMemberRole(groupId: string, userId: string, role: GroupMemberRole): Promise<MockGroup>;
    updateGroupInfo(groupId: string, name: string, description: string): Promise<MockGroup>;
    updatePermissions(groupId: string, onlyAdminsCanPost: boolean, onlyAdminsCanEditInfo: boolean): Promise<MockGroup>;
    createGroup(group: Partial<MockGroup>): Promise<MockGroup>;
    leaveGroup(groupId: string, userId: string): Promise<void>;
    deleteGroup(groupId: string): Promise<void>;
}

export class MockGroupRepository implements IGroupRepository {
    private data: Record<string, MockGroup> = { ...mockGroups };

    async getGroupById(id: string): Promise<MockGroup | undefined> {
        return this.data[id];
    }

    async addMembers(groupId: string, newMembers: MockGroupMember[]): Promise<MockGroup> {
        const group = this.data[groupId];
        if (!group) throw new Error('Group not found');

        for (const m of newMembers) {
            if (!group.members.some((existing) => existing.userId === m.userId)) {
                group.members.push(m);
            }
        }
        return { ...group };
    }

    async removeMember(groupId: string, userId: string): Promise<MockGroup> {
        const group = this.data[groupId];
        if (!group) throw new Error('Group not found');
        group.members = group.members.filter((m) => m.userId !== userId);
        return { ...group };
    }

    async updateMemberRole(groupId: string, userId: string, role: GroupMemberRole): Promise<MockGroup> {
        const group = this.data[groupId];
        if (!group) throw new Error('Group not found');
        const member = group.members.find((m) => m.userId === userId);
        if (member) {
            member.role = role;
        }
        return { ...group };
    }

    async updateGroupInfo(groupId: string, name: string, description: string): Promise<MockGroup> {
        const group = this.data[groupId];
        if (!group) throw new Error('Group not found');
        group.name = name;
        group.description = description;
        return { ...group };
    }

    async updatePermissions(
        groupId: string,
        onlyAdminsCanPost: boolean,
        onlyAdminsCanEditInfo: boolean
    ): Promise<MockGroup> {
        const group = this.data[groupId];
        if (!group) throw new Error('Group not found');
        group.onlyAdminsCanPost = onlyAdminsCanPost;
        group.onlyAdminsCanEditInfo = onlyAdminsCanEditInfo;
        return { ...group };
    }

    async createGroup(data: Partial<MockGroup>): Promise<MockGroup> {
        const id = `conv_${Date.now()}`;
        const newGroup: MockGroup = {
            id,
            name: data.name || 'New Group',
            description: data.description || '',
            isChannel: data.isChannel || false,
            onlyAdminsCanPost: data.onlyAdminsCanPost || false,
            onlyAdminsCanEditInfo: data.onlyAdminsCanEditInfo || true,
            createdAt: new Date().toISOString(),
            createdBy: data.createdBy || 'user_sahil',
            members: data.members || []
        };
        this.data[id] = newGroup;
        return newGroup;
    }

    async leaveGroup(groupId: string, userId: string): Promise<void> {
        await this.removeMember(groupId, userId);
    }

    async deleteGroup(groupId: string): Promise<void> {
        delete this.data[groupId];
    }
}

export const groupRepository = new MockGroupRepository();
export default groupRepository;
