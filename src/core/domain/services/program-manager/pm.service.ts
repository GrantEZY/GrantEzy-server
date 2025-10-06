import {Injectable} from "@nestjs/common";
import {Inject} from "@nestjs/common";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetPMProgramCyclesDTO,
} from "../../../../infrastructure/driving/dtos/pm.dto";
import ApiError from "../../../../shared/errors/api.error";
import {SharedProgramService} from "../shared/program/shared.program.service";
import {
    CreateCycleResponse,
    DeleteCycleResponse,
    GetApplicationDetailsResponse,
    GetCycleDetailsResponse,
    GetProgramCyclesResponse,
    UpdateCycleResponse,
} from "../../../../infrastructure/driven/response-dtos/pm.response-dto";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {UpdateCycleDTO} from "../../../../infrastructure/driving/dtos/shared/shared.program.dto";
import {ProgramStatus} from "../../constants/status.constants";
@Injectable()
export class ProgramManagerService {
    constructor(
        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort,
        @Inject(PROGRAM_AGGREGATE_PORT)
        private readonly programAggregateRepository: ProgramAggregatePort,
        private readonly sharedProgramService: SharedProgramService
    ) {}

    async createCycle(
        createCycle: CreateCycleDTO
    ): Promise<CreateCycleResponse> {
        try {
            const {programId, budget, round} = createCycle;

            const program =
                await this.programAggregateRepository.findById(programId);

            if (!program) {
                throw new ApiError(404, "Program Not Found", "Program Error");
            }

            const isAlreadyCycle =
                await this.cycleAggregateRepository.getProgramCycleWithRound(
                    program.id,
                    round
                );

            if (isAlreadyCycle) {
                throw new ApiError(
                    409,
                    "Program has a same cycle with round",
                    "Conflict Error"
                );
            }
            const {amount, currency} = program.budget;
            if (amount < budget.amount) {
                throw new ApiError(
                    400,
                    "Quoted Budget exceeds the available limit for the program",
                    "Conflict Error"
                );
            }
            const updatedProgram =
                await this.sharedProgramService.UpdateProgramDetails({
                    id: program.id,
                    budget: {
                        amount: amount - budget.amount,
                        currency,
                    },
                });

            const cycle = await this.cycleAggregateRepository.save(createCycle);

            await this.programAggregateRepository.updateProgramStatus(
                updatedProgram,
                ProgramStatus.ACTIVE
            );

            return {
                status: 201,
                message: "Cycle Created for Program",
                res: {
                    programId: updatedProgram.id,
                    cycleId: cycle.id,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProgramCycles(
        getCycleDto: GetPMProgramCyclesDTO,
        userId: string
    ): Promise<GetProgramCyclesResponse> {
        try {
            const program =
                await this.programAggregateRepository.getProgramByManagerId(
                    userId
                );

            if (!program) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            const {cycles, totalNumberOfCycles} =
                await this.sharedProgramService.getProgramCycles({
                    programId: program.id,
                    page: getCycleDto.page,
                    numberOfResults: getCycleDto.numberOfResults,
                });

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

    async updateCycle(
        updateCycleInfo: UpdateCycleDTO
    ): Promise<UpdateCycleResponse> {
        try {
            const updatedCycle =
                await this.sharedProgramService.updateCycleDetails(
                    updateCycleInfo
                );

            return {
                status: 200,
                message: "Cycle  Details Updated",
                res: {
                    id: updatedCycle.id,
                    status: true,
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

    async getCycleWithApplications(
        cycleSlug: string,
        userId: string
    ): Promise<GetCycleDetailsResponse> {
        try {
            const cycle =
                await this.sharedProgramService.getCycleDetailsWithApplications(
                    cycleSlug
                );

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            return {
                status: 200,
                message: "Cycle Details With Applications",
                res: {
                    cycle,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getApplicationDetails(
        cycleSlug: string,
        applicationSlug: string,
        userId: string
    ): Promise<GetApplicationDetailsResponse> {
        try {
            const application =
                await this.sharedProgramService.getApplicationDetailsWithSlug(
                    applicationSlug
                );

            if (!application) {
                throw new ApiError(
                    404,
                    "Application Not Found",
                    "Conflict Error"
                );
            }

            if (application?.cycle.slug != cycleSlug) {
                throw new ApiError(
                    403,
                    "Application Doesn't Belongs to the Cycle",
                    "Conflict Error"
                );
            }
            const cycle = application.cycle;

            if (cycle.program?.managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager can access the Program",
                    "Conflict Error"
                );
            }

            return {
                status: 200,
                message: "Cycle Details With Applications",
                res: {
                    application,
                },
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
