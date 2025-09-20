import {User} from "../../../core/domain/aggregates/user.aggregate";
import {ApiResponse} from "../../../shared/types/response.type";

export class AccountData {
    user: User;
}

export class UserAccountResponse extends ApiResponse(AccountData) {}
