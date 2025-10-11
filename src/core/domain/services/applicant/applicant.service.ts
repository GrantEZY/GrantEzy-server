import {Injectable, Inject} from "@nestjs/common";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    AddApplicationRevenueStreamDTO,
    AddApplicationRisksAndMilestonesDTO,
    AddApplicationTeammatesDTO,
    AddApplicationTechnicalAndMarketInfoDTO,
    AddBudgetDetailsDTO,
    ApplicationDocumentsDTO,
    CreateApplicationControllerDTO,
} from "../../../../infrastructure/driving/dtos/applicant.dto";
import ApiError from "../../../../shared/errors/api.error";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    CreateApplicationResponse,
    DeleteApplicationResponse,
    GetApplicationWithCycleDetailsResponse,
    GetUserApplicationsResponse,
    GetUserCreatedApplicationResponse,
} from "../../../../infrastructure/driven/response-dtos/applicant.response-dto";
import {GrantApplicationStatus} from "../../constants/status.constants";
import {
    USER_INVITE_AGGREGATE_PORT,
    UserInviteAggregatePort,
} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";

import {UserSharedService} from "../shared/user/shared.user.service";
import {UserRoles} from "../../constants/userRoles.constants";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {CycleInviteQueue} from "../../../../infrastructure/driven/queue/queues/cycle.invite.queue";
import {InviteAs} from "../../constants/invite.constants";
@Injectable()
/**
 * This contains the services for application creation by the users
 */
export class ApplicantService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationAggregateRepository: GrantApplicationAggregatePort,

        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,

        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort,

        @Inject(USER_INVITE_AGGREGATE_PORT)
        private readonly userInviteAggregateRepository: UserInviteAggregatePort,
        private readonly sharedUserService: UserSharedService,
        private readonly cycleInviteQueue: CycleInviteQueue
    ) {}

    async createApplication(
        userId: string,
        applicationData: CreateApplicationControllerDTO
    ): Promise<CreateApplicationResponse> {
        try {
            const {cycleSlug, basicInfo} = applicationData;
            const cycle =
                await this.cycleAggregateRepository.findCycleByslug(cycleSlug);
            if (!cycle) {
                throw new ApiError(
                    404,
                    "Program Cycle Not Found",
                    "Conflict Error"
                );
            }

            const existingApplication =
                await this.applicationAggregateRepository.findUserCycleApplication(
                    userId,
                    cycle.id
                );

            if (existingApplication) {
                throw new ApiError(
                    409,
                    "User Already have a application registered",
                    "Conflict Error"
                );
            }

            const application = await this.applicationAggregateRepository.save({
                userId,
                basicInfo,
                cycleId: cycle.id,
            });

            await this.sharedUserService.addUserRole(
                userId,
                UserRoles.APPLICANT
            );

            return {
                status: 201,
                message: "Application Registered Successfully",
                res: {
                    application,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async addApplicationBudgetDetails(
        userId: string,
        budgetDetails: AddBudgetDetailsDTO
    ): Promise<CreateApplicationResponse> {
        try {
            const {applicationId} = budgetDetails;

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application  Not Found",
                    "Conflict Error"
                );
            }

            if (application.stepNumber < 1) {
                throw new ApiError(
                    400,
                    "Application  Order not  Followed",
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

            const updatedApplication =
                await this.applicationAggregateRepository.addApplicationBudgetDetails(
                    application,
                    budgetDetails,
                    application.stepNumber == 1
                );

            return {
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: updatedApplication,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async addApplicationTechnicalAndMarketInfo(
        userId: string,
        technicalAndMarketDetails: AddApplicationTechnicalAndMarketInfoDTO
    ): Promise<CreateApplicationResponse> {
        try {
            const {applicationId} = technicalAndMarketDetails;

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application  Not Found",
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

            if (application.stepNumber < 2) {
                throw new ApiError(
                    400,
                    "Application  Order not  Followed",
                    "Conflict Error"
                );
            }

            const updatedApplication =
                await this.applicationAggregateRepository.addApplicationTechnicalAndMarketInfo(
                    application,
                    technicalAndMarketDetails,
                    application.stepNumber == 2
                );

            return {
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: updatedApplication,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async addApplicationRevenueStream(
        userId: string,
        revenueDetails: AddApplicationRevenueStreamDTO
    ): Promise<CreateApplicationResponse> {
        try {
            const {applicationId} = revenueDetails;

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application  Not Found",
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

            if (application.stepNumber < 3) {
                throw new ApiError(
                    400,
                    "Application  Order not  Followed",
                    "Conflict Error"
                );
            }

            const updatedApplication =
                await this.applicationAggregateRepository.addApplicationRevenueStream(
                    application,
                    revenueDetails,
                    application.stepNumber == 3
                );

            return {
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: updatedApplication,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async AddRisksAndMileStones(
        userId: string,
        risksAndMileStones: AddApplicationRisksAndMilestonesDTO
    ): Promise<CreateApplicationResponse> {
        try {
            const {applicationId} = risksAndMileStones;

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application  Not Found",
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

            if (application.stepNumber < 4) {
                throw new ApiError(
                    400,
                    "Application  Order not  Followed",
                    "Conflict Error"
                );
            }
            const updatedApplication =
                await this.applicationAggregateRepository.addApplicationRisksAndMileStones(
                    application,
                    risksAndMileStones,
                    application.stepNumber == 4
                );

            return {
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: updatedApplication,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async addApplicationDocuments(
        userId: string,
        documentDetails: ApplicationDocumentsDTO
    ): Promise<CreateApplicationResponse> {
        try {
            const {applicationId} = documentDetails;

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application  Not Found",
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

            if (application.stepNumber < 5) {
                throw new ApiError(
                    400,
                    "Application  Order not  Followed",
                    "Conflict Error"
                );
            }

            const updatedApplication =
                await this.applicationAggregateRepository.addApplicationDocuments(
                    application,
                    documentDetails,
                    application.stepNumber == 5
                );

            return {
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: updatedApplication,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async addApplicationTeamMates(
        userId: string,
        teammatesDetails: AddApplicationTeammatesDTO
    ): Promise<CreateApplicationResponse> {
        try {
            const {applicationId, emails, isSubmitted} = teammatesDetails;
            const user = await this.userAggregateRepository.findById(
                userId,
                false
            );

            if (!user) {
                throw new ApiError(404, "User Not Found", "Conflict Error");
            }

            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );
            if (!application) {
                throw new ApiError(
                    404,
                    "Application  Not Found",
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

            if (application.stepNumber < 6) {
                throw new ApiError(
                    400,
                    "Application  Order not  Followed",
                    "Conflict Error"
                );
            }

            const details =
                await this.userInviteAggregateRepository.addApplicationInvites(
                    applicationId,
                    emails,
                    InviteAs.TEAMMATE
                );

            const cycle = await this.cycleAggregateRepository.findById(
                application.cycleId
            );

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            if (emails.includes(user.contact.email)) {
                throw new ApiError(
                    403,
                    "Applicant cant be invited as CoApplicant",
                    "Conflict Error"
                );
            }
            for (const email of emails) {
                const userCycleInviteStatus =
                    await this.cycleInviteQueue.UserCycleInvite({
                        email,
                        invitedBy: user.person.firstName,
                        role: UserRoles.TEAM_MATE,
                        programName: cycle.program?.details.name ?? "Program",
                        round: cycle.round,
                        applicationName: application.basicDetails.title,
                        token: details[email] ?? null,
                    });
                if (!userCycleInviteStatus.status) {
                    throw new ApiError(
                        500,
                        "Error in sending Invite to the user",
                        "Invite Error"
                    );
                }
            }

            if (isSubmitted) {
                const finalSubmittedApplication =
                    await this.applicationAggregateRepository.modifyApplicationStatus(
                        application,
                        GrantApplicationStatus.SUBMITTED,
                        application.stepNumber == 6
                    );

                return {
                    status: 200,
                    message: "Application details added Successfully",
                    res: {
                        application: finalSubmittedApplication,
                    },
                };
            }

            return {
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getUserApplications(
        userId: string
    ): Promise<GetUserApplicationsResponse> {
        try {
            const userDetails =
                await this.userAggregateRepository.getUserApplication(userId);

            if (!userDetails) {
                throw new ApiError(404, "User Not Found", "Conflict Error");
            }

            const {myApplications, linkedApplications} = userDetails;
            return {
                status: 200,
                message: "User Applications",
                res: {myApplications, linkedApplications},
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getApplicationDetailsWithCycle(
        userId: string,
        cycleSlug: string
    ): Promise<GetApplicationWithCycleDetailsResponse> {
        try {
            const cycle =
                await this.cycleAggregateRepository.findCycleByslug(cycleSlug);

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }
            const application =
                await this.applicationAggregateRepository.findUserCycleApplication(
                    userId,
                    cycle.id
                );
            if (!application) {
                return {
                    status: 200,
                    message: "Cycle Details",
                    res: {
                        cycle,
                        applicationDetails: null,
                    },
                };
            }
            application.teamMateInvites = application.teamMateInvites.filter(
                (teaminvite) => teaminvite.inviteAs != InviteAs.REVIEWER
            );
            return {
                status: 200,
                message: "Application Cycle Details",
                res: {
                    cycle: application.cycle,
                    applicationDetails: application,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getUserCreatedApplicationDetails(
        applicationId: string,
        userId: string
    ): Promise<GetUserCreatedApplicationResponse> {
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

            if (application.applicantId !== userId) {
                throw new ApiError(
                    403,
                    "Only the applicant can get further details",
                    "Conflict Error"
                );
            }

            application.teamMateInvites = application.teamMateInvites.filter(
                (teaminvite) => teaminvite.inviteAs != InviteAs.REVIEWER
            );

            return {
                status: 200,
                message: "User Application Fetch",
                res: {
                    application,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteApplication(
        userId: string,
        applicationId: string
    ): Promise<DeleteApplicationResponse> {
        try {
            const application =
                await this.applicationAggregateRepository.findById(
                    applicationId
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application not found",
                    "Conflict Error"
                );
            }

            if (application.status === GrantApplicationStatus.IN_REVIEW) {
                throw new ApiError(
                    400,
                    "In review application cant be deleted",
                    "Conflict Error"
                );
            }

            if (userId !== application.applicantId) {
                throw new ApiError(
                    403,
                    "Application can be only deleted by the applicant",
                    "Conflict Error"
                );
            }

            const deletedApplication =
                await this.applicationAggregateRepository.deleteApplication(
                    application
                );

            return {
                status: 200,
                message: "Application Deleted Successfully",
                res: {
                    success: true,
                    applicationId: deletedApplication.id,
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
