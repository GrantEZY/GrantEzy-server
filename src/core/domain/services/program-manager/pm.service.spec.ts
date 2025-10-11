import {TestingModule, Test} from "@nestjs/testing";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {SharedProgramService} from "../shared/program/shared.program.service";
import ApiError from "../../../../shared/errors/api.error";
import {ProgramManagerService} from "./pm.service";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {CycleInviteQueue} from "../../../../infrastructure/driven/queue/queues/cycle.invite.queue";
import {
    UserInviteAggregatePort,
    USER_INVITE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {
    inputCycle,
    dummyCycle,
    SAVED_PROGRAM,
    CYCLES_ARRAY,
    saved_Application,
} from "./pm.service.mock.data";
describe("Program Manager Service", () => {
    let programManagerService: ProgramManagerService;
    let cycleAggregaterepository: jest.Mocked<CycleAggregatePort>;
    let programAggregaterepository: jest.Mocked<ProgramAggregatePort>;
    let userInviteAggregateRepository: jest.Mocked<UserInviteAggregatePort>;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let cycleInviteQueue: jest.Mocked<CycleInviteQueue>;
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let sharedProgramService: jest.Mocked<SharedProgramService>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ProgramManagerService,
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
                {
                    provide: SharedProgramService,
                    useValue: createMock<SharedProgramService>(),
                },
                {
                    provide: PROGRAM_AGGREGATE_PORT,
                    useValue: createMock<ProgramAggregatePort>(),
                },
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: USER_INVITE_AGGREGATE_PORT,
                    useValue: createMock<UserInviteAggregatePort>(),
                },
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: CycleInviteQueue,
                    useValue: createMock<CycleInviteQueue>(),
                },
            ],
        }).compile();

        programManagerService = moduleReference.get(ProgramManagerService);
        cycleAggregaterepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;
        userInviteAggregateRepository = moduleReference.get(
            USER_INVITE_AGGREGATE_PORT
        ) as jest.Mocked<UserInviteAggregatePort>;
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;
        cycleInviteQueue = moduleReference.get(
            CycleInviteQueue
        ) as jest.Mocked<CycleInviteQueue>;
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;

        programAggregaterepository = moduleReference.get(
            PROGRAM_AGGREGATE_PORT
        ) as jest.Mocked<ProgramAggregatePort>;
        sharedProgramService = moduleReference.get(
            SharedProgramService
        ) as jest.Mocked<SharedProgramService>;
    });

    it("to be Defined", () => {
        expect(programManagerService).toBeDefined();
    });

    describe("Create Cycle", () => {
        it("Successful creation of cycle", async () => {
            programAggregaterepository.findById.mockResolvedValue(
                SAVED_PROGRAM as any
            );
            sharedProgramService.UpdateProgramDetails.mockResolvedValue(
                SAVED_PROGRAM as any
            );

            cycleAggregaterepository.getProgramCycleWithRound.mockResolvedValue(
                null
            );

            cycleAggregaterepository.save.mockResolvedValue(dummyCycle as any);
            inputCycle.budget.amount = 1;
            const result = await programManagerService.createCycle(
                inputCycle as any,
                "uuid"
            );

            programAggregaterepository.updateProgramStatus.mockResolvedValue(
                true
            );

            expect(result).toEqual({
                status: 201,
                message: "Cycle Created for Program",
                res: {
                    programId: SAVED_PROGRAM.id,
                    cycleId: dummyCycle.id,
                },
            });
        });

        it("Program not found while creation of cycle", async () => {
            try {
                programAggregaterepository.findById.mockResolvedValue(null);

                await programManagerService.createCycle(
                    inputCycle as any,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Program Not Found");
            }
        });

        it("Program Manager Not linked with the program", async () => {
            try {
                programAggregaterepository.findById.mockResolvedValue(
                    SAVED_PROGRAM as any
                );

                await programManagerService.createCycle(
                    inputCycle as any,
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only Program Manager Can Access And Create Cycles"
                );
            }
        });

        it("Program has already a cycle in the round", async () => {
            try {
                programAggregaterepository.findById.mockResolvedValue(
                    SAVED_PROGRAM as any
                );
                cycleAggregaterepository.getProgramCycleWithRound.mockResolvedValue(
                    dummyCycle as any
                );
                inputCycle.budget.amount = 10000000000000;
                await programManagerService.createCycle(
                    inputCycle as any,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "Program has a same cycle with round"
                );
            }
        });
        it("Quoted Budget more than allowed limit", async () => {
            try {
                programAggregaterepository.findById.mockResolvedValue(
                    SAVED_PROGRAM as any
                );
                cycleAggregaterepository.getProgramCycleWithRound.mockResolvedValue(
                    null
                );
                inputCycle.budget.amount = 10000000000000;
                await programManagerService.createCycle(
                    inputCycle as any,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Quoted Budget exceeds the available limit for the program"
                );
            }
        });
    });

    describe("Get Program Cycles", () => {
        it("should fetch program cycles successfully", async () => {
            const filter = {
                page: 1,
                numberOfResults: 5,
            };
            programAggregaterepository.getProgramByManagerId.mockResolvedValue(
                SAVED_PROGRAM as any
            );
            sharedProgramService.getProgramCycles.mockResolvedValue({
                cycles: CYCLES_ARRAY as any,
                totalNumberOfCycles: 2,
            });

            const result = await programManagerService.getProgramCycles(
                filter,
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Program Cycle fetched successfully",
                res: {
                    cycles: CYCLES_ARRAY,
                    totalNumberOfCycles: 2,
                },
            });
        });

        it("Program Manager Conflict Error", async () => {
            try {
                const filter = {
                    programId: "program-id",
                    page: 1,
                    numberOfResults: 5,
                };
                programAggregaterepository.getProgramByManagerId.mockResolvedValue(
                    null
                );
                sharedProgramService.getProgramCycles.mockResolvedValue({
                    cycles: CYCLES_ARRAY as any,
                    totalNumberOfCycles: 2,
                });

                await programManagerService.getProgramCycles(filter, "uuid1");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only Program Manager can access the Program"
                );
            }
        });
    });

    describe("Delete Cycles", () => {
        it("Delete Cycle Successful", async () => {
            cycleAggregaterepository.findById.mockResolvedValue(
                inputCycle as any
            );

            cycleAggregaterepository.deleteCycle.mockResolvedValue(true);

            const result = await programManagerService.deleteProgramCycle({
                cycleId: "asdfsd-id",
            });

            expect(result).toEqual({
                status: 200,
                message: "Cycle Deleted Successfully",
                res: {
                    status: true,
                },
            });
        });

        it("Cycle not found", async () => {
            try {
                cycleAggregaterepository.findById.mockResolvedValue(null);

                await programManagerService.deleteProgramCycle({
                    cycleId: "asdfsd-id",
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Cycle Already Deleted"
                );
            }
        });

        it("Cycle deletion db error", async () => {
            try {
                cycleAggregaterepository.findById.mockResolvedValue(
                    inputCycle as any
                );
                cycleAggregaterepository.deleteCycle.mockResolvedValue(false);

                await programManagerService.deleteProgramCycle({
                    cycleId: "asdfsd-id",
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Error in deleting cycle"
                );
            }
        });
    });

    describe("Update Cycle Details", () => {
        it("Update Cycle - success", async () => {
            const mockUpdatedCycle = {id: "cycle-123"};

            sharedProgramService.updateCycleDetails = jest
                .fn()
                .mockResolvedValue(mockUpdatedCycle);

            const updateDetails = {id: "cycle-123", budget: {amount: 5000}};

            const result = await programManagerService.updateCycle(
                updateDetails as any
            );

            expect(
                sharedProgramService.updateCycleDetails
            ).toHaveBeenCalledWith(updateDetails);

            expect(result).toEqual({
                status: 200,
                message: "Cycle  Details Updated",
                res: {
                    id: "cycle-123",
                    status: true,
                },
            });
        });
    });

    describe("GetCycleWithApplication", () => {
        it("Get Cycle Details", async () => {
            sharedProgramService.getCycleDetailsWithApplications.mockResolvedValue(
                dummyCycle as any
            );

            const result = await programManagerService.getCycleWithApplications(
                "cycleslug",
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Cycle Details With Applications",
                res: {
                    cycle: dummyCycle,
                },
            });
        });

        it("Cycle Not Found", async () => {
            try {
                sharedProgramService.getCycleDetailsWithApplications.mockResolvedValue(
                    null
                );

                await programManagerService.getCycleWithApplications(
                    "cycleslug",
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Cycle Not Found");
            }
        });

        it("Cycle Not Related For ProgramManager", async () => {
            try {
                sharedProgramService.getCycleDetailsWithApplications.mockResolvedValue(
                    dummyCycle as any
                );

                await programManagerService.getCycleWithApplications(
                    "cycleslug",
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only Program Manager can access the Program"
                );
            }
        });
    });

    describe("getApplicationDetails", () => {
        it("Get Application Details", async () => {
            sharedProgramService.getApplicationDetailsWithSlug.mockResolvedValue(
                saved_Application as any
            );

            const result = await programManagerService.getApplicationDetails(
                "cycleSlug",
                "appSlug",
                "uuid"
            );
            expect(result).toEqual({
                status: 200,
                message: "Cycle Details With Applications",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Cycle Not Available For the User", async () => {
            try {
                sharedProgramService.getApplicationDetailsWithSlug.mockResolvedValue(
                    saved_Application as any
                );

                await programManagerService.getApplicationDetails(
                    "cycleSlug",
                    "appSlug",
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only Program Manager can access the Program"
                );
            }
        });

        it("Application Not Found", async () => {
            try {
                sharedProgramService.getApplicationDetailsWithSlug.mockResolvedValue(
                    null
                );

                await programManagerService.getApplicationDetails(
                    "cycleSlug",
                    "appSlug",
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

        it("Application Cycle Mismatch", async () => {
            try {
                const application = JSON.parse(
                    JSON.stringify(saved_Application)
                );
                application.cycle.slug = "newSlug";
                sharedProgramService.getApplicationDetailsWithSlug.mockResolvedValue(
                    application as any
                );

                await programManagerService.getApplicationDetails(
                    "cycleSlug",
                    "appSlug",
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Application Doesn't Belongs to the Cycle"
                );
            }
        });
    });

    describe("Invite Reviewer For Application", () => {
        it("Invite Reviewer - success", async () => {
            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );
            userAggregateRepository.findById.mockResolvedValue({
                id: "uuid",
                person: {firstName: "John"},
            } as any);

            cycleAggregaterepository.findById.mockResolvedValue(
                dummyCycle as any
            );

            userInviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                {"inthrak04@gmail.com": "token"} as any
            );

            cycleInviteQueue.UserCycleInvite.mockResolvedValue({
                status: true,
            } as any);

            const result =
                await programManagerService.inviteReviewerForApplication(
                    {
                        applicationId: "uuid",
                        email: "inthrak04@gmail.com",
                    },
                    "uuid"
                );

            expect(result).toEqual({
                status: 200,
                message: "Reviewer Invited Successfully",
                res: {
                    email: "inthrak04@gmail.com",
                    applicationId: saved_Application.id,
                },
            });
        });
    });
});
