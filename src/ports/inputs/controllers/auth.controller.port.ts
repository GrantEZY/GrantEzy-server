import {PassportResponseData} from "../../../infrastructure/driven/response-dtos/auth.response-dto";
import {
    LoginDTO,
    RegisterDTO,
} from "../../../infrastructure/driving/dtos/auth.dto";
import {Response} from "express";
import {AccessTokenJwt, RefreshTokenJwt} from "../../../shared/types/jwt.types";
export interface AuthControllerPort {
    register(userData: RegisterDTO, response: Response): Promise<Response>;
    login(
        user: PassportResponseData,
        body: LoginDTO,
        response: Response
    ): Promise<Response>;
    logout(response: Response, user: AccessTokenJwt): Promise<Response>;
    handleError(error: unknown, response: Response): Response;
    setCookie(response: Response, cookieName: string, value: string): void;
    removeCookie(response: Response, cookieName: string): void;
    refresh(response: Response, user: RefreshTokenJwt): Promise<Response>;
}
