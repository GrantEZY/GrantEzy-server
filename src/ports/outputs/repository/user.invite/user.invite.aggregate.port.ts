export interface UserInviteAggregatePort {
    addTeamMatesInvites(
        applicationId: string,
        email: string[]
    ): Promise<Record<string, string>>;
}

export const USER_INVITE_AGGREGATE_PORT = Symbol("UserInviteAggregatePort");
