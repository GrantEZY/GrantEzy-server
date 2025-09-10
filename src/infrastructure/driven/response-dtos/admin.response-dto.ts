import {User} from "../../../core/domain/aggregates/user.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";

class GetUsersData {
    users: User[];
    totalNumberOfUsers: number;
}

export class AddUserData {
    user: User;
}

export class GetUsersDataResponse extends ApiResponse(GetUsersData) {}
