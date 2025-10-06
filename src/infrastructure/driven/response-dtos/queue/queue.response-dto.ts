export interface DefaultQueueResponse {
    name: string;
}
export class EmailResponse {
    status: boolean;
    queue: DefaultQueueResponse;
}

export class CycleInviteResponse {
    status: boolean;
    email: string;
    role: string;
    queue: DefaultQueueResponse;
}
