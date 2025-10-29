import {Test, TestingModule} from "@nestjs/testing";
import {createMock} from "@golevelup/ts-jest";
import {
    GRANT_APPLICATION_AGGREGATE_PORT,
    GrantApplicationAggregatePort,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    ProjectAggregatePort,
    PROJECT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/project/project.aggregate.port";
import {ProjectManagementService} from "./project.management.service";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
import {
    createProjectData,
    saved_Application,
    saved_project,
} from "./project.management.mock.data";
import ApiError from "../../../../shared/errors/api.error";
import {GrantApplicationStatus} from "../../constants/status.constants";
describe("Project Management Service", () => {
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let projectAggregateRepository: jest.Mocked<ProjectAggregatePort>;
    let projectManagementService: ProjectManagementService;
    let emailQueue: jest.Mocked<EmailQueue>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectManagementService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: PROJECT_AGGREGATE_PORT,
                    useValue: createMock<ProjectAggregatePort>(),
                },
                {
                    provide: EmailQueue,
                    useValue: createMock<EmailQueue>(),
                },
            ],
        }).compile();

        projectManagementService = moduleReference.get(
            ProjectManagementService
        );
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;

        projectAggregateRepository = moduleReference.get(
            PROJECT_AGGREGATE_PORT
        ) as jest.Mocked<ProjectAggregatePort>;

        emailQueue = moduleReference.get(EmailQueue) as jest.Mocked<EmailQueue>;
    });

    it("to be Defined", () => {
        expect(projectManagementService).toBeDefined();
    });

    describe("Create Project For Application", () => {
        it("Successful Project Creation", async () => {
            applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                saved_Application as any
            );

            projectAggregateRepository.createProject.mockResolvedValue(
                saved_project as any
            );

            applicationAggregateRepository.modifyApplicationStatus.mockResolvedValue(
                saved_Application as any
            );

            emailQueue.createProjectEmailToQueue.mockResolvedValue({
                status: true,
            } as any);

            const result = await projectManagementService.createProject(
                createProjectData as any,
                "uuid"
            );

            expect(result).toEqual({
                status: 201,
                message: "Project Created",
                res: {
                    applicationId: saved_Application.id,
                    projectId: saved_project.id,
                },
            });
        });

        it("Application Not Found", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                    null
                );

                await projectManagementService.createProject(
                    createProjectData as any,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application Not Found"
                );
            }
        });

        it("Only Program Manager Do Project Conversion", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                    saved_Application as any
                );

                await projectManagementService.createProject(
                    createProjectData as any,
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Program Manager Only Can Access"
                );
            }
        });

        it("Project Already Created", async () => {
            try {
                const application = JSON.parse(
                    JSON.stringify(saved_Application)
                );
                application.status = GrantApplicationStatus.APPROVED;
                applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                    application as any
                );

                await projectManagementService.createProject(
                    createProjectData as any,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Application is already  a project"
                );
            }
        });
    });
});
