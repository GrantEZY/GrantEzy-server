import {User} from "../../../domain/aggregates/user.aggregate";

export default interface UserAggregatePort {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
