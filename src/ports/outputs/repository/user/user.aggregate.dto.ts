import {UserCommitmentStatus} from "../../../../core/domain/constants/commitment.constants";

export class UserAggregateDTO {
    firstName: string;
    lastName: string;
    email: string;
    password_hash: string;
    commitment: UserCommitmentStatus;
}
