import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket.types';
import SocketEvents from '../socket.events';
import Conversation from '../../modules/conversations/conversation.model';

export const registerConversationHandlers = (io: Server, socket: AuthenticatedSocket): void => {
    const userId = socket.userId;
    const username = socket.username;
    if (!userId) return;

    socket.on(SocketEvents.JOIN_CONVERSATION, async (conversationId: string, ack?: (res: any) => void) => {
        try {
            const conversation = await Conversation.findOne({
                _id: conversationId,
                members: userId
            }).select('_id');

            if (!conversation) {
                const errorPayload = { message: 'Conversation not found or not a member' };
                socket.emit(SocketEvents.ERROR, errorPayload);
                if (ack) ack({ success: false, error: errorPayload.message });
                return;
            }

            socket.join(conversationId);
            socket.emit(SocketEvents.JOINED_CONVERSATION, { conversationId });
            if (ack) ack({ success: true, conversationId });

        } catch (err: any) {
            socket.emit(SocketEvents.ERROR, { message: err.message });
            if (ack) ack({ success: false, error: err.message });
        }
    });

    socket.on(SocketEvents.LEAVE_CONVERSATION, (conversationId: string) => {
        socket.leave(conversationId);
    });
};

export default registerConversationHandlers;
