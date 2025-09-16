import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetProgramCyclesDTO,
} from "../../../infrastructure/driving/dtos/pm.dto";
import {Response} from "express";
export interface ProgramManagerControllerPort {
    createCycle(
        createCycleDTO: CreateCycleDTO,
        response: Response
    ): Promise<Response>;
    getProgramCycles(
        getProgramCycle: GetProgramCyclesDTO,
        response: Response
    ): Promise<Response>;
    deleteCycle(
        deleteCycle: DeleteCycleDTO,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
