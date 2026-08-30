export type CallType = 'audio' | 'video';
export type CallDirection = 'incoming' | 'outgoing' | 'missed';

export interface MockCall {
    id: string;
    contactId: string;
    contactName: string;
    contactAvatar?: string;
    type: CallType;
    direction: CallDirection;
    timestamp: string;
    duration?: string;
}

export const mockCalls: MockCall[] = [
    {
        id: 'call_1',
        contactId: 'user_alex',
        contactName: 'Alex Rivera',
        contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        type: 'video',
        direction: 'incoming',
        timestamp: 'Today, 2:15 PM',
        duration: '14m 22s'
    },
    {
        id: 'call_2',
        contactId: 'user_sarah',
        contactName: 'Sarah Jenkins',
        contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        type: 'audio',
        direction: 'missed',
        timestamp: 'Today, 11:30 AM'
    },
    {
        id: 'call_3',
        contactId: 'user_david',
        contactName: 'David Kim',
        contactAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        type: 'audio',
        direction: 'outgoing',
        timestamp: 'Yesterday, 6:45 PM',
        duration: '5m 10s'
    },
    {
        id: 'call_4',
        contactId: 'user_elena',
        contactName: 'Elena Rostova',
        contactAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        type: 'video',
        direction: 'outgoing',
        timestamp: 'Aug 28, 4:20 PM',
        duration: '32m 04s'
    },
    {
        id: 'call_5',
        contactId: 'user_alex',
        contactName: 'Alex Rivera',
        contactAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        type: 'audio',
        direction: 'missed',
        timestamp: 'Aug 26, 9:15 AM'
    }
];

export default mockCalls;
