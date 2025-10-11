import {TestingModule, Test} from "@nestjs/testing";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/program/program.aggregate.port";
import {SharedProgramService} from "./shared.program.service";
import {createMock} from "@golevelup/ts-jest";
import {
    CYCLES_ARRAY,
    inputCycle,
    NEW_PROGRAM_DATA,
    PROGRAMS_ARRAY,
    saved_Application,
    SAVED_PROGRAM,
} from "./shared.program.mock.data";
import ApiError from "../../../../../shared/errors/api.error";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {dummyCycle} from "../../program-manager/pm.service.mock.data";
import {
    GRANT_APPLICATION_AGGREGATE_PORT,
    GrantApplicationAggregatePort,
} from "../../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
describe("Shared Program Service", () => {
    let programAggregateRepository: jest.Mocked<ProgramAggregatePort>;
    let sharedProgramService: SharedProgramService;
    let cycleAggregateRepository: jest.Mocked<CycleAggregatePort>;
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    beforeAll(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                SharedProgramService,
                {
                    provide: PROGRAM_AGGREGATE_PORT,
                    useValue: createMock<ProgramAggregatePort>(),
                },
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
            ],
        }).compile();

        programAggregateRepository = moduleReference.get(
            PROGRAM_AGGREGATE_PORT
        ) as jest.Mocked<ProgramAggregatePort>;
        sharedProgramService = moduleReference.get(SharedProgramService);
        cycleAggregateRepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;
    });

    describe("Get All Programs", () => {
        it("Retrieval of Programs with only pagination", async () => {
            const filter = {page: 1, numberOfResults: 10};
            programAggregateRepository.getPrograms.mockResolvedValue({
                programs: PROGRAMS_ARRAY as any,
                totalNumberOfPrograms: 3,
            } as any);

            const result = await sharedProgramService.getPrograms(
                filter as any
            );

            expect(result).toEqual({
                programs: PROGRAMS_ARRAY,
                totalNumberOfPrograms: 3,
            });
        });
    });

    describe("Update Programs", () => {
        it("Program Not Found", async () => {
            try {
                const programDetails = NEW_PROGRAM_DATA;
                programAggregateRepository.findById.mockResolvedValue(null);
                await sharedProgramService.UpdateProgramDetails({
                    id: "program-uuid",
                    ...programDetails,
                } as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe("Program Not Found");
            }
        });

        it("Already Organization has another program with same name", async () => {
            try {
                const programDetails = NEW_PROGRAM_DATA;
                programAggregateRepository.findById.mockResolvedValue(
                    SAVED_PROGRAM as any
                );

                programAggregateRepository.findByName.mockResolvedValue(
                    NEW_PROGRAM_DATA as any
                );
                await sharedProgramService.UpdateProgramDetails({
                    id: "program-uuid",
                    ...programDetails,
                } as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "The Organization already has a program with this name"
                );
            }
        });

        it("Already Organization has another program with same name", async () => {
            const programDetails = NEW_PROGRAM_DATA;
            programAggregateRepository.findById.mockResolvedValue(
                SAVED_PROGRAM as any
            );

            programAggregateRepository.findByName.mockResolvedValue(null);
            await sharedProgramService.UpdateProgramDetails({
                id: "program-uuid",
                ...programDetails,
            } as any);

            expect(programAggregateRepository.updateProgram).toHaveBeenCalled();
        });
    });

    describe("Get Program Cycle Details through slug", () => {
        it("return cycle based on slug ", async () => {
            const cycleSlug = "cycle slug";

            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                inputCycle as any
            );

            const result =
                await sharedProgramService.getProgramCycleDetails(cycleSlug);

            expect(result).toEqual(inputCycle);
        });
    });

    describe("Program Cycles", () => {
        it("get Program's  Cycles with their  Details", async () => {
            cycleAggregateRepository.findProgramCycles.mockResolvedValue({
                cycles: CYCLES_ARRAY as any,
                totalNumberOfCycles: 2,
            });

            const result = await sharedProgramService.getProgramCycles({
                programId: "prog-id",
                page: 1,
                numberOfResults: 10,
            });

            expect(result).toEqual({
                cycles: CYCLES_ARRAY,
                totalNumberOfCycles: 2,
            });
        });
    });

    describe("Update Cycle Details", () => {
        it("Update Details successful", async () => {
            cycleAggregateRepository.findById.mockResolvedValue(
                inputCycle as any
            );

            cycleAggregateRepository.updateCycle.mockResolvedValue({
                ...inputCycle,
                budget: {amount: 10000, currency: "USD"},
                duration: {
                    ...inputCycle.duration,
                    endDate: new Date("2025-09-30"),
                },
            } as any);

            cycleAggregateRepository.getProgramCycleWithRound.mockResolvedValue(
                null as any
            );

            const updateDetails = {
                id: inputCycle.id ?? "cycle-id",
                budget: {
                    amount: 10000,
                    currency: "USD",
                },
                duration: {
                    endDate: new Date("2025-09-30"),
                },
            };

            const result = await sharedProgramService.updateCycleDetails(
                updateDetails as any
            );

            expect(cycleAggregateRepository.findById).toHaveBeenCalledWith(
                inputCycle.id
            );
            expect(cycleAggregateRepository.updateCycle).toHaveBeenCalledWith(
                inputCycle,
                updateDetails
            );

            expect(result).toEqual(
                expect.objectContaining({
                    id: inputCycle.id,
                    budget: {amount: 10000, currency: "USD"},
                })
            );
        });

        it("Cycle Not found", async () => {
            try {
                cycleAggregateRepository.findById.mockResolvedValue(null);

                const updateDetails = {
                    budget: {
                        amount: 10000,
                    },
                    duration: {
                        endDate: new Date(),
                    },
                };
                await sharedProgramService.updateCycleDetails(
                    updateDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Program Cycle Not Found"
                );
            }
        });

        it("Program Already has a cycle in that round", async () => {
            try {
                cycleAggregateRepository.findById.mockResolvedValue(
                    dummyCycle as any
                );

                cycleAggregateRepository.getProgramCycleWithRound.mockResolvedValue(
                    dummyCycle as any
                );

                const updateDetails = {
                    budget: {
                        amount: 10000,
                    },
                    duration: {
                        endDate: new Date(),
                    },
                };
                await sharedProgramService.updateCycleDetails(
                    updateDetails as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "Program has a same cycle with round"
                );
            }
        });
    });

    describe("Get Cycle With Application", () => {
        it("Successful Cycle Fetch", async () => {
            cycleAggregateRepository.getCycleDetailsWithApplications.mockResolvedValue(
                dummyCycle as any
            );

            const result =
                await sharedProgramService.getCycleDetailsWithApplications(
                    "slug"
                );

            expect(result).toEqual(dummyCycle);
        });
    });

    describe("Get Application With Slug", () => {
        it("Successful Application Fetch", async () => {
            applicationAggregateRepository.getUserCreatedApplicationWithSlug.mockResolvedValue(
                saved_Application as any
            );

            const result =
                await sharedProgramService.getApplicationDetailsWithSlug(
                    "slug"
                );

            expect(result).toEqual(saved_Application);
        });
    });

    describe("Get Active Programs", () => {
        it("should return active programs", async () => {
            programAggregateRepository.getActivePrograms.mockResolvedValue(
                PROGRAMS_ARRAY as any
            );

            const result = await sharedProgramService.getActivePrograms(1, 10);

            expect(result).toEqual(PROGRAMS_ARRAY);
        });
    });
});
