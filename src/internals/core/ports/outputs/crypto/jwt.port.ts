import {JwtData} from "../../../../shared/types/jwt.types";

import {
    RefreshAccessTokenData,
    LoginTokenSigningData,
} from "../../../../infrastructure/driven/response-dtos/jwt.response-dto";

export interface JwtPort {
    signTokens(jwtData: JwtData): Promise<LoginTokenSigningData>;
    getAccessToken(jwtData: JwtData): Promise<RefreshAccessTokenData>;
}

export const JWT_PORT = Symbol("JwtPort");
