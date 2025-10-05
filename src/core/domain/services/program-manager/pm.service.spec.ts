import {TestingModule, Test} from "@nestjs/testing";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {SharedProgramService} from "../shared/program/shared.program.service";
import ApiError from "../../../../shared/errors/api.error";
import {ProgramManagerService} from "./pm.service";
import {createMock} from "@golevelup/ts-jest";
import {
    inputCycle,
    dummyCycle,
    SAVED_PROGRAM,
    CYCLES_ARRAY,
} from "./pm.service.mock.data";
describe("Program Manager Service", () => {
    let programManagerService: ProgramManagerService;
    let cycleAggregaterepository: jest.Mocked<CycleAggregatePort>;
    let programAggregaterepository: jest.Mocked<ProgramAggregatePort>;
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
            ],
        }).compile();

        programManagerService = moduleReference.get(ProgramManagerService);
        cycleAggregaterepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;

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
                inputCycle as any
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

                await programManagerService.createCycle(inputCycle as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Program Not Found");
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
                await programManagerService.createCycle(inputCycle as any);
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
                await programManagerService.createCycle(inputCycle as any);
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
                programId: "program-id",
                page: 1,
                numberOfResults: 5,
            };

            sharedProgramService.getProgramCycles.mockResolvedValue({
                cycles: CYCLES_ARRAY as any,
                totalNumberOfCycles: 2,
            });

            const result = await programManagerService.getProgramCycles(filter);

            expect(result).toEqual({
                status: 200,
                message: "Program Cycle fetched successfully",
                res: {
                    cycles: CYCLES_ARRAY,
                    totalNumberOfCycles: 2,
                },
            });
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
});
