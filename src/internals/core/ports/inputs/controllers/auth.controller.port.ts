import {RegisterDTO} from "../../../../infrastructure/driving/dtos/auth.dto";
import {Response} from "express";

export interface AuthControllerPort {
    register(userData: RegisterDTO, response: Response): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
