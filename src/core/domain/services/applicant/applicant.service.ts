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
    GetUserApplicationsResponse,
} from "../../../../infrastructure/driven/response-dtos/applicant.response-dto";
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
                    400,
                    "Program Cycle Not Found",
                    "Conflict Error"
                );
            }

            const existingApplication =
                await this.applicationAggregateRepository.findUserCycleApplication(
                    userId,
                    cycle.id
                );

            if (!existingApplication) {
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

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
