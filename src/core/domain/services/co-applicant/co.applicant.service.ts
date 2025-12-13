import {Injectable, Inject} from "@nestjs/common";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {
    CoApplicantApplicationResponse,
    TokenVerificationResponse,
    UserInviteStatusUpdateResponse,
    GetProjectDetailsResponse,
    GetUserProjectsResponse,
} from "../../../../infrastructure/driven/response-dtos/co.applicant.response-dto";
import {InviteAs, InviteStatus} from "../../constants/invite.constants";
import {SharedApplicationService} from "../shared/application/shared.application.service";
import {SubmitInviteStatusDTO} from "../../../../infrastructure/driving/dtos/co.applicant.dto";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    ProjectAggregatePort,
    PROJECT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/project/project.aggregate.port";
/**
 * This file contains the co applicant service for viewing the application
 */
@Injectable()
export class CoApplicantService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationAggregateRepository: GrantApplicationAggregatePort,
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(PROJECT_AGGREGATE_PORT)
        private readonly projectAggregateRepository: ProjectAggregatePort,
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

    async getTokenDetails(
        token: string,
        slug: string
    ): Promise<TokenVerificationResponse> {
        try {
            const {application, invite} =
                await this.sharedApplicationService.getTokenDetails(
                    token,
                    slug
                );

            return {
                status: 200,
                message: "Co Applicant Invite Details Fetch",
                res: {
                    inviteAs: invite.inviteAs,
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

    async updateTeamMateInviteStatus(
        inviteStatus: SubmitInviteStatusDTO
    ): Promise<UserInviteStatusUpdateResponse> {
        try {
            const {
                status: isUpdated,
                application,
                email,
            } = await this.sharedApplicationService.getInviteResponse(
                inviteStatus.token,
                inviteStatus.slug,
                inviteStatus.status,
                InviteAs.TEAMMATE
            );

            if (!isUpdated) {
                throw new ApiError(
                    400,
                    "Error in Updating the User Invite Status",
                    "Conflict Error"
                );
            }

            if (inviteStatus.status == InviteStatus.ACCEPTED) {
                const user = await this.userAggregateRepository.findByEmail(
                    email,
                    false
                );

                if (!user) {
                    throw new ApiError(404, "User Not Found", "Conflict Error");
                }

                const updatedApplication =
                    await this.applicationAggregateRepository.addApplicationTeammates(
                        application,
                        [user]
                    );

                return {
                    status: 200,
                    message: "User TeamMate Status Updated",
                    res: {
                        applicationId: updatedApplication.id,
                        status: inviteStatus.status,
                    },
                };
            }

            return {
                status: 200,
                message: "User TeamMate Status Updated",
                res: {
                    applicationId: application.id,
                    status: inviteStatus.status,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getUserLinkedProjects(
        userId: string,
        page: number,
        numberOfResults: number
    ): Promise<GetUserProjectsResponse> {
        try {
            const applications =
                await this.userAggregateRepository.getUserLinkedProjects(
                    userId,
                    page,
                    numberOfResults
                );

            return {
                status: 200,
                message: "User Linked Projects",
                res: {applications},
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProjectDetails(
        applicationSlug: string,
        userId: string
    ): Promise<GetProjectDetailsResponse> {
        try {
            const application =
                await this.applicationAggregateRepository.getApplicationDetailsWithSlug(
                    applicationSlug
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

            if (filter.length === 0) {
                throw new ApiError(
                    403,
                    "User Not Linked With the Application",
                    "Conflict Error"
                );
            }

            const project =
                await this.projectAggregateRepository.getProjectDetailsWithApplicationId(
                    application.id
                );

            if (!project) {
                throw new ApiError(
                    404,
                    "Application Is Not A Project",
                    "Conflict Error"
                );
            }
            return {
                status: 200,
                message: "Project Details",
                res: {project},
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
