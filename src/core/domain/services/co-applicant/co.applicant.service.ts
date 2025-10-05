import {Injectable, Inject} from "@nestjs/common";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {CoApplicantApplicationResponse} from "../../../../infrastructure/driven/response-dtos/co.applicant.response-dto";
import {InviteAs} from "../../constants/invite.constants";

/**
 * This file contains the co applicant service for viewing the application
 */
@Injectable()
export class CoApplicantService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationAggregateRepository: GrantApplicationAggregatePort
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

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
