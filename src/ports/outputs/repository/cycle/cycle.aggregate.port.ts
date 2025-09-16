import {Cycle} from "../../../../core/domain/aggregates/cycle.aggregate";
import {CreateCycleDTO} from "../../../../infrastructure/driving/dtos/pm.dto";
export interface CycleAggregatePort {
    save(createCycle: CreateCycleDTO): Promise<Cycle>;
    findById(id: string): Promise<Cycle | null>;
    findProgramCycles(
        programId: string,
        page: number,
        totanumberOfResults: number
    ): Promise<{cycles: Cycle[]; totalNumberOfCycles: number}>;
    findCycleByslug(slug: string): Promise<Cycle | null>;
    deleteCycle(id: string): Promise<boolean>;
}

export const CYCLE_AGGREGATE_PORT = Symbol("CycleAggregatePort");
