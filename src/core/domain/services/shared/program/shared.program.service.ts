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
    UpdateCycleDTO,
} from "../../../../../infrastructure/driving/dtos/shared/shared.program.dto";
import {GetProgramCyclesDTO} from "../../../../../infrastructure/driving/dtos/pm.dto";
import {Cycle} from "../../../aggregates/cycle.aggregate";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {GrantApplicationStatus} from "../../../constants/status.constants";
import {GrantApplication} from "../../../aggregates/grantapplication.aggregate";
import {
    GRANT_APPLICATION_AGGREGATE_PORT,
    GrantApplicationAggregatePort,
} from "../../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";

@Injectable()
export class SharedProgramService {
    constructor(
        @Inject(PROGRAM_AGGREGATE_PORT)
        private readonly programAggregateRepository: ProgramAggregatePort,

        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort,

        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly applicationRepository: GrantApplicationAggregatePort
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

    async getActivePrograms(
        page: number,
        numberOfResults: number
    ): Promise<Program[]> {
        try {
            return await this.programAggregateRepository.getActivePrograms(
                page,
                numberOfResults
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProgramCycles(
        getProgramData: GetProgramCyclesDTO
    ): Promise<{cycles: Cycle[]; totalNumberOfCycles: number}> {
        try {
            const {cycles, totalNumberOfCycles} =
                await this.cycleAggregateRepository.findProgramCycles(
                    getProgramData.programId,
                    getProgramData.page,
                    getProgramData.numberOfResults
                );
            return {
                cycles,
                totalNumberOfCycles,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProgramCycleDetails(cycleSlug: string): Promise<Cycle | null> {
        try {
            return await this.cycleAggregateRepository.findCycleByslug(
                cycleSlug
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    async getCycleDetailsWithApplications(
        cycleSlug: string
    ): Promise<Cycle | null> {
        try {
            const cycle =
                await this.cycleAggregateRepository.getCycleDetailsWithApplications(
                    cycleSlug
                );
            if (cycle) {
                cycle.applications = cycle.applications.filter(
                    (application) =>
                        application.status !== GrantApplicationStatus.DRAFT
                );
            }
            return cycle;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getApplicationDetailsWithSlug(
        applicationSlug: string
    ): Promise<GrantApplication | null> {
        try {
            const application =
                await this.applicationRepository.getUserCreatedApplicationWithSlug(
                    applicationSlug
                );

            return application;
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateCycleDetails(updateCycle: UpdateCycleDTO): Promise<Cycle> {
        try {
            const {id, round} = updateCycle;

            const cycle = await this.cycleAggregateRepository.findById(id);

            if (!cycle) {
                throw new ApiError(
                    400,
                    "Program Cycle Not Found",
                    "Conflict Error"
                );
            }
            if (round) {
                const isAlreadyCycle =
                    await this.cycleAggregateRepository.getProgramCycleWithRound(
                        cycle.programId,
                        round as {year: number; type: string}
                    );

                if (isAlreadyCycle) {
                    throw new ApiError(
                        409,
                        "Program has a same cycle with round",
                        "Conflict Error"
                    );
                }
            }

            const updatedCycle =
                await this.cycleAggregateRepository.updateCycle(
                    cycle,
                    updateCycle
                );

            return updatedCycle;
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
