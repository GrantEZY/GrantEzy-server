import UserAggregatePort from "../../../../core/ports/outputs/repository/user.aggregate.port";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../../../core/domain/aggregates/user.aggregate";

@Injectable()
export class UserAggregateRepository implements UserAggregatePort {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    /**
     * Saves  a user entity in the database.
     * @param user - The user entity to be saved or updated in the database.
     * @returns The saved or updated user entity.
     */
    async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    /**
     * Finds a user entity by its unique identifier.
     * @param id - The unique identifier of the user to be retrieved.
     * @returns The user entity if found, otherwise null.
     */
    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({where: {id}});
    }

    /**
     * Finds a user entity by its email address.
     * @param email - The email address of the user to be retrieved.
     * @returns The user entity if found, otherwise null.
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                contact: {
                    email: email,
                },
            },
        });
    }
}
