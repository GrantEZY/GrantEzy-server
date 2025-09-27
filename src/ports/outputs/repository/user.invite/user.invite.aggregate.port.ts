import {UserInvite} from "../../../../core/domain/aggregates/user.invite.aggregate";

export interface UserInviteAggregatePort {
    addTeamMatesInvites(
        applicationId: string,
        email: string[]
    ): Promise<UserInvite[]>;
}

export const USER_INVITE_AGGREGATE_PORT = Symbol("UserInviteAggregatePort");
