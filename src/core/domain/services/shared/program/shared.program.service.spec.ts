import {TestingModule, Test} from "@nestjs/testing";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/program/program.aggregate.port";
import {SharedProgramService} from "./shared.program.service";
import {createMock} from "@golevelup/ts-jest";
import {
    NEW_PROGRAM_DATA,
    PROGRAMS_ARRAY,
    SAVED_PROGRAM,
} from "./shared.program.mock.data";
import ApiError from "../../../../../shared/errors/api.error";

describe("Shared Program Service", () => {
    let programAggregateRepository: jest.Mocked<ProgramAggregatePort>;
    let sharedProgramService: SharedProgramService;

    beforeAll(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                SharedProgramService,
                {
                    provide: PROGRAM_AGGREGATE_PORT,
                    useValue: createMock<ProgramAggregatePort>(),
                },
            ],
        }).compile();

        programAggregateRepository = moduleReference.get(
            PROGRAM_AGGREGATE_PORT
        ) as jest.Mocked<ProgramAggregatePort>;
        sharedProgramService = moduleReference.get(SharedProgramService);
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
});
