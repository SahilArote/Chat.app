export enum SocketEvents {
    // Connection & Presence
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',
    USER_ONLINE = 'user_online',
    USER_OFFLINE = 'user_offline',

    // Conversation Rooms
    JOIN_CONVERSATION = 'join_conversation',
    JOINED_CONVERSATION = 'joined_conversation',
    LEAVE_CONVERSATION = 'leave_conversation',

    // Messages
    SEND_MESSAGE = 'send_message',
    MESSAGE_RECEIVED = 'message_received',
    MESSAGE_READ = 'message_read',
    MARK_READ = 'mark_read',
    MESSAGE_REACTED = 'message_reacted',
    REACTION_UPDATED = 'reaction_updated',
    MESSAGE_DELETED = 'message_deleted',
    MESSAGE_DELETED_SYNC = 'message_deleted_sync',

    // Typing Indicators
    TYPING = 'typing',
    USER_TYPING = 'user_typing',
    STOP_TYPING = 'stop_typing',
    USER_STOP_TYPING = 'user_stop_typing',

    // System
    ERROR = 'error'
}

export default SocketEvents;
