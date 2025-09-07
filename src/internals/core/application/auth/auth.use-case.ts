import {Injectable, Inject} from "@nestjs/common";
import UserAggregatePort, {
    USER_AGGREGATE_PORT,
} from "../../ports/outputs/repository/user/user.aggregate.port";
import {RegisterDTO} from "../../../infrastructure/driving/dtos/auth.dto";
import ApiError from "../../../shared/errors/api.error";
import {PasswordHasherPort} from "../../ports/outputs/crypto/hash.port";
import {PASSWORD_HASHER_PORT} from "../../ports/outputs/crypto/hash.port";
import {SignUpResponse} from "../../../infrastructure/driven/response-dtos/auth.response-dto";
@Injectable()
/**
 * Auth Use Case
 * Handles authentication-related business logic
 * (e.g., user registration, login, password management)
 */
export class AuthUseCase {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(PASSWORD_HASHER_PORT)
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
            const newUser = await this.userAggregateRepository.save({
                firstName: userData.firstName,
                lastName: userData.lastName,
                password_hash: hashedPassword,
                email: userData.email,
                commitment: userData.commitment,
            });
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
