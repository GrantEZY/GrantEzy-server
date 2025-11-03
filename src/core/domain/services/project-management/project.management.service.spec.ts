import {Test, TestingModule} from "@nestjs/testing";
import {createMock} from "@golevelup/ts-jest";
import {
    GRANT_APPLICATION_AGGREGATE_PORT,
    GrantApplicationAggregatePort,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    ProjectAggregatePort,
    PROJECT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/project/project.aggregate.port";
import {ProjectManagementService} from "./project.management.service";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
import {
    createProjectData,
    dummyCycle,
    saved_Application,
    saved_project,
} from "./project.management.mock.data";
import ApiError from "../../../../shared/errors/api.error";
import {GrantApplicationStatus} from "../../constants/status.constants";
import {SharedApplicationService} from "../shared/application/shared.application.service";
describe("Project Management Service", () => {
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let projectAggregateRepository: jest.Mocked<ProjectAggregatePort>;
    let projectManagementService: ProjectManagementService;
    let emailQueue: jest.Mocked<EmailQueue>;
    let cycleAggregateRepository: jest.Mocked<CycleAggregatePort>;
    let sharedApplicationService: jest.Mocked<SharedApplicationService>;
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
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
                {
                    provide: SharedApplicationService,
                    useValue: createMock<SharedApplicationService>(),
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

        cycleAggregateRepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;

        sharedApplicationService = moduleReference.get(
            SharedApplicationService
        ) as jest.Mocked<SharedApplicationService>;
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
                    "Application is already a project"
                );
            }
        });
    });

    describe("Get Cycle Projects", () => {
        it("Successful Project Fetch", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                dummyCycle as any
            );

            sharedApplicationService.getCycleProjects.mockResolvedValue([
                saved_Application as any,
                saved_Application as any,
                saved_Application as any,
            ]);

            const result = await projectManagementService.getCycleProjects(
                {cycleSlug: "slug", page: 1, numberOfResults: 10},
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Cycle Projects",
                res: {
                    applications: [
                        saved_Application,
                        saved_Application,
                        saved_Application,
                    ],
                },
            });
        });

        it("Cycle Not Found", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    null
                );
                await projectManagementService.getCycleProjects(
                    {cycleSlug: "slug", page: 1, numberOfResults: 10},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Cycle Not Found");
            }
        });

        it("Only Program Manager Can Access The Service", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    dummyCycle as any
                );

                sharedApplicationService.getCycleProjects.mockResolvedValue([
                    saved_Application as any,
                    saved_Application as any,
                    saved_Application as any,
                ]);

                await projectManagementService.getCycleProjects(
                    {cycleSlug: "slug", page: 1, numberOfResults: 10},
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only Program Manager Can Access The Route"
                );
            }
        });
    });

    describe("Get Project Details", () => {
        it("SuccessFul Project Details Fetch", async () => {
            const newApplication = JSON.parse(
                JSON.stringify(saved_Application as any)
            );

            newApplication.status = GrantApplicationStatus.APPROVED;
            applicationAggregateRepository.getUserCreatedApplicationWithSlug.mockResolvedValue(
                newApplication
            );

            projectAggregateRepository.getProjectDetailsWithApplicationId.mockResolvedValue(
                saved_project as any
            );

            const result = await projectManagementService.getProjectDetails(
                {cycleSlug: "slug", applicationSlug: "appSlug"},
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Project Details",
                res: {
                    project: saved_project,
                },
            });
        });

        it("Application Not Found", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplicationWithSlug.mockResolvedValue(
                    null
                );
                await projectManagementService.getProjectDetails(
                    {cycleSlug: "slug", applicationSlug: "appSlug"},
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

        it("Cycle Slug didn't match", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplicationWithSlug.mockResolvedValue(
                    saved_Application as any
                );
                await projectManagementService.getProjectDetails(
                    {cycleSlug: "slug1", applicationSlug: "appSlug"},
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

        it("Application Is Not A Project", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplicationWithSlug.mockResolvedValue(
                    saved_Application as any
                );
                await projectManagementService.getProjectDetails(
                    {cycleSlug: "slug", applicationSlug: "appSlug"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Application Is Not a Project"
                );
            }
        });
    });
});
