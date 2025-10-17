import {Injectable} from "@nestjs/common";
import {Inject} from "@nestjs/common";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetPMProgramCyclesDTO,
    InviteReviewerDTO,
} from "../../../../infrastructure/driving/dtos/pm.dto";
import ApiError from "../../../../shared/errors/api.error";
import {SharedProgramService} from "../shared/program/shared.program.service";
import {
    CreateCycleResponse,
    CreateReviewInviteResponse,
    DeleteCycleResponse,
    GetApplicationDetailsResponse,
    GetApplicationReviewsResponse,
    GetCycleDetailsResponse,
    GetProgramCyclesResponse,
    GetReviewDetailsResponse,
    UpdateCycleResponse,
} from "../../../../infrastructure/driven/response-dtos/pm.response-dto";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {
    UserInviteAggregatePort,
    USER_INVITE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {
    ReviewerAggregatePort,
    REVIEW_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/review/review.aggregate.port";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {UpdateCycleDTO} from "../../../../infrastructure/driving/dtos/shared/shared.program.dto";
import {ProgramStatus} from "../../constants/status.constants";
import {InviteAs} from "../../constants/invite.constants";
import {CycleInviteQueue} from "../../../../infrastructure/driven/queue/queues/cycle.invite.queue";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {UserRoles} from "../../constants/userRoles.constants";
@Injectable()
export class ProgramManagerService {
    constructor(
        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort,
        @Inject(PROGRAM_AGGREGATE_PORT)
        private readonly programAggregateRepository: ProgramAggregatePort,
        @Inject(USER_INVITE_AGGREGATE_PORT)
        private readonly userInviteAggregateRepository: UserInviteAggregatePort,
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationRepository: GrantApplicationAggregatePort,
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(REVIEW_AGGREGATE_PORT)
        private readonly reviewerAggregateRepository: ReviewerAggregatePort,
        private readonly sharedProgramService: SharedProgramService,
        private readonly cycleInviteQueue: CycleInviteQueue
    ) {}

    async createCycle(
        createCycle: CreateCycleDTO,
        userId: string
    ): Promise<CreateCycleResponse> {
        try {
            const {programId, budget, round} = createCycle;

            const program =
                await this.programAggregateRepository.findById(programId);

            if (!program) {
                throw new ApiError(404, "Program Not Found", "Program Error");
            }

            if (program.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Access And Create Cycles",
                    "Conflict Error"
                );
            }

            const isAlreadyCycle =
                await this.cycleAggregateRepository.getProgramCycleWithRound(
                    program.id,
                    round
                );

            if (isAlreadyCycle) {
                throw new ApiError(
                    409,
                    "Program has a same cycle with round",
                    "Conflict Error"
                );
            }
            const {amount, currency} = program.budget;
            if (amount < budget.amount) {
                throw new ApiError(
                    400,
                    "Quoted Budget exceeds the available limit for the program",
                    "Conflict Error"
                );
            }
            const updatedProgram =
                await this.sharedProgramService.UpdateProgramDetails({
                    id: program.id,
                    budget: {
                        amount: amount - budget.amount,
                        currency,
                    },
                });

            const cycle = await this.cycleAggregateRepository.save(createCycle);

            await this.programAggregateRepository.updateProgramStatus(
                updatedProgram,
                ProgramStatus.ACTIVE
            );

            return {
                status: 201,
                message: "Cycle Created for Program",
                res: {
                    programId: updatedProgram.id,
                    cycleId: cycle.id,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProgramCycles(
        getCycleDto: GetPMProgramCyclesDTO,
        userId: string
    ): Promise<GetProgramCyclesResponse> {
        try {
            const program =
                await this.programAggregateRepository.getProgramByManagerId(
                    userId
                );

            if (!program) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            const {cycles, totalNumberOfCycles} =
                await this.sharedProgramService.getProgramCycles({
                    programId: program.id,
                    page: getCycleDto.page,
                    numberOfResults: getCycleDto.numberOfResults,
                });

            return {
                status: 200,
                message: "Program Cycle fetched successfully",
                res: {
                    cycles,
                    totalNumberOfCycles,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateCycle(
        updateCycleInfo: UpdateCycleDTO
    ): Promise<UpdateCycleResponse> {
        try {
            const updatedCycle =
                await this.sharedProgramService.updateCycleDetails(
                    updateCycleInfo
                );

            return {
                status: 200,
                message: "Cycle  Details Updated",
                res: {
                    id: updatedCycle.id,
                    status: true,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteProgramCycle(
        deleteCycleDto: DeleteCycleDTO
    ): Promise<DeleteCycleResponse> {
        try {
            const {cycleId} = deleteCycleDto;

            const cycle = await this.cycleAggregateRepository.findById(cycleId);
            if (!cycle) {
                throw new ApiError(
                    404,
                    "Cycle Already Deleted",
                    "Conflict Error"
                );
            }

            const isDeleted =
                await this.cycleAggregateRepository.deleteCycle(cycleId);
            if (isDeleted) {
                return {
                    status: 200,
                    message: "Cycle Deleted Successfully",
                    res: {
                        status: true,
                    },
                };
            }
            throw new ApiError(
                400,
                "Error in deleting cycle",
                "Cycle Deletion Error"
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    async getCycleWithApplications(
        cycleSlug: string,
        userId: string
    ): Promise<GetCycleDetailsResponse> {
        try {
            const cycle =
                await this.sharedProgramService.getCycleDetailsWithApplications(
                    cycleSlug
                );

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            return {
                status: 200,
                message: "Cycle Details With Applications",
                res: {
                    cycle,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getApplicationDetails(
        cycleSlug: string,
        applicationSlug: string,
        userId: string
    ): Promise<GetApplicationDetailsResponse> {
        try {
            const application =
                await this.sharedProgramService.getApplicationDetailsWithSlug(
                    applicationSlug
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            if (application?.cycle.slug != cycleSlug) {
                throw new ApiError(
                    403,
                    "Application Doesn't Belongs to the Cycle",
                    "Conflict Error"
                );
            }
            const cycle = application.cycle;

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            return {
                status: 200,
                message: "Cycle Details With Applications",
                res: {
                    application,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async inviteReviewerForApplication(
        inviteDetails: InviteReviewerDTO,
        userId: string
    ): Promise<CreateReviewInviteResponse> {
        try {
            const {applicationId, email} = inviteDetails;

            const application =
                await this.applicationRepository.findById(applicationId);

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            const cycle = await this.cycleAggregateRepository.findById(
                application.cycleId
            );

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            const user = await this.userAggregateRepository.findById(
                userId,
                false
            );

            if (!user) {
                throw new ApiError(404, "User Not Found", "Conflict Error");
            }

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            // const isAlreadyInvited =
            //     await this.userInviteAggregateRepository.getUserInviteForApplication(
            //         email,
            //         application.id,
            //         InviteAs.REVIEWER
            //     );

            // if (isAlreadyInvited) {
            //     throw new ApiError(
            //         409,
            //         "Reviewer Already Invited for the Application",
            //         "Conflict Error"
            //     );
            // }

            const details =
                await this.userInviteAggregateRepository.addApplicationInvites(
                    application.id,
                    [email],
                    InviteAs.REVIEWER
                );

            const inviteResponse = await this.cycleInviteQueue.UserCycleInvite({
                email,
                invitedBy: user.person.firstName,
                role: UserRoles.REVIEWER,
                programName: cycle.program?.details.name ?? "Program",
                round: cycle.round,
                applicationName: application.basicDetails.title,
                token: details[email][0],
                slug: details[email][1],
            });

            if (!inviteResponse.status) {
                throw new ApiError(
                    500,
                    "Failed to send invite email",
                    "Server Error"
                );
            }

            return {
                status: 200,
                message: "Reviewer Invited Successfully",
                res: {
                    email,
                    applicationId: application.id,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getApplicationReviews(
        cycleSlug: string,
        applicationSlug: string,
        page: number,
        numberOfResults: number,
        userId: string
    ): Promise<GetApplicationReviewsResponse> {
        try {
            const application =
                await this.sharedProgramService.getApplicationDetailsWithSlug(
                    applicationSlug
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            if (application?.cycle.slug != cycleSlug) {
                throw new ApiError(
                    403,
                    "Application Doesn't Belongs to the Cycle",
                    "Conflict Error"
                );
            }
            const cycle = application.cycle;

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            const applicationReviews =
                await this.reviewerAggregateRepository.getApplicationReviews(
                    application.id,
                    page,
                    numberOfResults
                );

            return {
                status: 200,
                message: "Application Reviews Fetched Successfully",
                res: {
                    application,
                    reviews: applicationReviews,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getReviewDetails(
        cycleSlug: string,
        applicationSlug: string,
        reviewSlug: string,
        userId: string
    ): Promise<GetReviewDetailsResponse> {
        try {
            const application =
                await this.sharedProgramService.getApplicationDetailsWithSlug(
                    applicationSlug
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            if (application?.cycle.slug != cycleSlug) {
                throw new ApiError(
                    403,
                    "Application Doesn't Belongs to the Cycle",
                    "Conflict Error"
                );
            }
            const cycle = application.cycle;

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            const review =
                await this.reviewerAggregateRepository.findBySlug(reviewSlug);

            if (!review) {
                throw new ApiError(404, "Review Not Found", "Not Found");
            }

            return {
                status: 200,
                message: "Review Fetched Successfully",
                res: {
                    review,
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
