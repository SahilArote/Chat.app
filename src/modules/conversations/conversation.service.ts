import { Types } from 'mongoose';
import Conversation, { IConversationDocument } from './conversation.model';
import User from '../users/user.model';
import ApiError from '../../utils/ApiError';
import { ErrorCode } from '../../utils/errorCodes';

export class ConversationService {
    async createOrGetDM(currentUserId: Types.ObjectId | string, targetUserId: string): Promise<IConversationDocument> {
        if (!targetUserId) throw new ApiError(400, 'UserId is required', ErrorCode.BAD_REQUEST);

        if (targetUserId === currentUserId.toString()) {
            throw new ApiError(400, 'You cannot chat with yourself', ErrorCode.CANNOT_CHAT_WITH_SELF);
        }

        const otherUser = await User.findById(targetUserId);
        if (!otherUser) throw new ApiError(404, 'User not found', ErrorCode.USER_NOT_FOUND);

        let conversation = await Conversation.findOne({
            type: 'dm',
            members: { $all: [currentUserId, targetUserId] }
        })
        .populate('members', 'username avatar status lastSeen')
        .populate('lastMessage');

        if (!conversation) {
            const newConv = await Conversation.create({
                type: 'dm',
                members: [currentUserId, targetUserId]
            });

            conversation = await Conversation.findById(newConv._id)
                .populate('members', 'username avatar status lastSeen')
                .populate('lastMessage');
        }

        return conversation!;
    }

    async getMyConversations(userId: Types.ObjectId | string): Promise<IConversationDocument[]> {
        return await Conversation.find({
            members: userId,
            deletedFor: { $ne: userId }
        })
        .populate('members', 'username avatar status lastSeen')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });
    }

    async createGroup(creatorId: Types.ObjectId | string, name: string, members: string[]): Promise<IConversationDocument> {
        if (!name) throw new ApiError(400, 'Group name is required', ErrorCode.BAD_REQUEST);

        if (!members || !Array.isArray(members) || members.length < 2) {
            throw new ApiError(400, 'Group must have at least 2 other members', ErrorCode.BAD_REQUEST);
        }

        const allMembers = [...new Set([...members, creatorId.toString()])];

        const conversation = await Conversation.create({
            type: 'group',
            name,
            members: allMembers,
            admins: [creatorId]
        });

        const populated = await Conversation.findById(conversation._id)
            .populate('members', 'username avatar status lastSeen')
            .populate('admins', 'username avatar');

        return populated!;
    }

    async getConversationById(conversationId: string, userId: Types.ObjectId | string): Promise<IConversationDocument> {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: userId
        })
        .populate('members', 'username avatar status lastSeen')
        .populate('admins', 'username avatar')
        .populate('lastMessage');

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found', ErrorCode.CONVERSATION_NOT_FOUND);
        }

        return conversation;
    }

    async addMember(conversationId: string, adminId: Types.ObjectId | string, targetUserId: string): Promise<IConversationDocument> {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) throw new ApiError(404, 'Group not found', ErrorCode.CONVERSATION_NOT_FOUND);
        if (conversation.type !== 'group') throw new ApiError(400, 'Not a group', ErrorCode.BAD_REQUEST);

        const isAdmin = conversation.admins?.some(id => id.toString() === adminId.toString());
        if (!isAdmin) {
            throw new ApiError(403, 'Only admin can add members', ErrorCode.NOT_GROUP_ADMIN);
        }

        const isMember = conversation.members.some(id => id.toString() === targetUserId);
        if (isMember) {
            throw new ApiError(400, 'User is already a member', ErrorCode.ALREADY_GROUP_MEMBER);
        }

        conversation.members.push(new Types.ObjectId(targetUserId));
        await conversation.save();

        const updated = await Conversation.findById(conversation._id)
            .populate('members', 'username avatar status lastSeen');

        return updated!;
    }

    async removeMember(conversationId: string, adminId: Types.ObjectId | string, targetUserId: string): Promise<IConversationDocument> {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) throw new ApiError(404, 'Group not found', ErrorCode.CONVERSATION_NOT_FOUND);

        const isAdmin = conversation.admins?.some(id => id.toString() === adminId.toString());
        if (!isAdmin) {
            throw new ApiError(403, 'Only admin can remove members', ErrorCode.NOT_GROUP_ADMIN);
        }

        if (targetUserId === adminId.toString()) {
            throw new ApiError(400, 'Admin cannot remove themselves', ErrorCode.ADMIN_CANNOT_REMOVE_SELF);
        }

        conversation.members = conversation.members.filter(
            m => m.toString() !== targetUserId
        );
        await conversation.save();

        const updated = await Conversation.findById(conversation._id)
            .populate('members', 'username avatar status lastSeen');

        return updated!;
    }

    async deleteConversation(conversationId: string, userId: Types.ObjectId | string): Promise<void> {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: userId
        });

        if (!conversation) throw new ApiError(404, 'Conversation not found', ErrorCode.CONVERSATION_NOT_FOUND);

        if (!conversation.deletedFor) {
            conversation.deletedFor = [];
        }
        const alreadyDeleted = conversation.deletedFor.some(id => id.toString() === userId.toString());
        if (!alreadyDeleted) {
            conversation.deletedFor.push(new Types.ObjectId(userId.toString()));
            await conversation.save();
        }
    }
}

export const conversationService = new ConversationService();
export default conversationService;
