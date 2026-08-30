import { MockCall, mockCalls, CallType } from '../mock/calls';

export interface ICallRepository {
    getCalls(filter?: 'all' | 'missed'): Promise<MockCall[]>;
    getCallById(id: string): Promise<MockCall | undefined>;
    startCall(contactId: string, contactName: string, type: CallType, contactAvatar?: string): Promise<MockCall>;
    deleteCall(id: string): Promise<void>;
}

export class MockCallRepository implements ICallRepository {
    private calls: MockCall[] = [...mockCalls];

    async getCalls(filter: 'all' | 'missed' = 'all'): Promise<MockCall[]> {
        return new Promise((resolve) => {
            if (filter === 'missed') {
                resolve(this.calls.filter((c) => c.direction === 'missed'));
            } else {
                resolve([...this.calls]);
            }
        });
    }

    async getCallById(id: string): Promise<MockCall | undefined> {
        return this.calls.find((c) => c.id === id);
    }

    async startCall(
        contactId: string,
        contactName: string,
        type: CallType,
        contactAvatar?: string
    ): Promise<MockCall> {
        const newCall: MockCall = {
            id: `call_${Date.now()}`,
            contactId,
            contactName,
            contactAvatar,
            type,
            direction: 'outgoing',
            timestamp: 'Just now'
        };
        this.calls.unshift(newCall);
        return newCall;
    }

    async deleteCall(id: string): Promise<void> {
        this.calls = this.calls.filter((c) => c.id !== id);
    }
}

export const callRepository = new MockCallRepository();
export default callRepository;
