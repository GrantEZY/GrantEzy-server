import {Injectable} from "@nestjs/common";
import {Inject} from "@nestjs/common";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {ModifyCycleStatusDTO} from "../../../../infrastructure/driving/dtos/pm.dto";
import {CycleStatus} from "../../constants/status.constants";
import {CycleStatusUpdationResponse} from "../../../../infrastructure/driven/response-dtos/pm.response-dto";

@Injectable()
export class ProgramManagerConfigManagementService {
    constructor(
        @Inject(CYCLE_AGGREGATE_PORT)
        private readonly cycleAggregateRepository: CycleAggregatePort
    ) {}

    async modifyCycleStatus(
        details: ModifyCycleStatusDTO,
        status: CycleStatus,
        userId: string
    ): Promise<CycleStatusUpdationResponse> {
        try {
            const {cycleId} = details;
            const cycle = await this.cycleAggregateRepository.findById(cycleId);

            if (!cycle) {
                throw new ApiError(404, "Cycle Not Found", "Conflict Error");
            }

            const managerId = cycle.program?.managerId;

            if (managerId != userId) {
                throw new ApiError(
                    403,
                    "Only Program Manager Can Modify the states",
                    "Conflict Error"
                );
            }

            const newUpdatedCycle =
                await this.cycleAggregateRepository.modifyCycleStatus(
                    cycle,
                    status
                );

            return {
                status: 200,
                message: "Cycle status updated",
                res: {
                    id: newUpdatedCycle.id,
                    status: newUpdatedCycle.status,
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
