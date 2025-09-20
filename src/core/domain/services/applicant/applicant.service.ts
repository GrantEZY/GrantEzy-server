import {Injectable, Inject} from "@nestjs/common";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {CreateApplicationControllerDTO} from "../../../../infrastructure/driving/dtos/applicant.dto";
import ApiError from "../../../../shared/errors/api.error";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    CreateApplicationResponse,
    DeleteApplicationResponse,
    GetUserApplicationsResponse,
} from "../../../../infrastructure/driven/response-dtos/applicant.response-dto";
import {GrantApplicationStatus} from "../../constants/status.constants";
@Injectable()
/**
 * This contains the
 */
export class ApplicantService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationAggregateRepository: GrantApplicationAggregatePort,

        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort
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

    async getUserApplications(
        userId: string
    ): Promise<GetUserApplicationsResponse> {
        try {
            const applications =
                await this.applicationAggregateRepository.getUserApplications(
                    userId
                );

            return {
                status: 200,
                message: "User Applications",
                res: {applications},
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
