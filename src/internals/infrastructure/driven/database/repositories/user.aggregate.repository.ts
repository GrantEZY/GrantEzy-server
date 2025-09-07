import UserAggregatePort from "../../../../core/ports/outputs/repository/user/user.aggregate.port";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../../../core/domain/aggregates/user.aggregate";
import {UserAggregateDTO} from "../../../../core/ports/outputs/repository/user/user.aggregate.dto";
import {Contact} from "../../../../core/domain/value-objects/contact.object";
import {Person} from "../../../../core/domain/entities/person.entity";
import ApiError from "../../../../shared/errors/api.error";

@Injectable()
export class UserAggregateRepository implements UserAggregatePort {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>
    ) {}

    /**
     * Saves  a user entity in the database.
     * @param user - The user entity to be saved or updated in the database.
     * @returns The saved or updated user entity.
     * @throws ApiError if there is an issue during the save operation.
     */
    async save(user: UserAggregateDTO): Promise<User> {
        try {
            const contact = new Contact(user.email, null, null);

            const person = this.personRepository.create({
                firstName: user.firstName,
                lastName: user.lastName,
                password_hash: user.password_hash,
            });

            const savedPerson = await this.personRepository.save(person);

            const newUser = this.userRepository.create({
                person: savedPerson,
                contact: contact,
                commitment: user.commitment,
            });
            return await this.userRepository.save(newUser);
        } catch (error) {
            console.error("Save user error:", error);
            throw new ApiError(400, "Failed to save user", "Database Error");
        }
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
        return await this.userRepository
            .createQueryBuilder("user")
            .where("user.contact ->> 'email' = :email", {email})
            .getOne();
    }
}
