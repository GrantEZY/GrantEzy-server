import {Response} from "express";
import {
    CoApplicantApplicationDTO,
    GetTokenDetailsDTO,
    SubmitInviteStatusDTO,
} from "../../../infrastructure/driving/dtos/co.applicant.dto";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
export interface CoApplicantControllerPort {
    getApplicationDetails(
        parameter: CoApplicantApplicationDTO,
        user: AccessTokenJwt,
        response: Response
    ): Promise<Response>;
    getTokenDetails(
        parameter: GetTokenDetailsDTO,
        response: Response
    ): Promise<Response>;
    updateUserInviteStatus(
        inviteStatusData: SubmitInviteStatusDTO,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
