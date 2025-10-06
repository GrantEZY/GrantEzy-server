import {UserSharedService} from "./shared.user.service";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    PASSWORD_HASHER_PORT,
    PasswordHasherPort,
} from "../../../../../ports/outputs/crypto/hash.port";
import ApiError from "../../../../../shared/errors/api.error";
import {TestingModule, Test} from "@nestjs/testing";
import {createMock} from "@golevelup/ts-jest";
import {ADD_USER, SAVED_USER} from "./shared.user.mock.data";
import {User} from "../../../aggregates/user.aggregate";
import {UserRoles} from "../../../constants/userRoles.constants";
import {EmailQueue} from "../../../../../infrastructure/driven/queue/queues/email.queue";
describe("SharedUserService", () => {
    let userSharedService: UserSharedService;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let passwordHasher: jest.Mocked<PasswordHasherPort>;
    let saved_user: User;
    let emailQueue: jest.Mocked<EmailQueue>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                UserSharedService,
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: PASSWORD_HASHER_PORT,
                    useValue: createMock<PasswordHasherPort>(),
                },
                {
                    provide: EmailQueue,
                    useValue: createMock<EmailQueue>(),
                },
            ],
        }).compile();

        userSharedService =
            moduleReference.get<UserSharedService>(UserSharedService);
        userAggregateRepository = moduleReference.get(USER_AGGREGATE_PORT);
        passwordHasher = moduleReference.get(PASSWORD_HASHER_PORT);
        saved_user = JSON.parse(JSON.stringify(SAVED_USER)) as User;
        emailQueue = moduleReference.get(EmailQueue) as jest.Mocked<EmailQueue>;
    });

    it("to be defined", () => {
        expect(userSharedService).toBeDefined();
    });

    describe("Add Invited User", () => {
        it("Add User: Successfully add user", async () => {
            const user = ADD_USER;

            const passwordHash = "mocked_hashed_password";
            passwordHasher.hash.mockResolvedValue(passwordHash);

            userAggregateRepository.save.mockResolvedValue(saved_user as any);

            emailQueue.addInviteEmailToQueue.mockResolvedValue({
                status: true,
                queue: {
                    name: "job-name",
                },
            });

            const result = await userSharedService.addUser(user);

            expect(result).toEqual({
                status: 201,
                message: "User Added Successfully",
                res: {
                    id: saved_user.personId,
                    email: saved_user.contact.email,
                },
            });
        });

        it("Add User: Error in sending invite for added user", async () => {
            try {
                const user = ADD_USER;

                const passwordHash = "mocked_hashed_password";
                passwordHasher.hash.mockResolvedValue(passwordHash);

                userAggregateRepository.save.mockResolvedValue(
                    saved_user as any
                );

                emailQueue.addInviteEmailToQueue.mockImplementation(() => {
                    throw new ApiError(
                        500,
                        "Issue In Sending Email",
                        "Email Queue Error"
                    );
                });

                await userSharedService.addUser(user);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(500);
                expect((error as ApiError).message).toBe(
                    "Issue In Sending Email"
                );
            }
        });
    });

    describe("Automated Update  User Role", () => {
        it("Add User role :User already has the role", async () => {
            const user = JSON.parse(JSON.stringify(SAVED_USER));
            user.role = ["NORMAL_USER", UserRoles.ADMIN];

            userAggregateRepository.findById.mockResolvedValue(user as any);

            const result = await userSharedService.addUserRole(
                "user-123",
                UserRoles.ADMIN
            );

            expect(result).toBe(true);
            expect(
                userAggregateRepository.updateUserRole
            ).toHaveBeenCalledTimes(0);
        });

        it("Add User role :User doesn't have the role", async () => {
            const user = JSON.parse(JSON.stringify(SAVED_USER));

            userAggregateRepository.findById.mockResolvedValue(user as any);

            userAggregateRepository.updateUserRole.mockResolvedValue(true);
            const result = await userSharedService.addUserRole(
                "user-123",
                UserRoles.ADMIN
            );

            expect(result).toBe(true);
            expect(
                userAggregateRepository.updateUserRole
            ).toHaveBeenCalledTimes(1);
        });

        it("User Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(null);
                await userSharedService.addUserRole(
                    "user-123",
                    UserRoles.ADMIN
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });
    });

    describe("Add User Role", () => {
        it("Add User Role : Successful updation of role", async () => {
            const userDetails = {
                email: "tylerdurden@gmail.com",
                type: "ADD_ROLE",
                role: "ADMIN",
            };

            userAggregateRepository.findByEmail.mockResolvedValue(
                saved_user as any
            );

            userAggregateRepository.updateUserRole.mockResolvedValue(true);

            const result = await userSharedService.updateUserRole(
                userDetails as any,
                saved_user as any
            );

            expect(result).toEqual({
                status: 200,
                message: "User role Updated",
                res: {
                    id: saved_user.personId,
                    role: userDetails.role,
                },
            });
        });

        it("Add User Role : User Already has the role", async () => {
            try {
                const userDetails = {
                    email: "tylerdurden@gmail.com",
                    type: "ADD_ROLE",
                    role: "NORMAL_USER",
                };

                userAggregateRepository.findByEmail.mockResolvedValue(
                    saved_user as any
                );
                await userSharedService.updateUserRole(
                    userDetails as any,
                    saved_user as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(401);
                expect((error as ApiError).message).toBe(
                    "User already has the role privileges"
                );
            }
        });

        it("Add User Role : DB Error", async () => {
            try {
                const userDetails = {
                    email: "tylerdurden@gmail.com",
                    type: "ADD_ROLE",
                    role: "ADMIN",
                };

                userAggregateRepository.findByEmail.mockResolvedValue(
                    saved_user as any
                );
                userAggregateRepository.updateUserRole.mockResolvedValue(false);

                await userSharedService.updateUserRole(
                    userDetails as any,
                    saved_user as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(500);
                expect((error as ApiError).message).toBe(
                    "Error in Updating User Role"
                );
            }
        });
    });

    describe("Delete User", () => {
        it("Delete User : Successful deletion", async () => {
            userAggregateRepository.deleteUser.mockResolvedValue(true);

            const result = await userSharedService.deleteUser(
                saved_user.personId
            );

            expect(result).toEqual({
                status: 200,
                message: "User Deleted Successfully",
                res: {
                    status: true,
                },
            });
        });
    });

    describe("Delete User Role", () => {
        it("Delete User Role : Successful deletion of role", async () => {
            const userDetails = {
                email: "tylerdurden@gmail.com",
                type: "DELETE_ROLE",
                role: "NORMAL_USER",
            };

            saved_user.role.push("DIRECTOR" as any);
            userAggregateRepository.findByEmail.mockResolvedValue(
                saved_user as any
            );

            userAggregateRepository.updateUserRole.mockResolvedValue(true);

            const result = await userSharedService.updateUserRole(
                userDetails as any,
                saved_user as any
            );

            expect(result).toEqual({
                status: 200,
                message: "User role Updated",
                res: {
                    id: saved_user.personId,
                    role: userDetails.role,
                },
            });
        });

        it("Delete User Role : User should have atleast one role", async () => {
            try {
                const userDetails = {
                    email: "tylerdurden@gmail.com",
                    type: "DELETE_ROLE",
                    role: "NORMAL_USER",
                };

                userAggregateRepository.findByEmail.mockResolvedValue(
                    saved_user as any
                );

                userAggregateRepository.updateUserRole.mockResolvedValue(true);

                await userSharedService.updateUserRole(
                    userDetails as any,
                    saved_user as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "User Should have at least one Role"
                );
            }
        });

        it("Delete User Role : User should have atleast one role", async () => {
            try {
                const userDetails = {
                    email: "tylerdurden@gmail.com",
                    type: "DELETE_ROLE",
                    role: "ADMIN",
                };

                userAggregateRepository.findByEmail.mockResolvedValue(
                    saved_user as any
                );

                userAggregateRepository.updateUserRole.mockResolvedValue(true);

                await userSharedService.updateUserRole(
                    userDetails as any,
                    saved_user as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(401);
                expect((error as ApiError).message).toBe(
                    "User don't  have the role privileges"
                );
            }
        });
    });
});
