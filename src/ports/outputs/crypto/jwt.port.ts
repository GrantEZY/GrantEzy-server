import {SignJwtTokenData} from "../../../shared/types/jwt.types";

import {
    RefreshAccessTokenData,
    LoginTokenSigningData,
} from "../../../infrastructure/driven/response-dtos/jwt.response-dto";

export interface JwtPort {
    signTokens(jwtData: SignJwtTokenData): Promise<LoginTokenSigningData>;
    getAccessToken(jwtData: SignJwtTokenData): Promise<RefreshAccessTokenData>;
}

export const JWT_PORT = Symbol("JwtPort");
