import {Test, TestingModule} from "@nestjs/testing";
import {createMock} from "@golevelup/ts-jest";
import {
    GRANT_APPLICATION_AGGREGATE_PORT,
    GrantApplicationAggregatePort,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    CycleAssessmentAggregatePort,
    CYCLE_ASSESSMENT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycleAssessment/cycle.assessment.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    CycleAssessmentCriteriaAggregatePort,
    CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycleAssessmentCriteria/cycle.assessment.criteria.aggregate.port";
import {
    ProjectAggregatePort,
    PROJECT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/project/project.aggregate.port";
import {ProjectManagementService} from "./project.management.service";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
import {
    createCriteriaData,
    createProjectData,
    dummyCycle,
    dummyCycleAssessmentCriteria,
    saved_Application,
    saved_Assessment,
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
    let criteriaRepository: jest.Mocked<CycleAssessmentCriteriaAggregatePort>;
    let assessmentRepository: jest.Mocked<CycleAssessmentAggregatePort>;
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
                {
                    provide: CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT,
                    useValue:
                        createMock<CycleAssessmentCriteriaAggregatePort>(),
                },
                {
                    provide: CYCLE_ASSESSMENT_AGGREGATE_PORT,
                    useValue: createMock<CycleAssessmentAggregatePort>(),
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
        criteriaRepository = moduleReference.get(
            CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT
        ) as jest.Mocked<CycleAssessmentCriteriaAggregatePort>;

        assessmentRepository = moduleReference.get(
            CYCLE_ASSESSMENT_AGGREGATE_PORT
        ) as jest.Mocked<CycleAssessmentAggregatePort>;
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

    describe("Create Cycle Criteria", () => {
        it("Successful creation of criteria", async () => {
            cycleAggregateRepository.findById.mockResolvedValue(
                dummyCycle as any
            );

            criteriaRepository.createCycleCriteria.mockResolvedValue(
                dummyCycleAssessmentCriteria as any
            );

            emailQueue.cycleReviewToQueue.mockResolvedValue({
                status: true,
            } as any);

            const result = await projectManagementService.createCycleCriteria(
                createCriteriaData,
                "uuid"
            );

            expect(result).toEqual({
                status: 201,
                message: "Criteria Created Successfully",
                res: {
                    criteriaName: dummyCycleAssessmentCriteria.name,
                },
            });
        });
    });

    describe("Get Cycle Details", () => {
        it("Get Cycle Criterias", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                dummyCycle as any
            );

            criteriaRepository.getCycleEvaluationCriterias.mockResolvedValue([
                dummyCycleAssessmentCriteria,
                dummyCycleAssessmentCriteria,
            ] as any);

            const result = await projectManagementService.getCycleCriteria(
                {cycleSlug: "slug"},
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Criterias For Cycle",
                res: {
                    criterias: [
                        dummyCycleAssessmentCriteria,
                        dummyCycleAssessmentCriteria,
                    ],
                },
            });
        });
    });

    describe("Get Applicant Project Cycle Reviews", () => {
        it("Successful fetch of cycle criterias", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                dummyCycle as any
            );

            const newApplication = JSON.parse(
                JSON.stringify(saved_Application)
            );

            newApplication.status = GrantApplicationStatus.APPROVED;

            applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                newApplication as any
            );

            criteriaRepository.getCycleEvaluationCriterias.mockResolvedValue([
                dummyCycleAssessmentCriteria,
                dummyCycleAssessmentCriteria,
            ] as any);

            const result =
                await projectManagementService.getUserProjectCycleCriteria(
                    {cycleSlug: "slug"},
                    "uuid"
                );

            expect(result).toEqual({
                status: 200,
                message: "Criterias For Cycle",
                res: {
                    criterias: [
                        dummyCycleAssessmentCriteria,
                        dummyCycleAssessmentCriteria,
                    ],
                },
            });
        });

        it("Cycle Not Found", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    null
                );

                await projectManagementService.getUserProjectCycleCriteria(
                    {cycleSlug: "slug"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Cycle Not Found");
            }
        });

        it("Application Not Found", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    dummyCycle as any
                );

                applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                    null
                );

                await projectManagementService.getUserProjectCycleCriteria(
                    {cycleSlug: "slug"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "User Doesn't have a project for this cycle"
                );
            }
        });

        it("Application Is Not Approved Or Archived ", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    dummyCycle as any
                );

                const newApplication = JSON.parse(
                    JSON.stringify(saved_Application)
                );

                newApplication.status = GrantApplicationStatus.REJECTED;

                applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                    newApplication
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Project wasn't should be active or successfully archived"
                );
            }
        });
    });

    describe(" Applicant Cycle Assessment Submission", () => {
        it("Success fetch of the details", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                dummyCycle as any
            );

            const newApplication = JSON.parse(
                JSON.stringify(saved_Application)
            );

            newApplication.status = GrantApplicationStatus.APPROVED;

            applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                newApplication as any
            );

            criteriaRepository.getCriteriaDetails.mockResolvedValue(
                dummyCycleAssessmentCriteria as any
            );

            assessmentRepository.getCriteriaWithCriteriaIdAndProjectId.mockResolvedValue(
                saved_Assessment as any
            );

            const result =
                await projectManagementService.getUserProjectReviewCriteria(
                    {cycleSlug: "slug", criteriaSlug: "slug"},
                    "uuid"
                );

            expect(result).toEqual({
                status: 200,
                message: "Project Cycle Review Details",
                res: {
                    criteria: dummyCycleAssessmentCriteria,
                    cycleSubmission: saved_Assessment,
                },
            });
        });

        it("Project Not Found", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    dummyCycle as any
                );

                applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                    saved_Application as any
                );

                await projectManagementService.getUserProjectReviewCriteria(
                    {cycleSlug: "slug", criteriaSlug: "slug"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Project wasn't should be active or successfully archived"
                );
            }
        });
    });
});
