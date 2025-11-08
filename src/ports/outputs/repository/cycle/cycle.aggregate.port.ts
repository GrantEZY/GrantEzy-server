import {Cycle} from "../../../../core/domain/aggregates/cycle.aggregate";
import {CreateCycleDTO} from "../../../../infrastructure/driving/dtos/pm.dto";
import {UpdateCycleDTO} from "../../../../infrastructure/driving/dtos/shared/shared.program.dto";
export interface CycleAggregatePort {
    save(createCycle: CreateCycleDTO): Promise<Cycle>;
    findById(id: string): Promise<Cycle | null>;
    findProgramCycles(
        programId: string,
        page: number,
        totalnumberOfResults: number
    ): Promise<{cycles: Cycle[]; totalNumberOfCycles: number}>;
    getProgramActiveCycle(programId: string): Promise<Cycle[]>;
    getCycleDetailsWithApplications(slug: string): Promise<Cycle | null>;
    getProgramCycleWithRound(
        programId: string,
        round: {year: number; type: string}
    ): Promise<Cycle | null>;
    findCycleByslug(slug: string): Promise<Cycle | null>;
    deleteCycle(id: string): Promise<boolean>;
    updateCycle(oldCycle: Cycle, updateDetails: UpdateCycleDTO): Promise<Cycle>;
}

export const CYCLE_AGGREGATE_PORT = Symbol("CycleAggregatePort");
