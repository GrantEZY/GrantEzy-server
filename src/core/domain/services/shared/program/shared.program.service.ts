import {Injectable, Inject} from "@nestjs/common";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/program/program.aggregate.port";
import ApiError from "../../../../../shared/errors/api.error";
import {Program} from "../../../aggregates/program.aggregate";
import {
    UpdateProgramDTO,
    GetAllProgramDTO,
} from "../../../../../infrastructure/driving/dtos/shared/shared.program.dto";

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
            const {id, details} = updatedProgramDetails;
            const program = await this.programAggregateRepository.findById(id);
            if (!program) {
                throw new ApiError(400, "Program Not Found", "Conflict Error");
            }
            if (details?.name) {
                const ExistingProgram =
                    await this.programAggregateRepository.findByName(
                        details.name,
                        program.organization.name
                    );
                if (ExistingProgram) {
                    throw new ApiError(
                        409,
                        "The Organization already has a program with this name",
                        "Conflict Error"
                    );
                }
            }
            return await this.programAggregateRepository.updateProgram(
                updatedProgramDetails,
                program
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    async getPrograms(
        filterDetails: GetAllProgramDTO
    ): Promise<{programs: Program[]; totalNumberOfPrograms: number}> {
        try {
            const {filter, page, numberOfResults} = filterDetails;
            const {programs, totalNumberOfPrograms} =
                await this.programAggregateRepository.getPrograms(
                    filter?.otherFilters ?? {},
                    page,
                    numberOfResults
                );
            return {programs, totalNumberOfPrograms};
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
