import {Injectable, Inject} from "@nestjs/common";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {
    CoApplicantApplicationResponse,
    TokenVerificationResponse,
} from "../../../../infrastructure/driven/response-dtos/co.applicant.response-dto";
import {InviteAs} from "../../constants/invite.constants";
import {SharedApplicationService} from "../shared/application/shared.application.service";
/**
 * This file contains the co applicant service for viewing the application
 */
@Injectable()
export class CoApplicantService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationAggregateRepository: GrantApplicationAggregatePort,
        private readonly sharedApplicationService: SharedApplicationService
    ) {}

    async getApplicationDetails(
        applicationId: string,
        userId: string
    ): Promise<CoApplicantApplicationResponse> {
        try {
            const application =
                await this.applicationAggregateRepository.getUserCreatedApplication(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            const filter = application.teammates.filter(
                (teammate) => teammate.personId == userId
            );

            application.teamMateInvites = application.teamMateInvites.filter(
                (invite) => invite.inviteAs != InviteAs.REVIEWER
            );

            if (filter.length === 0) {
                throw new ApiError(
                    403,
                    "Only TeamMates Can View the Application",
                    "Conflict Error"
                );
            }

            return {
                status: 200,
                message: "Application Details for CoApplicant",
                res: {
                    application,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTokenDetails(token: string): Promise<TokenVerificationResponse> {
        try {
            const {application, invite} =
                await this.sharedApplicationService.getTokenDetails(token);

            return {
                status: 200,
                message: "Co Applicant Invite Details Fetch",
                res: {
                    invitedAt: invite.createdAt,
                    application: {
                        name: application.basicDetails.title,
                        problem: application.basicDetails.problem,
                    },
                },
            };
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
