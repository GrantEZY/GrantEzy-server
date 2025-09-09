import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, FindOptionsWhere} from "typeorm";
import {User} from "../../../../core/domain/aggregates/user.aggregate";
import {UserAggregateDTO} from "../../../../ports/outputs/repository/user/user.aggregate.dto";
import {Contact} from "../../../../core/domain/value-objects/contact.object";
import {Person} from "../../../../core/domain/entities/person.entity";
import ApiError from "../../../../shared/errors/api.error";
import {UserAggregatePort} from "../../../../ports/outputs/repository/user/user.aggregate.port";
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
                lastName: user.firstName,
                password_hash: user.password_hash,
            });

            await this.personRepository.save(person);

            const newUser = this.userRepository.create({
                person: person,
                contact: contact,
                commitment: user.commitment,
                audit: null,
                experiences: null,
            });
            return await this.userRepository.save(newUser);
        } catch (error) {
            console.error("Save user error:", error);
            throw new ApiError(502, "Failed to save user", "Database Error");
        }
    }

    /**
     * Finds a user entity by its unique identifier.
     * @param id - The unique identifier of the user to be retrieved.
     * @returns The user entity if found, otherwise null.
     */
    async findById(id: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({where: {personId: id}});
        } catch (error) {
            console.error("Find user by ID error:", error);
            throw new ApiError(
                502,
                "Failed to find user by ID",
                "Database Error"
            );
        }
    }

    /**
     * Finds a user entity by its email address.
     * @param email - The email address of the user to be retrieved.
     * @returns The user entity if found, otherwise null.
     */
    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userRepository
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.person", "person")
                .where("user.contact ->> 'email' = :email", {email})
                .getOne();

            return user;
        } catch (error) {
            console.error(error);
            throw new ApiError(
                502,
                "Failed to find user by email",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param hash The RefreshToken hash for the user authentication
     * @param id The unique identifier for the user
     * @returns true if success , else false
     */

    async setRThash(hash: string | null, id: string): Promise<boolean> {
        try {
            const user = await this.findById(id);
            if (!user) {
                throw new ApiError(
                    400,
                    "User Not Found",
                    "User Removed from the application"
                );
            }

            user.person.rt_hash = hash;

            await this.userRepository.update({personId: id}, user);
            return true;
        } catch (error) {
            console.error("Error in setting RThash", error);
            throw new ApiError(
                502,
                "Failed to set User RT hash",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param filter Options for filtering out to search the user
     * @param page number of page for pagination
     * @param numberOfUsers number of Users in the page
     * @returns User[] of the retrieved users.
     */

    async getUsers(
        filter: FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined,
        page: number,
        numberOfUsers: number
    ): Promise<{users: User[]; totalNumberOfUsers: number}> {
        try {
            const users = await this.userRepository.find({
                where: filter,
                skip: (page - 1) * numberOfUsers,
                take: numberOfUsers,
                order: {
                    createdAt: "DESC",
                },
            });

            const totalNumberOfUsers = await this.userRepository
                .createQueryBuilder("user")
                .getCount();

            return {
                users,
                totalNumberOfUsers,
            };
        } catch (error) {
            console.error("Error in fetching Users", error);
            throw new ApiError(
                502,
                "User Details Fetching Error",
                "Database Error"
            );
        }
    }
}
