import {Injectable, Inject} from "@nestjs/common";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../../ports/outputs/crypto/hash.port";
import {
    UserInviteAggregatePort,
    USER_INVITE_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {GrantApplication} from "../../../aggregates/grantapplication.aggregate";
import {UserInvite} from "../../../aggregates/user.invite.aggregate";
import ApiError from "../../../../../shared/errors/api.error";
import {InviteAs, InviteStatus} from "../../../constants/invite.constants";
import {GetUserInviteStatusDetailsResponse} from "../../../../../infrastructure/driven/response-dtos/shared.response-dto";
import {GrantApplicationStatus} from "../../../constants/status.constants";
@Injectable()
export class SharedApplicationService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationAggregateRepository: GrantApplicationAggregatePort,
        @Inject(PASSWORD_HASHER_PORT)
        private readonly hasherPort: PasswordHasherPort,
        @Inject(USER_INVITE_AGGREGATE_PORT)
        private readonly userInviteAggregateRepository: UserInviteAggregatePort
    ) {}

    async getTokenDetails(
        token: string,
        slug: string
    ): Promise<{application: GrantApplication; invite: UserInvite}> {
        try {
            const invite =
                await this.userInviteAggregateRepository.getUserInvite(
                    slug,
                    true
                );

            if (!invite) {
                throw new ApiError(404, "Invite Not Found", "Conflict Error");
            }
            const isValid = await this.hasherPort.compare(
                token,
                invite.verification.token ?? ""
            );

            if (!isValid) {
                throw new ApiError(404, "Token Not Valid", "Token Error");
            }

            if (invite.status != InviteStatus.SENT) {
                throw new ApiError(403, "Invite Not Valid", "Conflict Error");
            }

            const verification = invite.verification;

            if (verification.validTill < new Date()) {
                throw new ApiError(400, "Invite got expired", "Invite Error");
            }

            const application =
                await this.applicationAggregateRepository.findById(
                    invite.applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            return {
                application,
                invite,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getInviteResponse(
        token: string,
        slug: string,
        status: InviteStatus.ACCEPTED | InviteStatus.REJECTED,
        type: InviteAs
    ): Promise<GetUserInviteStatusDetailsResponse> {
        try {
            const invite =
                await this.userInviteAggregateRepository.getUserInvite(
                    slug,
                    true
                );

            if (!invite) {
                throw new ApiError(404, "Invite Not Found", "Conflict Error");
            }
            const isValid = await this.hasherPort.compare(
                token,
                invite.verification.token ?? ""
            );

            if (!isValid || !invite || invite.inviteAs != type) {
                throw new ApiError(404, "Token Not Valid", "Token Error");
            }

            if (invite.status != InviteStatus.SENT) {
                throw new ApiError(
                    403,
                    "Invite has already been handled",
                    "Conflict Error"
                );
            }

            const application =
                await this.applicationAggregateRepository.findById(
                    invite.applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            const isUpdateSuccess =
                await this.userInviteAggregateRepository.updateUserInviteStatus(
                    invite,
                    status
                );
            return {
                status: isUpdateSuccess,
                application,
                email: invite.email,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getCycleProjects(
        cycleId: string,
        page: number,
        numberOfResults: number
    ): Promise<GrantApplication[]> {
        try {
            const applications =
                await this.applicationAggregateRepository.getUserApplicationBasedOnStatus(
                    GrantApplicationStatus.APPROVED,
                    cycleId,
                    page,
                    numberOfResults
                );

            return applications;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProjectDetails(
        applicationId: string
    ): Promise<GrantApplication | null> {
        try {
            const application =
                await this.applicationAggregateRepository.getApplicationDetailsWithProject(
                    applicationId
                );

            return application;
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
