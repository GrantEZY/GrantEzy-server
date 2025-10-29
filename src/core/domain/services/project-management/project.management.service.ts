import {Injectable, Inject} from "@nestjs/common";
import {
    ProjectAggregatePort,
    PROJECT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/project/project.aggregate.port";
import {
    GRANT_APPLICATION_AGGREGATE_PORT,
    GrantApplicationAggregatePort,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {CreateProjectDTO} from "../../../../infrastructure/driving/dtos/project.management.dto";
import {GrantApplicationStatus} from "../../constants/status.constants";
import {CreateProjectReponse} from "../../../../infrastructure/driven/response-dtos/project.management.response-dto";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
@Injectable()
export class ProjectManagementService {
    constructor(
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly grantApplicationRepository: GrantApplicationAggregatePort,

        @Inject(PROJECT_AGGREGATE_PORT)
        private readonly projectAggregateRepository: ProjectAggregatePort,
        private readonly emailQueue: EmailQueue
    ) {}

    async createProject(
        details: CreateProjectDTO,
        userId: string
    ): Promise<CreateProjectReponse> {
        try {
            const {applicationId} = details;
            const application =
                await this.grantApplicationRepository.getUserCreatedApplication(
                    applicationId
                );
            if (!application) {
                throw new ApiError(
                    400,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            const {cycle, applicant, teammates} = application;

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    400,
                    "Program Manager Only Can Access",
                    "Conflict Error"
                );
            }

            if (!cycle.isApplicationAccepted) {
                throw new ApiError(
                    403,
                    "The Cycle Is Not Converting Application To Program Anymore",
                    "Conflict Error"
                );
            }

            const project =
                await this.projectAggregateRepository.createProject(details);

            const updatedApplication =
                await this.grantApplicationRepository.modifyApplicationStatus(
                    application,
                    GrantApplicationStatus.APPROVED,
                    false
                );

            await this.emailQueue.createProjectEmailToQueue(
                [applicant, ...teammates],
                updatedApplication.basicDetails.title
            );

            return {
                status: 201,
                message: "Project Created",
                res: {
                    applicationId: application.id,
                    projectId: project.id,
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
