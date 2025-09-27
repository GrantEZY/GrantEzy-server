import {UserInviteAggregatePort} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {UserInvite} from "../../../../core/domain/aggregates/user.invite.aggregate";
import {
    InviteAs,
    InviteStatus,
} from "../../../../core/domain/constants/invite.constants";

@Injectable()
/**
 * This file contains the repo  structure for user invite aggregate
 */
export class UserInviteAggregateRepository implements UserInviteAggregatePort {
    constructor(
        @InjectRepository(UserInvite)
        private readonly userInviteRepository: Repository<UserInvite>
    ) {}

    /**
     *
     * @param applicationId applicationId of the application for which invite has been made
     * @param emails invitedTeamMatesEmail
     */
    async addTeamMatesInvites(
        applicationId: string,
        emails: string[]
    ): Promise<UserInvite[]> {
        try {
            const invites = await Promise.all(
                emails.map(async (email) => {
                    const invite = this.userInviteRepository.create({
                        applicationId,
                        email,
                        inviteAs: InviteAs.TEAMMATE,
                        status: InviteStatus.CREATED,
                    });
                    return await this.userInviteRepository.save(invite);
                })
            );

            return invites;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to invite users", "Database Error");
        }
    }
}
