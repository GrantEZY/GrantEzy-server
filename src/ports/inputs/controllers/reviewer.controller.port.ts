import {GetTokenDetailsDTO} from "../../../infrastructure/driving/dtos/co.applicant.dto";
import {Response} from "express";
export interface ReviewerControllerPort {
    getTokenDetails(
        parameter: GetTokenDetailsDTO,
        response: Response
    ): Promise<Response>;
}
