import {Injectable, Inject} from "@nestjs/common";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../../config/env/app.types";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";

import {
    USER_INVITE_AGGREGATE_PORT,
    UserInviteAggregatePort,
} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {CycleInviteQueue} from "../../../../infrastructure/driven/queue/queues/cycle.invite.queue";
import {ManageTeammateDTO} from "../../../../infrastructure/driving/dtos/applicant.dto";
import {InviteAs} from "../../constants/invite.constants";
import {UserRoles} from "../../constants/userRoles.constants";
import {ManageCoApplicantResponse} from "../../../../infrastructure/driven/response-dtos/co.applicant.response-dto";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
@Injectable()
export class ApplicantCfgService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationAggregateRepository: GrantApplicationAggregatePort,

        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort,

        @Inject(USER_INVITE_AGGREGATE_PORT)
        private readonly userInviteAggregateRepository: UserInviteAggregatePort,
        private readonly cycleInviteQueue: CycleInviteQueue,
        private readonly emailQueue: EmailQueue,
        private readonly configService: ConfigService<ConfigType>
    ) {}

    async addTeamMatesToApplication(
        teamMatesDetails: ManageTeammateDTO,
        userId: string
    ): Promise<ManageCoApplicantResponse> {
        try {
            const {applicationId, email} = teamMatesDetails;

            const user = await this.userAggregateRepository.findById(
                userId,
                false
            );

            if (!user) {
                throw new ApiError(404, "User Not Found", "Conflict Error");
            }

            if (email === user.contact.email) {
                throw new ApiError(
                    403,
                    "Applicant cant be invited as CoApplicant",
                    "Conflict Error"
                );
            }

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );
            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            if (application.applicantId !== userId) {
                throw new ApiError(
                    403,
                    "Only the applicant can add further details",
                    "Conflict Error"
                );
            }

            const emails = [email];

            const cycle = await this.cycleAggregateRepository.findById(
                application.cycleId
            );

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            const details =
                await this.userInviteAggregateRepository.addApplicationInvites(
                    applicationId,
                    emails,
                    InviteAs.TEAMMATE
                );

            const baseUrl = this.configService.get("app").CLIENT_URL;
            const userCycleInviteStatus =
                await this.cycleInviteQueue.UserCycleInvite({
                    email,
                    invitedBy: user.person.firstName,
                    inviteAs: InviteAs.TEAMMATE,
                    role: UserRoles.TEAM_MATE,
                    programName: cycle.program?.details.name ?? "Program",
                    round: cycle.round,
                    applicationName: application.basicDetails.title,
                    inviteUrl: `${baseUrl as string}/invite-accept-or-reject/${details[email][0]}/${details[email][1]}`,
                });
            if (!userCycleInviteStatus.status) {
                throw new ApiError(
                    500,
                    "Error in sending Invite to the user",
                    "Invite Error"
                );
            }

            return {
                status: 200,
                message: "Application TeamMate Invited",
                res: {
                    status: true,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async removeTeamMateFromApplication(
        teamMateDetails: ManageTeammateDTO,
        userId: string
    ): Promise<ManageCoApplicantResponse> {
        try {
            const {applicationId, email} = teamMateDetails;

            const user = await this.userAggregateRepository.findById(
                userId,
                false
            );

            if (!user) {
                throw new ApiError(404, "User Not Found", "Conflict Error");
            }

            if (email === user.contact.email) {
                throw new ApiError(
                    403,
                    "Applicant cant be removed from application",
                    "Conflict Error"
                );
            }

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );
            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            if (application.applicantId !== userId) {
                throw new ApiError(
                    403,
                    "Only the applicant can add further details",
                    "Conflict Error"
                );
            }

            const teamMate = await this.userAggregateRepository.findByEmail(
                email,
                false
            );

            if (!teamMate) {
                throw new ApiError(404, "TeamMate Not Found", "Conflict Error");
            }

            const isRelated =
                await this.applicationAggregateRepository.checkTeamMateApplication(
                    applicationId,
                    teamMate.personId
                );

            if (!isRelated) {
                throw new ApiError(
                    403,
                    "The Person is not a TeamMate",
                    "Conflict Error"
                );
            }

            const isRemoved =
                await this.applicationAggregateRepository.removeTeamMateFromApplication(
                    application,
                    teamMate.personId
                );

            if (!isRemoved) {
                throw new ApiError(
                    400,
                    "Error in Removing User",
                    "Conflict Error"
                );
            }

            const emailNotification =
                await this.emailQueue.removeTeamMateFromApplication(
                    {applicationName: application.basicDetails.title, email},
                    email
                );

            if (emailNotification.status) {
                return {
                    status: 200,
                    message: "Application TeamMate Removed",
                    res: {
                        status: true,
                    },
                };
            }

            throw new ApiError(400, "Error in Removing User", "Conflict Error");
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
