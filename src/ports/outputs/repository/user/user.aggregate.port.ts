import {FindOptionsWhere} from "typeorm";
import {User} from "../../../../core/domain/aggregates/user.aggregate";
import {UserAggregateDTO} from "./user.aggregate.dto";
import {UserRoles} from "../../../../core/domain/constants/userRoles.constants";
import {UpdateProfileDTO} from "../../../../infrastructure/driving/dtos/user.dto";
import {Person} from "../../../../core/domain/entities/person.entity";
export interface UserAggregatePort {
    save(user: Partial<UserAggregateDTO>): Promise<User>;
    findById(id: string, isPasswordRequired: boolean): Promise<User | null>;
    findByEmail(
        email: string,
        isPasswordRequired: boolean
    ): Promise<User | null>;
    findBySlug(
        userSlug: string,
        isPasswordRequired: boolean
    ): Promise<User | null>;
    setRThash(hash: string | null, id: string): Promise<boolean>;
    getUsers(
        filter: FindOptionsWhere<User>,
        page: number,
        numberOfUser: number
    ): Promise<{users: User[]; totalNumberOfUsers: number}>;
    updateUserRole(id: string, roles: UserRoles[]): Promise<boolean>;
    updateProfile(
        oldUser: User,
        updateDetails: UpdateProfileDTO
    ): Promise<User>;
    getUserApplication(userId: string): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
    updateUserPassword(person: Person, passwordHash: string): Promise<boolean>;
}
export const USER_AGGREGATE_PORT = Symbol("UserAggregatePort");
