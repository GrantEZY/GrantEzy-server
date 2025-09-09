import {UserRoles} from "../../core/domain/constants/userRoles.constants";

export interface JwtData {
    id: string;
    email: string;
    role: UserRoles;
    token_version: number;
}

export interface RefreshTokenJwt {
    refreshToken: string;
    userData: JwtData;
}
