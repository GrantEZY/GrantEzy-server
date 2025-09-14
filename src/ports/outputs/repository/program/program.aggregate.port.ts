import {Program} from "../../../../core/domain/aggregates/program.aggregate";
import {FindOptionsWhere} from "typeorm";
import {
    CreateProgramDTO,
    UpdateProgramDTO,
} from "../../../../infrastructure/driving/dtos/gcv.dto";

export interface ProgramAggregatePort {
    save(
        program: Partial<CreateProgramDTO>,
        organizationId: string
    ): Promise<Program>;
    findById(id: string): Promise<Program | null>;
    getPrograms(
        filter: FindOptionsWhere<Program>,
        page: number,
        numberOfPrograms: number
    ): Promise<{programs: Program[]; totalNumberOfPrograms: number}>;
    deleteProgram(id: string): Promise<boolean>;
    updateProgram(updateDetails: UpdateProgramDTO): Promise<Program>;
    addProgramManager(managerId: string, programId: string): Promise<boolean>;
    updateProgramManager(
        managerId: string,
        programId: string
    ): Promise<boolean>;
    getProgramByManagerId(managerId: string): Promise<Program | null>;
}

export const PROGRAM_AGGREGATE_PORT = Symbol("ProgramAggregatePort");
