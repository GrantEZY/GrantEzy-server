import {
    CreateCycleProjectsEvalCriteriaDTO,
    CreateProjectDTO,
    GetCycleCriteriasDTO,
    GetCycleProjectsDTO,
    GetProjectDetailsDTO,
} from "../../../infrastructure/driving/dtos/project.management.dto";
import {Response} from "express";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
export interface ProjectManagementControllerPort {
    createProject(
        body: CreateProjectDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getCycleProjects(
        parameters: GetCycleProjectsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getProjectDetails(
        parameters: GetProjectDetailsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    createCycleCriteria(
        body: CreateCycleProjectsEvalCriteriaDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getCycleCriterias(
        parameters: GetCycleCriteriasDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    getApplicantCycleReviewCriterias(
        parameters: GetCycleCriteriasDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
