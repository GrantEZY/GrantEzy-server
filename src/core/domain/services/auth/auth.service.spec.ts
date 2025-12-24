import {AuthService} from "./auth.service";
import {Test, TestingModule} from "@nestjs/testing";
import {createMock} from "@golevelup/ts-jest";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    PASSWORD_HASHER_PORT,
    PasswordHasherPort,
} from "../../../../ports/outputs/crypto/hash.port";
import {JWT_PORT, JwtPort} from "../../../../ports/outputs/crypto/jwt.port";
import {
    ForgotPasswordEntity,
    LOGIN_DATA,
    REGISTER_USER,
    SAVED_USER,
} from "./auth.service.mock.data";
import ApiError from "../../../../shared/errors/api.error";
import {UserRoles} from "../../constants/userRoles.constants";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
import {
    ForgotPasswordAggregatePort,
    FORGOT_PASSWORD_PORT,
} from "../../../../ports/outputs/repository/forgotpassword/forgotpassword.aggregate.port";
describe("AuthService", () => {
    let authService: AuthService;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let passwordHasher: jest.Mocked<PasswordHasherPort>;
    let jwtRepository: jest.Mocked<JwtPort>;
    let emailQueue: jest.Mocked<EmailQueue>;
    let forgotPasswordRepository: jest.Mocked<ForgotPasswordAggregatePort>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: PASSWORD_HASHER_PORT,
                    useValue: createMock<PasswordHasherPort>(),
                },
                {
                    provide: JWT_PORT,
                    useValue: createMock<JwtPort>(),
                },
                {
                    provide: FORGOT_PASSWORD_PORT,
                    useValue: createMock<ForgotPasswordAggregatePort>(),
                },
                {
                    provide: EmailQueue,
                    useValue: createMock<EmailQueue>(),
                },
            ],
        }).compile();

        authService = moduleReference.get<AuthService>(AuthService);
        userAggregateRepository = moduleReference.get(USER_AGGREGATE_PORT);
        passwordHasher = moduleReference.get(PASSWORD_HASHER_PORT);
        jwtRepository = moduleReference.get(JWT_PORT);
        emailQueue = moduleReference.get(EmailQueue) as jest.Mocked<EmailQueue>;
        forgotPasswordRepository = moduleReference.get(
            FORGOT_PASSWORD_PORT
        ) as jest.Mocked<ForgotPasswordAggregatePort>;
    });

    it("should be defined", () => {
        expect(authService).toBeDefined();
    });

    it("Register a User Successfully", async () => {
        const user = REGISTER_USER;

        userAggregateRepository.findByEmail.mockResolvedValue(null);
        passwordHasher.hash.mockResolvedValue("password_hash");
        userAggregateRepository.save.mockResolvedValue(SAVED_USER as any);

        const result = await authService.register(user);

        expect(result).toEqual({
            status: 201,
            message: "User registered successfully",
            res: {
                id: SAVED_USER.personId,
                email: SAVED_USER.contact.email,
            },
        });
    });

    describe("Register", () => {
        it("User Email already Exists", async () => {
            try {
                const user = REGISTER_USER;

                userAggregateRepository.findByEmail.mockResolvedValue(
                    user as any
                );

                await authService.register(user);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError)?.status!).toBe(409);
                expect((error as ApiError).message).toBe(
                    "Email already in use"
                );
            }
        });

        it("Handle unexpected Error in Register", async () => {
            try {
                const user = REGISTER_USER;

                userAggregateRepository.findByEmail.mockImplementation(() => {
                    throw new Error("SomeThing went wrong");
                });
                await authService.register(user);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });

    describe("Validation Of User", () => {
        it("Validate user Successfully", async () => {
            try {
                const loginData = LOGIN_DATA;
                const dbData = SAVED_USER;
                userAggregateRepository.findByEmail.mockResolvedValue(
                    dbData as any
                );
                passwordHasher.compare.mockResolvedValue(true);
                const result = await authService.validateUser(loginData);

                expect(result).toEqual({
                    status: 200,
                    message: "User validated successfully",
                    res: {
                        user: dbData,
                    },
                });
            } catch (error) {}
        });

        it("Validation: User Not Found", async () => {
            try {
                const loginData = LOGIN_DATA;
                userAggregateRepository.findByEmail.mockResolvedValue(null);
                await authService.validateUser(loginData);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("Validation : Password Incorrect", async () => {
            try {
                const loginData = LOGIN_DATA;
                const dbData = SAVED_USER;

                userAggregateRepository.findByEmail.mockResolvedValue(
                    dbData as any
                );
                passwordHasher.compare.mockImplementation(async () => {
                    return false;
                });
                await authService.validateUser(loginData);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(402);
                expect((error as ApiError).message).toBe(
                    "Password Is Incorrect"
                );
            }
        });
    });

    describe("After Login", () => {
        it("After Login : Signing Tokens", async () => {
            const user = SAVED_USER;
            const role = UserRoles.APPLICANT;
            const tokens = {
                accessToken: "access-token",
                refreshToken: "refresh-token",
            };
            jwtRepository.signTokens.mockResolvedValue(tokens);

            const result = await authService.login(user as any, role);
            expect(result.status).toBe(200);
            expect(result.message).toBe("Login Successful");
            expect(result.res).toStrictEqual({
                id: user.personId,
                email: user.contact.email,
                role,
                name: `${user.person.firstName} ${user.person.lastName}`,
                ...tokens,
            });
        });

        it("After Login : Error in signing JWT Tokens", async () => {
            try {
                const user = SAVED_USER;
                const role = UserRoles.APPLICANT;
                jwtRepository.signTokens.mockImplementation(() => {
                    throw new ApiError(
                        400,
                        "Error In Signing JWTs",
                        "JWT Error"
                    );
                });
                await authService.login(user as any, role);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Error In Signing JWTs"
                );
            }
        });
    });

    describe("Refresh", () => {
        it("Refresh : Successful refresh of AccessToken", async () => {
            try {
                const user = {
                    id: "111-23434-234345234-353456",
                    token_version: "1",
                };
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                const tokens = {
                    accessToken: "access-token",
                };
                jwtRepository.getAccessToken.mockResolvedValue(tokens);

                const result = await authService.refresh(user as any);

                expect(result).toBe({
                    status: 200,
                    message: "Access Token Created",
                    res: {
                        accessToken: tokens.accessToken,
                    },
                });
            } catch (error) {}
        });

        it("Refresh : Token Mismatch Error", async () => {
            try {
                const user = {
                    userData: {
                        payload: {
                            id: "111-23434-234345234-353456",
                            token_version: "2",
                        },
                    },
                };
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                await authService.refresh(user as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe("Token mismatch");
            }
        });
    });

    describe("Logout", () => {
        it("Logout : Successful RTHash change", async () => {
            try {
                const user = {
                    id: "111-23434-234345234-353456",
                };
                userAggregateRepository.setRThash.mockResolvedValue(true);

                const result = await authService.logout(user.id);
                expect(result).toBe({
                    status: 200,
                    message: "Logout Successful",
                    res: {
                        status: true,
                    },
                });
            } catch (error) {}
        });

        it("Logout : UnSuccessful RTHash change", async () => {
            try {
                const user = {
                    id: "111-23434-234345234-353456",
                };
                userAggregateRepository.setRThash.mockResolvedValue(false);

                await authService.logout(user.id);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Error in logging out the User"
                );
            }
        });
    });

    describe("Forgot Password", () => {
        it("Successful Forgot Password Registration", async () => {
            forgotPasswordRepository.getEntityByEmail.mockResolvedValue(null);

            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );

            forgotPasswordRepository.createForgotPasswordForEmail.mockResolvedValue(
                {token: "token", slug: "slug"}
            );

            emailQueue.addForgotPasswordEmailToQueue.mockResolvedValue({
                status: true,
            } as any);

            const result = await authService.forgotPassword({
                email: "john.doe@example.com",
            });

            expect(result).toEqual({
                status: 201,
                message: "Forgot Password Email Sent",
                res: {
                    status: true,
                },
            });
        });

        it("SuccessFully for already sent request", async () => {
            forgotPasswordRepository.getEntityByEmail.mockResolvedValue(
                ForgotPasswordEntity as any
            );

            forgotPasswordRepository.updateToken.mockResolvedValue({
                token: "token",
            } as any);

            emailQueue.addForgotPasswordEmailToQueue.mockResolvedValue({
                status: true,
            } as any);

            const result = await authService.forgotPassword({
                email: "john.doe@example.com",
            });

            expect(result).toEqual({
                status: 201,
                message: "Forgot Password Email Sent",
                res: {
                    status: true,
                },
            });

            expect(forgotPasswordRepository.updateToken).toHaveBeenCalled();
        });

        it("User Not Found", async () => {
            try {
                forgotPasswordRepository.getEntityByEmail.mockResolvedValue(
                    null
                );

                userAggregateRepository.findByEmail.mockResolvedValue(null);

                await authService.forgotPassword({
                    email: "john.doe@example.com",
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });
    });

    describe("Update Password", () => {
        it("Successful Updation of Password", async () => {
            forgotPasswordRepository.getEntityBySlug.mockResolvedValue(
                ForgotPasswordEntity as any
            );

            passwordHasher.compare.mockResolvedValue(true);

            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );

            passwordHasher.hash.mockResolvedValue("hashed-pass");

            userAggregateRepository.updateUserPassword.mockResolvedValue(true);

            forgotPasswordRepository.deleteAEntity.mockResolvedValue(true);

            const result = await authService.updatePassword({
                token: "token",
                slug: "slug",
                newPassword: "password",
            });

            expect(result).toEqual({
                status: 204,
                message: "Password Updated",
                res: {
                    status: true,
                },
            });
        });

        it("Request Not Found", async () => {
            try {
                forgotPasswordRepository.getEntityBySlug.mockResolvedValue(
                    null
                );

                await authService.updatePassword({
                    token: "token",
                    slug: "slug",
                    newPassword: "password",
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Forgot Password Request Not Initiated"
                );
            }
        });

        it("Token Not Valid", async () => {
            try {
                forgotPasswordRepository.getEntityBySlug.mockResolvedValue(
                    ForgotPasswordEntity as any
                );

                passwordHasher.compare.mockResolvedValue(false);

                await authService.updatePassword({
                    token: "token",
                    slug: "slug",
                    newPassword: "password",
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe("Token is not valid");
            }
        });

        it("TimeLimit has exceeded", async () => {
            try {
                const deplayedEntity = JSON.parse(
                    JSON.stringify(ForgotPasswordEntity)
                );
                deplayedEntity.verification.validTill = new Date(
                    "2015-10-13T10:00:00.000Z"
                );
                forgotPasswordRepository.getEntityBySlug.mockResolvedValue(
                    deplayedEntity as any
                );

                passwordHasher.compare.mockResolvedValue(true);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe("Token is not valid");
            }
        });
    });
});
