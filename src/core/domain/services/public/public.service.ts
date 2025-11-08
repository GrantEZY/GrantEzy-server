import {Inject, Injectable} from "@nestjs/common";
import {SharedProgramService} from "../shared/program/shared.program.service";
import ApiError from "../../../../shared/errors/api.error";
import {getActiveProgramFilterDTO} from "../../../../infrastructure/driving/dtos/public.dto";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {ProgramStatus} from "../../constants/status.constants";
import {
    GetActiveProgramCycleDetailsResponse,
    GetActiveProgramsResponse,
} from "../../../../infrastructure/driven/response-dtos/public.response-dto";
@Injectable()
export class PublicService {
    constructor(
        private readonly sharedProgramService: SharedProgramService,
        @Inject(PROGRAM_AGGREGATE_PORT)
        private readonly programAggregateRepository: ProgramAggregatePort,
        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort
    ) {}

    async getActiveProgramCycles(
        programFilter: getActiveProgramFilterDTO
    ): Promise<GetActiveProgramsResponse> {
        try {
            const {page, numberOfResults} = programFilter;
            const programs = await this.sharedProgramService.getActivePrograms(
                page,
                numberOfResults
            );

            return {
                status: 200,
                message: "Active Programs Fetched Successfully",
                res: {programs},
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProgramCycleDetails(
        programSlug: string
    ): Promise<GetActiveProgramCycleDetailsResponse> {
        try {
            const program =
                await this.programAggregateRepository.findByslug(programSlug);

            if (!program) {
                throw new ApiError(404, "Program Not Found", "Not Found Error");
            }

            if (program.status !== ProgramStatus.ACTIVE) {
                throw new ApiError(
                    409,
                    "Program is not Active Currently",
                    "Conflict Error"
                );
            }

            const cycles =
                await this.cycleAggregateRepository.getProgramActiveCycle(
                    program.id
                );

            if (cycles.length === 0) {
                throw new ApiError(
                    404,
                    "No Active Cycle Found for this Program",
                    "Not Found Error"
                );
            }

            return {
                status: 200,
                message: "Program Cycle Details Fetched Successfully",
                res: {program, cycles},
            };
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
