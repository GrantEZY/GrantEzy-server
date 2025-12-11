import {
    CreateCycleProjectsEvalCriteriaDTO,
    CreateProjectDTO,
    GetCycleCriteriasDTO,
    GetCycleProjectsDTO,
    GetProjectDetailsDTO,
    GetCycleCriteriaDetailsWithSubmissionDTO,
    SubmitDetailsForReviewDTO,
    GetCycleCriteriaDetailsWithAssessmentsDTO,
    AddReviewerForProjectAssessmentDTO,
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
    getApplicantCycleAssessmentSubmission(
        parameters: GetCycleCriteriaDetailsWithSubmissionDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    createApplicantProjectAssessmentSubmission(
        body: SubmitDetailsForReviewDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    getCycleCriteriaSubmissions(
        parameters: GetCycleCriteriaDetailsWithAssessmentsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    inviteReviewerForProjectAssessment(
        body: AddReviewerForProjectAssessmentDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
