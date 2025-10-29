import {ApiResponse} from "../../../shared/types/response.type";
import {User} from "../../../core/domain/aggregates/user.aggregate";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
class SignUpResponseData {
    id: string;
    email: string;
}

export class PassportResponseData {
    status: number;
    user: User | null;
    message: string;
}

export class LocalLoginResponseData {
    accessToken: string;
    email: string;
    role: UserRoles;
    id: string;
    refreshToken: string;
    name: string;
}

export class LogoutResponseData {
    status: boolean;
}

export class AccessTokenResponseData {
    accessToken: string;
}
export class ForgotPasswordResponseData {
    status: boolean;
}

export class SignUpResponse extends ApiResponse(SignUpResponseData) {}
export class LocalLoginResponse extends ApiResponse(LocalLoginResponseData) {}
export class LogoutResponse extends ApiResponse(LogoutResponseData) {}
export class AccessTokenResponse extends ApiResponse(AccessTokenResponseData) {}
export class ForgotPasswordResponse extends ApiResponse(
    ForgotPasswordResponseData
) {}
