import {CreateProjectDTO} from "../../../infrastructure/driving/dtos/project.management.dto";
import {Response} from "express";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
export interface ProjectManagementControllerPort {
    createProject(
        body: CreateProjectDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
