import {Program} from "../../../../core/domain/aggregates/program.aggregate";
import {FindOptionsWhere} from "typeorm";

export interface ProgramAggregatePort {
    save(program: Partial<Program>): Promise<Program>;
    findById(id: string): Promise<Program | null>;
    getPrograms(
        filter: FindOptionsWhere<Program>,
        page: number,
        numberOfPrograms: number
    ): Promise<{programs: Program[]; totalNumberOfPrograms: number}>;
    deleteProgram(id: string): Promise<boolean>;
}

export const PROGRAM_AGGREGATE_PORT = Symbol("ProgramAggregatePort");
