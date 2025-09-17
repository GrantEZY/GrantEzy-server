import {Program} from "../../../../core/domain/aggregates/program.aggregate";
import {FindOptionsWhere} from "typeorm";
import {CreateProgramDTO} from "../../../../infrastructure/driving/dtos/gcv.dto";
import {UpdateProgramDTO} from "../../../../infrastructure/driving/dtos/shared/shared.program.dto";

export interface ProgramAggregatePort {
    save(
        program: Partial<CreateProgramDTO>,
        organizationId: string
    ): Promise<Program>;
    findById(id: string): Promise<Program | null>;
    findByName(name: string, organizationName: string): Promise<Program | null>;
    getPrograms(
        filter: FindOptionsWhere<Program>,
        page: number,
        numberOfPrograms: number
    ): Promise<{programs: Program[]; totalNumberOfPrograms: number}>;
    deleteProgram(id: string): Promise<boolean>;
    updateProgram(
        updateDetails: UpdateProgramDTO,
        oldProgramDetails: Program
    ): Promise<Program>;
    addProgramManager(managerId: string, program: Program): Promise<boolean>;
    getProgramByManagerId(managerId: string): Promise<Program | null>;
}

export const PROGRAM_AGGREGATE_PORT = Symbol("ProgramAggregatePort");
