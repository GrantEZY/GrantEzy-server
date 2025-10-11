import {
    GetTokenDetailsDTO,
    SubmitInviteStatusDTO,
} from "../../../infrastructure/driving/dtos/co.applicant.dto";
import {Response} from "express";
export interface ReviewerControllerPort {
    getTokenDetails(
        parameter: GetTokenDetailsDTO,
        response: Response
    ): Promise<Response>;

    updateInviteStatus(
        body: SubmitInviteStatusDTO,
        response: Response
    ): Promise<Response>;

    handleError(error: unknown, response: Response): Response;
}
