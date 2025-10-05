import {
    CreateCycleDTO,
    DeleteCycleDTO,
    GetApplicationDetailsDTO,
    GetCycleDetailsDTO,
    GetPMProgramCyclesDTO,
} from "../../../infrastructure/driving/dtos/pm.dto";
import {Response} from "express";
import {UpdateCycleDTO} from "../../../infrastructure/driving/dtos/shared/shared.program.dto";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
export interface ProgramManagerControllerPort {
    createCycle(
        createCycleDTO: CreateCycleDTO,
        response: Response
    ): Promise<Response>;
    getProgramCycles(
        getProgramCycle: GetPMProgramCyclesDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    updateCycleDetails(
        updateCycleDetails: UpdateCycleDTO,
        response: Response
    ): Promise<Response>;
    deleteCycle(
        deleteCycle: DeleteCycleDTO,
        response: Response
    ): Promise<Response>;
    getCycleDetails(
        parameters: GetCycleDetailsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getApplicationDetails(
        parameters: GetApplicationDetailsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
