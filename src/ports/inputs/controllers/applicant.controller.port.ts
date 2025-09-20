import {
    CreateApplicationControllerDTO,
    DeleteApplicationDTO,
} from "../../../infrastructure/driving/dtos/applicant.dto";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
import {Response} from "express";
export interface ApplicantControllerPort {
    createApplication(
        user: AccessTokenJwt,
        body: CreateApplicationControllerDTO,
        response: Response
    ): Promise<Response>;

    getUserApplications(
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;

    deleteUserApplication(
        user: AccessTokenJwt,
        body: DeleteApplicationDTO,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
