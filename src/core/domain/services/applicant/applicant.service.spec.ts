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
    addApplicationTeamMates,
    applicationDocuments,
    applicationsArray,
    applicationTechnicalAndMarketInfoDetails,
    budgetAndTechnicalDetails,
    cycleData,
    dummyApplicantData,
    InviteArray,
    revenueDetails,
    riskAndMileStones,
    saved_Application,
    SAVED_CYCLE,
    SAVED_USER,
} from "./applicant.service.mock.data";
import ApiError from "../../../../shared/errors/api.error";
import {GrantApplicationStatus} from "../../constants/status.constants";
import {UserSharedService} from "../shared/user/shared.user.service";
import {
    USER_INVITE_AGGREGATE_PORT,
    UserInviteAggregatePort,
} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {CycleInviteQueue} from "../../../../infrastructure/driven/queue/queues/cycle.invite.queue";
describe("Applicant ", () => {
    let applicationService: ApplicantService;
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let cycleAggregateRepository: jest.Mocked<CycleAggregatePort>;
    let userinviteAggregateRepository: jest.Mocked<UserInviteAggregatePort>;
    let userSharedService: jest.Mocked<UserSharedService>;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let cycleInviteQueue: jest.Mocked<CycleInviteQueue>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicantService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: CycleInviteQueue,
                    useValue: createMock<CycleInviteQueue>(),
                },
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
                {
                    provide: UserSharedService,
                    useValue: createMock<UserSharedService>(),
                },
                {
                    provide: USER_INVITE_AGGREGATE_PORT,
                    useValue: createMock<UserInviteAggregatePort>(),
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
        userSharedService = moduleReference.get(
            UserSharedService
        ) as jest.Mocked<UserSharedService>;
        userinviteAggregateRepository = moduleReference.get(
            USER_INVITE_AGGREGATE_PORT
        ) as jest.Mocked<UserInviteAggregatePort>;
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;

        cycleInviteQueue = moduleReference.get(
            CycleInviteQueue
        ) as jest.Mocked<CycleInviteQueue>;
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

            userSharedService.addUserRole.mockResolvedValue(true);

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

    describe("Add Application Budget Details", () => {
        it("Successful Add Budget Details", async () => {
            saved_Application.stepNumber = 1;
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );
            applicationAggregateRepository.addApplicationBudgetDetails.mockResolvedValue(
                saved_Application as any
            );
            const result = await applicationService.addApplicationBudgetDetails(
                "uuid",
                budgetAndTechnicalDetails as any
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
                    budgetAndTechnicalDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application  Not Found"
                );
            }
        });

        it("Application Order Not Followed", async () => {
            try {
                saved_Application.stepNumber = 0;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationBudgetDetails(
                    "uuid",
                    budgetAndTechnicalDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Application  Order not  Followed"
                );
            }
        });

        it("User can't update the application", async () => {
            try {
                saved_Application.stepNumber = 1;

                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationBudgetDetails(
                    "uuid1",
                    budgetAndTechnicalDetails as any
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

    describe("Add Technical and MarketInfo", () => {
        it("Successful Addition of technical And Market Info", async () => {
            saved_Application.stepNumber = 2;
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            applicationAggregateRepository.addApplicationTechnicalAndMarketInfo.mockResolvedValue(
                saved_Application as any
            );
            const result =
                await applicationService.addApplicationTechnicalAndMarketInfo(
                    "uuid",
                    applicationTechnicalAndMarketInfoDetails as any
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
                await applicationService.addApplicationTechnicalAndMarketInfo(
                    "uuid",
                    applicationTechnicalAndMarketInfoDetails as any
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
                saved_Application.stepNumber = 1;

                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationTechnicalAndMarketInfo(
                    "uuid1",
                    applicationTechnicalAndMarketInfoDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });

        it("Application Order Not Followed", async () => {
            try {
                saved_Application.stepNumber = 0;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationTechnicalAndMarketInfo(
                    "uuid",
                    applicationTechnicalAndMarketInfoDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Application  Order not  Followed"
                );
            }
        });
    });

    describe("Add Revenue Details", () => {
        it("Successful add application revenue details", async () => {
            saved_Application.stepNumber = 3;
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

        it("Application order not followed", async () => {
            try {
                saved_Application.stepNumber = 2;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationRevenueStream(
                    "uuid",
                    revenueDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Application  Order not  Followed"
                );
            }
        });
    });

    describe("Add Risks and MileStones", () => {
        it("Successful add application risk and milestones", async () => {
            saved_Application.stepNumber = 4;
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

        it("Application order not followed", async () => {
            try {
                saved_Application.stepNumber = 2;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.AddRisksAndMileStones(
                    "uuid",
                    revenueDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Application  Order not  Followed"
                );
            }
        });
    });

    describe("ApplicationDocuments", () => {
        it("Successfully Add Application Documents", async () => {
            saved_Application.stepNumber = 5;

            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            applicationAggregateRepository.addApplicationDocuments.mockResolvedValue(
                saved_Application as any
            );

            const result = await applicationService.addApplicationDocuments(
                "uuid",
                applicationDocuments
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
                await applicationService.addApplicationDocuments(
                    "uuid",
                    applicationDocuments as any
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

                await applicationService.addApplicationDocuments(
                    "uuid1",
                    applicationDocuments as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });

        it("Application order not followed", async () => {
            try {
                saved_Application.stepNumber = 2;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationDocuments(
                    "uuid",
                    applicationDocuments as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Application  Order not  Followed"
                );
            }
        });
    });

    describe("Application Teammates Invite", () => {
        it("Successful teammates invite with draft", async () => {
            saved_Application.stepNumber = 6;

            userAggregateRepository.findById.mockResolvedValue(
                SAVED_USER as any
            );
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            userinviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                InviteArray as any
            );
            cycleAggregateRepository.findById.mockResolvedValue(
                SAVED_CYCLE as any
            );

            cycleInviteQueue.UserCycleInvite.mockResolvedValue({
                status: true,
            } as any);
            const result = await applicationService.addApplicationTeamMates(
                "uuid",
                addApplicationTeamMates
            );
            expect(
                applicationAggregateRepository.modifyApplicationStatus
            ).toHaveBeenCalledTimes(0);
            expect(result).toEqual({
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Successful teammates invite with submission", async () => {
            saved_Application.stepNumber = 6;

            userAggregateRepository.findById.mockResolvedValue(
                SAVED_USER as any
            );
            addApplicationTeamMates.isSubmitted = true;
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            userinviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                InviteArray as any
            );

            applicationAggregateRepository.modifyApplicationStatus.mockResolvedValue(
                saved_Application as any
            );
            cycleInviteQueue.UserCycleInvite.mockResolvedValue({
                status: true,
            } as any);
            cycleAggregateRepository.findById.mockResolvedValue(
                SAVED_CYCLE as any
            );
            const result = await applicationService.addApplicationTeamMates(
                "uuid",
                addApplicationTeamMates
            );

            expect(
                applicationAggregateRepository.modifyApplicationStatus
            ).toHaveBeenCalled();
            expect(result).toEqual({
                status: 200,
                message: "Application details added Successfully",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("User Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(null);
                await applicationService.addApplicationTeamMates(
                    "uuid",
                    addApplicationTeamMates
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("Application not found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                applicationAggregateRepository.findById.mockResolvedValue(null);
                await applicationService.addApplicationTeamMates(
                    "uuid",
                    addApplicationTeamMates as any
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
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationTeamMates(
                    "uuid1",
                    addApplicationTeamMates as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });

        it("Application order not followed", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                saved_Application.stepNumber = 2;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.addApplicationDocuments(
                    "uuid",
                    applicationDocuments as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Application  Order not  Followed"
                );
            }
        });

        it("Cycle Not Found", async () => {
            try {
                saved_Application.stepNumber = 6;

                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                userinviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                    InviteArray as any
                );
                cycleAggregateRepository.findById.mockResolvedValue(null);

                await applicationService.addApplicationDocuments(
                    "uuid",
                    applicationDocuments as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Cycle Not Found");
            }
        });

        it("Applicant cant be a CoApplicant", async () => {
            try {
                const teamMatesDetails = JSON.parse(
                    JSON.stringify(addApplicationTeamMates)
                );
                teamMatesDetails.emails.push("john.doe@example.com");
                saved_Application.stepNumber = 6;

                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                addApplicationTeamMates.isSubmitted = true;
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                userinviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                    InviteArray as any
                );

                applicationAggregateRepository.modifyApplicationStatus.mockResolvedValue(
                    saved_Application as any
                );
                cycleInviteQueue.UserCycleInvite.mockResolvedValue({
                    status: true,
                } as any);
                cycleAggregateRepository.findById.mockResolvedValue(
                    SAVED_CYCLE as any
                );
                await applicationService.addApplicationTeamMates(
                    "uuid",
                    addApplicationTeamMates
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Applicant cant be invited as CoApplicant"
                );
            }
        });

        it("Error in inviting Users", async () => {
            try {
                saved_Application.stepNumber = 6;

                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                userinviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                    InviteArray as any
                );
                cycleAggregateRepository.findById.mockResolvedValue(
                    SAVED_CYCLE as any
                );

                cycleInviteQueue.UserCycleInvite.mockResolvedValue({
                    status: false,
                } as any);
                await applicationService.addApplicationDocuments(
                    "uuid",
                    applicationDocuments as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(500);
                expect((error as ApiError).message).toBe(
                    "Error in sending Invite to the user"
                );
            }
        });
    });

    describe("Get User Applications", () => {
        it("Get User Applications", async () => {
            userAggregateRepository.getUserApplication.mockResolvedValue({
                myApplications: applicationsArray as any,
                linkedApplications: applicationsArray as any,
            } as any);

            const result =
                await applicationService.getUserApplications("user-id");

            expect(result).toEqual({
                status: 200,
                message: "User Applications",
                res: {
                    myApplications: applicationsArray,
                    linkedApplications: applicationsArray,
                },
            });
        });

        it("User Not Found", async () => {
            try {
                userAggregateRepository.getUserApplication.mockResolvedValue(
                    null
                );

                await applicationService.getUserApplications("user-id");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });
    });

    describe("GetApplicationDetailsWithCycle", () => {
        it("Successful fetch", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                SAVED_CYCLE as any
            );

            applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                saved_Application as any
            );

            const result =
                await applicationService.getApplicationDetailsWithCycle(
                    "user-id",
                    "cycleslug"
                );

            expect(result).toEqual({
                status: 200,
                message: "Application Cycle Details",
                res: {
                    cycle: saved_Application.cycle,
                    applicationDetails: saved_Application,
                },
            });
        });

        it("Application Not Found", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                SAVED_CYCLE as any
            );

            applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                null
            );

            const result =
                await applicationService.getApplicationDetailsWithCycle(
                    "user-id",
                    "cycleslug"
                );

            expect(result).toEqual({
                status: 200,
                message: "Cycle Details",
                res: {
                    cycle: SAVED_CYCLE,
                    applicationDetails: null,
                },
            });
        });

        it("Cycle Not Found", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    null
                );

                await applicationService.getApplicationDetailsWithCycle(
                    "user-id",
                    "cycleslug"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Cycle Not Found");
            }
        });
    });

    describe("Get User Created Application Details", () => {
        it("SuccessFul Application Fetch", async () => {
            applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                saved_Application as any
            );

            const result =
                await applicationService.getUserCreatedApplicationDetails(
                    "id",
                    "uuid"
                );

            expect(result).toEqual({
                status: 200,
                message: "User Application Fetch",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Application Not Found", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                    null
                );

                await applicationService.getUserCreatedApplicationDetails(
                    "id",
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

        it("User Not Allowed", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.getUserCreatedApplicationDetails(
                    "id",
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can get further details"
                );
            }
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
});
