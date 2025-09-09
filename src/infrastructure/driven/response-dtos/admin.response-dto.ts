import {User} from "../../../core/domain/aggregates/user.aggregate";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
import {ApiResponse} from "../../../shared/types/response.type";

class GetUsersData {
    users: User[];
    totalNumberOfUsers: number;
}

export class AddUserData {
    user: User;
}

class AddUserResponseData {
    id: string;
    email: string;
}

class UpdateUserResponseData {
    id: string;
    role: UserRoles;
}

class DeleteUserResponseData {
    status: boolean;
}

export class GetUsersDataResponse extends ApiResponse(GetUsersData) {}
export class AddUserDataResponse extends ApiResponse(AddUserResponseData) {}
export class UpdateUserDataResponse extends ApiResponse(
    UpdateUserResponseData
) {}
export class DeleteUserDataResponse extends ApiResponse(
    DeleteUserResponseData
) {}
