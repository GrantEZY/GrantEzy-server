import {Injectable, Inject} from "@nestjs/common";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/program/program.aggregate.port";
import ApiError from "../../../../../shared/errors/api.error";
import {Program} from "../../../aggregates/program.aggregate";
import {UpdateProgramDTO} from "../../../../../infrastructure/driving/dtos/shared/shared.program.dto";

@Injectable()
export class SharedProgramService {
    constructor(
        @Inject(PROGRAM_AGGREGATE_PORT)
        private readonly programAggregateRepository: ProgramAggregatePort
    ) {}

    async UpdateProgramDetails(
        updatedProgramDetails: UpdateProgramDTO
    ): Promise<Program> {
        try {
            const {id} = updatedProgramDetails;
            const program = await this.programAggregateRepository.findById(id);
            if (!program) {
                throw new ApiError(400, "Program Not Found", "Conflict Error");
            }
            return await this.programAggregateRepository.updateProgram(
                updatedProgramDetails,
                program
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
