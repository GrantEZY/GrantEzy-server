import {UpdateProfileDTO} from "../../../infrastructure/driving/dtos/user.dto";
import {AccessTokenJwt} from "../../../shared/types/jwt.types";
import {Response} from "express";
export interface UserControllerPort {
    getUserAccount(user: AccessTokenJwt, response: Response): Promise<Response>;
    UpdateUserProfile(
        user: AccessTokenJwt,
        updateDetails: UpdateProfileDTO,
        response: Response
    ): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
