import {Injectable} from "@nestjs/common";
import UserAggregatePort from "../../ports/outputs/repository/user.aggregate.port";
import {RegisterDTO} from "../../../infrastructure/driving/dtos/auth.dto";
import ApiError from "../../../shared/errors/api.error";
import {PasswordHasherPort} from "../../ports/outputs/crypto/hash.port";
import {Person} from "../../domain/entities/person.entity";
import {Contact} from "../../domain/value-objects/contact.object";
import {SignUpResponse} from "../../../infrastructure/driven/response-dtos/auth.response-dto";
@Injectable()
/**
 * Auth Use Case
 * Handles authentication-related business logic
 * (e.g., user registration, login, password management)
 */
export class AuthUseCase {
    constructor(
        private readonly userAggregateRepository: UserAggregatePort,
        private readonly passwordHasher: PasswordHasherPort
    ) {}

    async register(userData: RegisterDTO): Promise<SignUpResponse> {
        try {
            const {email} = userData;
            const existingUser =
                await this.userAggregateRepository.findByEmail(email);
            if (existingUser) {
                throw new ApiError(
                    400,
                    "Email already in use",
                    "Email Conflict"
                );
            }
            const hashedPassword = await this.passwordHasher.hash(
                userData.password
            );

            const person = new Person();
            person.firstName = userData.firstName;
            person.lastName = userData.lastName;
            person.password_hash = hashedPassword;

            const contact = new Contact(userData.email, null, null);
            const user = {
                person: person,
                contact: contact,
                commitment: userData.commitment,
                audit: null,
                experiences: null,
            };
            const newUser = await this.userAggregateRepository.save(user);
            return {
                status: 201,
                message: "User registered successfully",
                res: {
                    id: newUser.id,
                    email: newUser.contact.email,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
