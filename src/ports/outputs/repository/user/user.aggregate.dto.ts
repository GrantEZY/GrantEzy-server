import {UserCommitmentStatus} from "../../../../core/domain/constants/commitment.constants";
import {UserRoles} from "../../../../core/domain/constants/userRoles.constants";

export class UserAggregateDTO {
    firstName: string;
    lastName: string;
    email: string;
    password_hash: string;
    commitment: UserCommitmentStatus;
    role: UserRoles;
}
