import {TestingModule, Test} from "@nestjs/testing";
import {PublicService} from "./public.service";
import ApiError from "../../../../shared/errors/api.error";
import {SharedProgramService} from "../shared/program/shared.program.service";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {mockPrograms, mockCycle} from "./public.service.mock.data";

describe("PublicService", () => {
    let publicService: PublicService;
    let sharedProgramService: jest.Mocked<SharedProgramService>;
    let programAggregateRepository: jest.Mocked<ProgramAggregatePort>;
    let cycleAggregateRepository: jest.Mocked<CycleAggregatePort>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                PublicService,
                {
                    provide: SharedProgramService,
                    useValue: createMock<SharedProgramService>(),
                },
                {
                    provide: PROGRAM_AGGREGATE_PORT,
                    useValue: createMock<ProgramAggregatePort>(),
                },
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
            ],
        }).compile();

        publicService = moduleReference.get<PublicService>(PublicService);
        sharedProgramService = moduleReference.get<SharedProgramService>(
            SharedProgramService
        ) as jest.Mocked<SharedProgramService>;
        programAggregateRepository = moduleReference.get<ProgramAggregatePort>(
            PROGRAM_AGGREGATE_PORT
        ) as jest.Mocked<ProgramAggregatePort>;
        cycleAggregateRepository = moduleReference.get<CycleAggregatePort>(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;
    });

    it("to be defined", () => {
        expect(publicService).toBeDefined();
    });

    describe("getActivePrograms", () => {
        it("should return active programs", async () => {
            sharedProgramService.getActivePrograms.mockResolvedValue(
                mockPrograms as any
            );
            const result = await publicService.getActiveProgramCycles({
                page: 1,
                numberOfResults: 10,
            });
            expect(result).toEqual({
                status: 200,
                message: "Active Programs Fetched Successfully",
                res: {programs: mockPrograms},
            });
            expect(sharedProgramService.getActivePrograms).toHaveBeenCalledWith(
                1,
                10
            );
        });
        it("should handle errors", async () => {
            try {
                sharedProgramService.getActivePrograms.mockImplementation(
                    () => {
                        throw new ApiError(
                            502,
                            "Database Error",
                            "Internal Server Error"
                        );
                    }
                );
                await publicService.getActiveProgramCycles({
                    page: 1,
                    numberOfResults: 10,
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(502);
                expect((error as ApiError).message).toBe("Database Error");
            }
        });
    });

    describe("getProgramCycleDetails", () => {
        it("should return program cycle details", async () => {
            programAggregateRepository.findByslug.mockResolvedValue(
                mockPrograms[0] as any
            );
            cycleAggregateRepository.getProgramActiveCycle.mockResolvedValue([
                mockCycle as any,
            ]);

            const result =
                await publicService.getProgramCycleDetails("program-1");
            expect(result).toEqual({
                status: 200,
                message: "Program Cycle Details Fetched Successfully",
                res: {program: mockPrograms[0], cycles: [mockCycle]},
            });
            expect(programAggregateRepository.findByslug).toHaveBeenCalledWith(
                "program-1"
            );
            expect(
                cycleAggregateRepository.getProgramActiveCycle
            ).toHaveBeenCalledWith("1");
        });

        it("should handle program not found error", async () => {
            try {
                programAggregateRepository.findByslug.mockResolvedValue(
                    null as any
                );
                await publicService.getProgramCycleDetails("invalid-slug");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Program Not Found");
            }
        });

        it("should handle program not active error", async () => {
            try {
                programAggregateRepository.findByslug.mockResolvedValue({
                    ...mockPrograms[0],
                    status: "INACTIVE",
                } as any);
                await publicService.getProgramCycleDetails("program-1");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "Program is not Active Currently"
                );
            }
        });

        it("should handle no active cycle found error", async () => {
            try {
                programAggregateRepository.findByslug.mockResolvedValue(
                    mockPrograms[0] as any
                );
                cycleAggregateRepository.getProgramActiveCycle.mockResolvedValue(
                    [] as any
                );
                await publicService.getProgramCycleDetails("program-1");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "No Active Cycle Found for this Program"
                );
            }
        });
    });
});
