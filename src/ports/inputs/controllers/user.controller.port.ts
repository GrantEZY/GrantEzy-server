import {AccessTokenJwt} from "../../../shared/types/jwt.types";
import {Response} from "express";
export interface UserControllerPort {
    getUserAccount(user: AccessTokenJwt, response: Response): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
}
