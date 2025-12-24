import {Injectable, Inject} from "@nestjs/common";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    ForgotPasswordAggregatePort,
    FORGOT_PASSWORD_PORT,
} from "../../../../ports/outputs/repository/forgotpassword/forgotpassword.aggregate.port";
import {
    ForgotPasswordDTO,
    LoginDTO,
    RegisterDTO,
    UpdatePasswordDTO,
} from "../../../../infrastructure/driving/dtos/auth.dto";
import ApiError from "../../../../shared/errors/api.error";
import {PasswordHasherPort} from "../../../../ports/outputs/crypto/hash.port";
import {PASSWORD_HASHER_PORT} from "../../../../ports/outputs/crypto/hash.port";
import {
    LocalLoginResponse,
    SignUpResponse,
    LogoutResponse,
    AccessTokenResponse,
    ForgotPasswordResponse,
} from "../../../../infrastructure/driven/response-dtos/auth.response-dto";
import {UserRoles} from "../../constants/userRoles.constants";
import {PassportResponseData} from "../../../../infrastructure/driven/response-dtos/auth.response-dto";
import {User} from "../../aggregates/user.aggregate";
import {JwtPort, JWT_PORT} from "../../../../ports/outputs/crypto/jwt.port";
import {RefreshTokenJwt} from "../../../../shared/types/jwt.types";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
@Injectable()
/**
 * Auth Use Case
 * Handles authentication-related business logic
 * (e.g., user registration, login, password management)
 */
export class AuthService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(PASSWORD_HASHER_PORT)
        private readonly passwordHasher: PasswordHasherPort,
        @Inject(JWT_PORT)
        private readonly jwtRepository: JwtPort,
        @Inject(FORGOT_PASSWORD_PORT)
        private readonly forgotPasswordAggregateRepository: ForgotPasswordAggregatePort,
        private readonly emailQueue: EmailQueue
    ) {}

    async register(userData: RegisterDTO): Promise<SignUpResponse> {
        try {
            const {email} = userData;
            const existingUser = await this.userAggregateRepository.findByEmail(
                email,
                false
            );
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
                role: UserRoles.NORMAL_USER,
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
            const {email, password, role} = userData;
            const user = await this.userAggregateRepository.findByEmail(
                email,
                true
            );
            if (!user) {
                return {
                    status: 404,
                    user: null,
                    message: "User Not Found",
                };
            }
            const isPasswordValid = await this.passwordHasher.compare(
                password,
                user.person.password_hash
            );
            if (!isPasswordValid) {
                return {
                    status: 402,
                    user: null,
                    message: "Password Is Incorrect",
                };
            }
            const userRole = user.role;
            if (role && userRole.includes(role as UserRoles)) {
                return {
                    status: 200,
                    user,
                    message: "User validated successfully",
                };
            } else {
                throw new ApiError(
                    403,
                    "User doesn't have access to that role",
                    "Login Issue"
                );
            }
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

    async refresh(userData: RefreshTokenJwt): Promise<AccessTokenResponse> {
        try {
            const {userData: data} = userData;
            const {id, token_version: token} = data.payload;
            const user = await this.userAggregateRepository.findById(id, false);
            if (!user) {
                throw new ApiError(
                    404,
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

            const tokens = await this.jwtRepository.getAccessToken(
                data.payload
            );

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

    async forgotPassword(
        forgotPasswordDetails: ForgotPasswordDTO
    ): Promise<ForgotPasswordResponse> {
        try {
            const {email} = forgotPasswordDetails;

            const entity =
                await this.forgotPasswordAggregateRepository.getEntityByEmail(
                    email,
                    true
                );

            if (entity) {
                const verification = entity.verification;

                const {token} =
                    await this.forgotPasswordAggregateRepository.updateToken(
                        verification
                    );
                await this.emailQueue.addForgotPasswordEmailToQueue(email, {
                    email: entity.email,
                    token,
                    slug: entity.slug,
                });
                return {
                    status: 201,
                    message: "Forgot Password Email Sent",
                    res: {
                        status: true,
                    },
                };
            }

            const user = await this.userAggregateRepository.findByEmail(
                email,
                false
            );

            if (!user) {
                throw new ApiError(404, "User Not Found", "Conflict Error");
            }

            const {token, slug} =
                await this.forgotPasswordAggregateRepository.createForgotPasswordForEmail(
                    email
                );
            await this.emailQueue.addForgotPasswordEmailToQueue(email, {
                email: email,
                token,
                slug,
            });
            return {
                status: 201,
                message: "Forgot Password Email Sent",
                res: {
                    status: true,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async updatePassword(
        updatePasswordDetails: UpdatePasswordDTO
    ): Promise<ForgotPasswordResponse> {
        try {
            const {token, slug, newPassword} = updatePasswordDetails;
            const entity =
                await this.forgotPasswordAggregateRepository.getEntityBySlug(
                    slug,
                    true
                );

            if (!entity) {
                throw new ApiError(
                    404,
                    "Forgot Password Request Not Initiated",
                    "Not Found"
                );
            }

            const {token: tokenHash, validTill} = entity.verification;

            const isValid = await this.passwordHasher.compare(token, tokenHash);

            const isTimeValid = validTill > new Date();
            if (!isValid || !isTimeValid) {
                throw new ApiError(403, "Token is not valid", "Conflict Error");
            }

            const user = await this.userAggregateRepository.findByEmail(
                entity.email,
                false
            );

            if (!user) {
                throw new ApiError(404, "User Not Found", "Conflict Error");
            }
            const hashedPassword = await this.passwordHasher.hash(newPassword);
            const isPasswordUpdated =
                await this.userAggregateRepository.updateUserPassword(
                    user.person,
                    hashedPassword
                );

            if (!isPasswordUpdated) {
                throw new ApiError(500, "Unknown Error", "Server Error");
            }
            const isDeleted =
                await this.forgotPasswordAggregateRepository.deleteAEntity(
                    slug
                );

            if (!isDeleted) {
                throw new ApiError(500, "Unknown Error", "Server Error");
            }

            return {
                status: 204,
                message: "Password Updated",
                res: {
                    status: true,
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
