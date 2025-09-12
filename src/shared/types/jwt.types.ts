import {UserRoles} from "../../core/domain/constants/userRoles.constants";

export interface JwtData {
    payload: {
        id: string;
        email: string;
        role: UserRoles;
        token_version: number;
    };
}

export interface SignJwtTokenData {
    id: string;
    email: string;
    role: UserRoles;
    token_version: number;
}

export interface RefreshTokenJwt {
    refreshToken: string;
    userData: JwtData;
}

export interface AccessTokenJwt {
    userData: JwtData;
}
