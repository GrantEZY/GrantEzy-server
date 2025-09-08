import {Injectable, Inject} from "@nestjs/common";
import UserAggregatePort, {
    USER_AGGREGATE_PORT,
} from "../../ports/outputs/repository/user/user.aggregate.port";
import {
    LoginDTO,
    RegisterDTO,
} from "../../../infrastructure/driving/dtos/auth.dto";
import ApiError from "../../../shared/errors/api.error";
import {PasswordHasherPort} from "../../ports/outputs/crypto/hash.port";
import {PASSWORD_HASHER_PORT} from "../../ports/outputs/crypto/hash.port";
import {
    LocalLoginResponse,
    SignUpResponse,
    LogoutResponse,
    AccessTokenResponse,
} from "../../../infrastructure/driven/response-dtos/auth.response-dto";
import {UserRoles} from "../../domain/constants/userRoles.constants";
import {PassportResponseData} from "../../../infrastructure/driven/response-dtos/auth.response-dto";
import {User} from "../../domain/aggregates/user.aggregate";
import {JwtPort, JWT_PORT} from "../../ports/outputs/crypto/jwt.port";
import {JwtData} from "../../../shared/types/jwt.types";
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
        private readonly passwordHasher: PasswordHasherPort,
        @Inject(JWT_PORT)
        private readonly jwtRepository: JwtPort
    ) {}

    async register(userData: RegisterDTO): Promise<SignUpResponse> {
        try {
            const {email} = userData;
            const existingUser =
                await this.userAggregateRepository.findByEmail(email);
            if (existingUser) {
                throw new ApiError(
                    409,
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
                    id: newUser.personId,
                    email: newUser.contact.email,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async validateUser(userData: LoginDTO): Promise<PassportResponseData> {
        try {
            const {email, password} = userData;
            const user = await this.userAggregateRepository.findByEmail(email);
            if (!user) {
                throw new ApiError(401, "User not found ", "Login Issue");
            }
            const isPasswordValid = await this.passwordHasher.compare(
                password,
                user.person.password_hash
            );
            if (!isPasswordValid) {
                throw new ApiError(402, "Password is incorrect", "Login Issue");
            }
            // TODO  uncomment once authorization employed
            // const userRole = user.role;
            // if (role && userRole.includes(role as UserRoles)) {
            //     return {
            //         user,
            //         message: "User validated successfully",
            //     };
            // } else {
            //     throw new ApiError(
            //         403,
            //         "User doesn't have access to that role",
            //         "Login Issue"
            //     );
            // }

            return {
                user,
                message: "User validated successfully",
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(user: User, role: UserRoles): Promise<LocalLoginResponse> {
        try {
            const {contact, personId} = user;
            const jwtData = {
                email: contact.email,
                id: personId,
                role,
                token_version: user.tokenVersion,
            };

            const tokens = await this.jwtRepository.signTokens(jwtData);

            const response = {
                id: personId,
                email: contact.email,
                role,
                name: `${user.person.firstName} ${user.person.lastName}`,
                ...tokens,
            };
            return {
                status: 200,
                message: "Login Successful",
                res: response,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async refresh(userData: JwtData): Promise<AccessTokenResponse> {
        try {
            const {id, token_version: token} = userData;
            const user = await this.userAggregateRepository.findById(id);
            if (!user) {
                throw new ApiError(
                    401,
                    "User Not Found",
                    "User removed from the application"
                );
            }

            if (token != user.tokenVersion) {
                throw new ApiError(
                    403,
                    "Token mismatch",
                    "Version Token mismatch"
                );
            }

            const tokens = await this.jwtRepository.getAccessToken(userData);

            return {
                status: 200,
                message: "Access Token Created",
                res: {
                    accessToken: tokens.accessToken,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async logout(id: string): Promise<LogoutResponse> {
        try {
            const isUpdated = await this.userAggregateRepository.setRThash(
                null,
                id
            );
            if (isUpdated) {
                return {
                    status: 200,
                    message: "Logout Successful",
                    res: {
                        status: true,
                    },
                };
            }
            return {
                status: 400,
                message: "Error in logging out the User",
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
