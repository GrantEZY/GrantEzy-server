import {TestingModule, Test} from "@nestjs/testing";
import {ApplicantService} from "./applicant.service";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {
    applicationsArray,
    budgetAndTechnicalDetails,
    cycleData,
    dummyApplicantData,
    revenueDetails,
    riskAndMileStones,
    saved_Application,
} from "./applicant.service.mock.data";
import ApiError from "../../../../shared/errors/api.error";
import {GrantApplicationStatus} from "../../constants/status.constants";
describe("Applicant ", () => {
    let applicationService: ApplicantService;
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let cycleAggregateRepository: jest.Mocked<CycleAggregatePort>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicantService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
            ],
        }).compile();

        applicationService = moduleReference.get(ApplicantService);
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;
        cycleAggregateRepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;
    });

    it("to be Defined", () => {
        expect(applicationService).toBeDefined();
    });

    describe("Create Application", () => {
        it("Successful creation of application", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                cycleData as any
            );

            applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                null
            );

            applicationAggregateRepository.save.mockResolvedValue(
                saved_Application as any
            );

            const result = await applicationService.createApplication(
                "userid",
                dummyApplicantData
            );

            expect(result).toEqual({
                status: 201,
                message: "Application Registered Successfully",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Cycle Not Found", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    null
                );

                await applicationService.createApplication(
                    "userid",
                    dummyApplicantData
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Program Cycle Not Found"
                );
            }
        });

        it("User Already  already has a application", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    cycleData as any
                );

                applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.createApplication(
                    "userid",
                    dummyApplicantData
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "User Already have a application registered"
                );
            }
        });
    });

    describe("Get User Applications", () => {
        it("Get User Applications", async () => {
            applicationAggregateRepository.getUserApplications.mockResolvedValueOnce(
                applicationsArray as any
            );

            const result =
                await applicationService.getUserApplications("user-id");

            expect(result).toEqual({
                status: 200,
                message: "User Applications",
                res: {
                    applications: applicationsArray,
                },
            });
        });
    });

    describe("Delete User Application", () => {
        it("Successful deletion of the application", async () => {
            (saved_Application as any).applicantId = "uuid";

            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            applicationAggregateRepository.deleteApplication.mockResolvedValue(
                saved_Application as any
            );

            const result = await applicationService.deleteApplication(
                "uuid",
                "applicationId"
            );

            expect(result).toEqual({
                status: 200,
                message: "Application Deleted Successfully",
                res: {
                    success: true,
                    applicationId: saved_Application.id,
                },
            });
        });

        it("Application Not found", async () => {
            try {
                applicationAggregateRepository.findById.mockResolvedValue(null);
                await applicationService.deleteApplication(
                    "uuid",
                    "applicationId"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application not found"
                );
            }
        });

        it("In review Application cant be deleted", async () => {
            try {
                (saved_Application as any).status =
                    GrantApplicationStatus.IN_REVIEW;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.deleteApplication(
                    "uuid",
                    "applicationId"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "In review application cant be deleted"
                );
            }
        });

        it("Only Applicant can delete the application", async () => {
            try {
                (saved_Application as any).status =
                    GrantApplicationStatus.DRAFT;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.deleteApplication(
                    "uuid1",
                    "applicationId"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Application can be only deleted by the applicant"
                );
            }
        });
    });

    describe("Add Application Budget Details", () => {
        it("Successful Add Budget Details", async () => {
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );
            applicationAggregateRepository.addApplicationBudgetDetails.mockResolvedValue(
                saved_Application as any
            );
            const result = await applicationService.addApplicationBudgetDetails(
                "uuid",
                budgetAndTechnicalDetails
            );

            expect(result).toEqual({
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Application not found", async () => {
            try {
                applicationAggregateRepository.findById.mockResolvedValue(null);
                await applicationService.addApplicationBudgetDetails(
                    "uuid",
                    budgetAndTechnicalDetails
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application  Not Found"
                );
            }
        });

        it("User can't update the application", async () => {
            try {
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationBudgetDetails(
                    "uuid1",
                    budgetAndTechnicalDetails
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });
    });

    describe("Add Revenue Details", () => {
        it("Successful add application revenue details", async () => {
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );
            applicationAggregateRepository.addApplicationRevenueStream.mockResolvedValue(
                saved_Application as any
            );
            const result = await applicationService.addApplicationRevenueStream(
                "uuid",
                revenueDetails as any
            );

            expect(result).toEqual({
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Application not found", async () => {
            try {
                applicationAggregateRepository.findById.mockResolvedValue(null);
                await applicationService.addApplicationRevenueStream(
                    "uuid",
                    revenueDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application  Not Found"
                );
            }
        });

        it("User can't update the application", async () => {
            try {
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationRevenueStream(
                    "uuid1",
                    revenueDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });
    });

    describe("Add Risks and MileStones", () => {
        it("Successful add application risk and milestones", async () => {
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );
            applicationAggregateRepository.addApplicationRisksAndMileStones.mockResolvedValue(
                saved_Application as any
            );

            const result = await applicationService.AddRisksAndMileStones(
                "uuid",
                riskAndMileStones as any
            );

            expect(result).toEqual({
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Application not found", async () => {
            try {
                applicationAggregateRepository.findById.mockResolvedValue(null);
                await applicationService.AddRisksAndMileStones(
                    "uuid",
                    revenueDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application  Not Found"
                );
            }
        });

        it("User can't update the application", async () => {
            try {
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.AddRisksAndMileStones(
                    "uuid1",
                    revenueDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });
    });
});
