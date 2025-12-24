import {
    AddApplicationRevenueStreamDTO,
    AddApplicationRisksAndMilestonesDTO,
    AddApplicationTeammatesDTO,
    AddApplicationTechnicalAndMarketInfoDTO,
    AddBudgetDetailsDTO,
    ApplicationDocumentsDTO,
    CreateApplicationControllerDTO,
    DeleteApplicationDTO,
    GetApplicationWithCycleDetailsDTO,
    GetUserCreatedApplicationDTO,
    GetProjectDetailsDTO,
    GetUserProjectsPaginationDTO,
    ManageTeammateDTO,
} from "../../../infrastructure/driving/dtos/applicant.dto";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
import {Response} from "express";
export interface ApplicantControllerPort {
    createApplication(
        user: AccessTokenJwt,
        body: CreateApplicationControllerDTO,
        response: Response
    ): Promise<Response>;

    addApplicationBudgetDetails(
        user: AccessTokenJwt,
        body: AddBudgetDetailsDTO,
        response: Response
    ): Promise<Response>;

    addApplicationTechnicalAndMarketInfoDetails(
        user: AccessTokenJwt,
        body: AddApplicationTechnicalAndMarketInfoDTO,
        response: Response
    ): Promise<Response>;

    addApplicationRevenueStream(
        user: AccessTokenJwt,
        body: AddApplicationRevenueStreamDTO,
        response: Response
    ): Promise<Response>;

    addApplicationRisksAndMileStones(
        user: AccessTokenJwt,
        body: AddApplicationRisksAndMilestonesDTO,
        response: Response
    ): Promise<Response>;

    addApplicationDocuments(
        user: AccessTokenJwt,
        body: ApplicationDocumentsDTO,
        response: Response
    ): Promise<Response>;

    addApplicationTeammates(
        user: AccessTokenJwt,
        body: AddApplicationTeammatesDTO,
        response: Response
    ): Promise<Response>;

    getUserApplications(
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getUserCreatedApplicationDetails(
        user: AccessTokenJwt,
        parameter: GetUserCreatedApplicationDTO,
        response: Response
    ): Promise<Response>;

    getApplicationDetailsWithCycle(
        user: AccessTokenJwt,
        parameter: GetApplicationWithCycleDetailsDTO,
        response: Response
    ): Promise<Response>;

    deleteUserApplication(
        user: AccessTokenJwt,
        body: DeleteApplicationDTO,
        response: Response
    ): Promise<Response>;

    getUserCreatedProjects(
        parameters: GetUserProjectsPaginationDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    getProjectDetails(
        parameters: GetProjectDetailsDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    addTeamMatesToApplication(
        body: ManageTeammateDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    removeTeamMatesToApplication(
        body: ManageTeammateDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
