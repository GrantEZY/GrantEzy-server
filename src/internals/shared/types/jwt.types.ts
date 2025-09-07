import {UserRoles} from "../../core/domain/constants/userRoles.constants";

export interface JwtData {
    id: string;
    email: string;
    role: UserRoles;
}

export interface RefreshTokenJwt {
    refreshToken: string;
    userData: JwtData;
}
