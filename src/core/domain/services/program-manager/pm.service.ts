import {Injectable} from "@nestjs/common";
import {Inject} from "@nestjs/common";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetProgramCyclesDTO,
} from "../../../../infrastructure/driving/dtos/pm.dto";
import ApiError from "../../../../shared/errors/api.error";
import {SharedProgramService} from "../shared/program/shared.program.service";
import {
    CreateCycleResponse,
    DeleteCycleResponse,
    GetProgramCyclesResponse,
} from "../../../../infrastructure/driven/response-dtos/pm.response-dto";

@Injectable()
export class ProgramManagerService {
    constructor(
        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort,
        private readonly sharedProgramService: SharedProgramService
    ) {}

    async createCycle(
        createCycle: CreateCycleDTO
    ): Promise<CreateCycleResponse> {
        try {
            const cycle = await this.cycleAggregateRepository.save(createCycle);

            return {
                status: 201,
                message: "Cycle Created for Program",
                res: {
                    programId: createCycle.programId,
                    cycleId: cycle.id,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProgramCycles(
        getCycleDto: GetProgramCyclesDTO
    ): Promise<GetProgramCyclesResponse> {
        try {
            const {cycles, totalNumberOfCycles} =
                await this.sharedProgramService.getProgramCycles(getCycleDto);

            return {
                status: 200,
                message: "Program Cycle fetched successfully",
                res: {
                    cycles,
                    totalNumberOfCycles,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteProgramCycle(
        deleteCycleDto: DeleteCycleDTO
    ): Promise<DeleteCycleResponse> {
        try {
            const {cycleId} = deleteCycleDto;

            const cycle = await this.cycleAggregateRepository.findById(cycleId);
            if (!cycle) {
                throw new ApiError(
                    404,
                    "Cycle Already Deleted",
                    "Conflict Error"
                );
            }

            const isDeleted =
                await this.cycleAggregateRepository.deleteCycle(cycleId);
            if (isDeleted) {
                return {
                    status: 200,
                    message: "Cycle Deleted Successfully",
                    res: {
                        status: true,
                    },
                };
            }
            throw new ApiError(
                400,
                "Error in deleting cycle",
                "Cycle Deletion Error"
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
