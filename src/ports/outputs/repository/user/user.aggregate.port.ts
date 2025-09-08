import {User} from "../../../../core/domain/aggregates/user.aggregate";
import {UserAggregateDTO} from "./user.aggregate.dto";

export default interface UserAggregatePort {
    save(user: Partial<UserAggregateDTO>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    setRThash(hash: string | null, id: string): Promise<boolean>;
}

export const USER_AGGREGATE_PORT = Symbol("UserAggregatePort");
