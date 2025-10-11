import {Program} from "../../../../core/domain/aggregates/program.aggregate";
import {FindOptionsWhere} from "typeorm";
import {CreateProgramDTO} from "../../../../infrastructure/driving/dtos/gcv.dto";
import {UpdateProgramDTO} from "../../../../infrastructure/driving/dtos/shared/shared.program.dto";
import {ProgramStatus} from "../../../../core/domain/constants/status.constants";

export interface ProgramAggregatePort {
    save(
        program: Partial<CreateProgramDTO>,
        organizationId: string
    ): Promise<Program>;
    findById(id: string): Promise<Program | null>;
    findByName(name: string, organizationName: string): Promise<Program | null>;
    findByslug(slug: string): Promise<Program | null>;
    getPrograms(
        filter: FindOptionsWhere<Program>,
        page: number,
        numberOfPrograms: number
    ): Promise<{programs: Program[]; totalNumberOfPrograms: number}>;
    getActivePrograms(
        page: number,
        numberOfResults: number
    ): Promise<Program[]>;
    deleteProgram(id: string): Promise<boolean>;
    updateProgram(
        updateDetails: UpdateProgramDTO,
        oldProgramDetails: Program
    ): Promise<Program>;
    updateProgramStatus(
        program: Program,
        status: ProgramStatus
    ): Promise<boolean>;
    addProgramManager(managerId: string, program: Program): Promise<boolean>;
    getProgramByManagerId(managerId: string): Promise<Program | null>;
}

export const PROGRAM_AGGREGATE_PORT = Symbol("ProgramAggregatePort");
