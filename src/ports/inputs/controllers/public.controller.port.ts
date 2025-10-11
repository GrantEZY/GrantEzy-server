import {
    GetProgramCycleDetailsDTO,
    getActiveProgramFilterDTO,
} from "../../../infrastructure/driving/dtos/public.dto";
import {Response} from "express";

export interface PublicControllerPort {
    getActiveProgramCycles(
        parameters: getActiveProgramFilterDTO,
        response: Response
    ): Promise<Response>;
    getProgramCycleDetails(
        parameters: GetProgramCycleDetailsDTO,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
