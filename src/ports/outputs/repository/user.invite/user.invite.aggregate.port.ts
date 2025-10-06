import {UserInvite} from "../../../../core/domain/aggregates/user.invite.aggregate";
import {InviteStatus} from "../../../../core/domain/constants/invite.constants";
export interface UserInviteAggregatePort {
    addTeamMatesInvites(
        applicationId: string,
        email: string[]
    ): Promise<Record<string, string>>;

    getUserInvite(tokenHash: string): Promise<UserInvite | null>;

    updateUserInviteStatus(
        invite: UserInvite,
        status: InviteStatus
    ): Promise<boolean>;
}

export const USER_INVITE_AGGREGATE_PORT = Symbol("UserInviteAggregatePort");
