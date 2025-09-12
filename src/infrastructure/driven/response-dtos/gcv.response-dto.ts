import {ApiResponse} from "../../../shared/types/response.type";
import {User} from "../../../core/domain/aggregates/user.aggregate";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
class AddUserResponseData {
    id: string;
    email: string;
}

class GetUsersData {
    users: User[];
    totalNumberOfUsers: number;
}

class UpdateUserResponseData {
    id: string;
    role: UserRoles;
}

export class UpdateUserDataResponse extends ApiResponse(
    UpdateUserResponseData
) {}
export class GetGCVUsersDataResponse extends ApiResponse(GetUsersData) {}
export class AddGCVUserDataResponse extends ApiResponse(AddUserResponseData) {}
