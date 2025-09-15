import {AdminService} from "./admin.service";
import {TestingModule, Test} from "@nestjs/testing";
import {createMock} from "@golevelup/ts-jest";
import {UserSharedService} from "../shared/user/shared.user.service";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {GET_USERS_FETCH, USERS_ARRAY} from "./admin.service.mock.data";
import ApiError from "../../../../shared/errors/api.error";
import {
    SAVED_USER,
    SAVED_ORGANIZATION,
    OrganizationData,
    EXISTING_ORGANIZATIONS,
} from "./admin.service.mock.data";
import {SharedOrganizationService} from "../shared/organization/shared.organization.service";
describe.only("AdminService", () => {
    let userSharedService: UserSharedService;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let adminService: AdminService;
    let sharedOrganisationService: SharedOrganizationService;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: UserSharedService,
                    useValue: createMock<UserSharedService>(),
                },
                {
                    provide: SharedOrganizationService,
                    useValue: createMock<SharedOrganizationService>(),
                },
            ],
        }).compile();

        userSharedService = moduleReference.get(
            UserSharedService
        ) as jest.Mocked<UserSharedService>;
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;
        adminService = moduleReference.get(AdminService);
        sharedOrganisationService = moduleReference.get(
            SharedOrganizationService
        );
    });

    it("To be Defined", () => {
        expect(AdminService).toBeDefined();
    });

    describe("Get All Users", () => {
        it("Get All Users: Successful Fetch", async () => {
            const filterData = GET_USERS_FETCH;
            const usersData = USERS_ARRAY;

            userAggregateRepository.getUsers.mockResolvedValue({
                users: usersData as any,
                totalNumberOfUsers: 4,
            });

            const result = await adminService.getAllUsers(filterData as any);

            expect(result).toEqual({
                status: 200,
                message: "User Data for Filter",
                res: {
                    users: usersData,
                    totalNumberOfUsers: 4,
                },
            });
        });

        it("Get All Users: No Users Present", async () => {
            const filterData = GET_USERS_FETCH;

            userAggregateRepository.getUsers.mockResolvedValue({
                users: [],
                totalNumberOfUsers: 0,
            });

            const result = await adminService.getAllUsers(filterData as any);

            expect(result).toEqual({
                status: 200,
                message: "No User present",
                res: {
                    users: [],
                    totalNumberOfUsers: 0,
                },
            });
        });

        it("Get All Users : ApiError", async () => {
            const filterData = GET_USERS_FETCH;

            userAggregateRepository.getUsers.mockImplementation(() => {
                throw new ApiError(400, "Database Error", "ApiError");
            });
            await expect(
                adminService.getAllUsers(filterData as any)
            ).rejects.toThrow(ApiError);
            await expect(
                adminService.getAllUsers(filterData as any)
            ).rejects.toMatchObject({
                status: 400,
                message: "Database Error",
            });
        });
    });

    describe("Add User", () => {
        it("Admin Add User: Add Role to New User", async () => {
            const userDetails = {
                email: "john.doe@example.com",
                role: "NORMAL_USER",
            };

            userAggregateRepository.findByEmail.mockResolvedValue(null);

            (userSharedService.addUser as jest.Mock).mockResolvedValue({
                status: 201,
                message: "User Added Successfully",
                res: SAVED_USER,
            });

            const result = await adminService.addUser(userDetails as any);

            expect(result).toEqual({
                status: 201,
                message: "User Added Successfully",
                res: SAVED_USER,
            });
        });

        it("Admin Add User : ApiError", async () => {
            const userDetails = {email: "tylerdurden@gmail.com", role: "ADMIN"};

            try {
                userAggregateRepository.findByEmail.mockResolvedValue(null);

                (userSharedService.addUser as jest.Mock).mockImplementation(
                    () => {
                        throw new ApiError(
                            400,
                            "Shared Service Error",
                            "ApiError"
                        );
                    }
                );
                await adminService.addUser(userDetails as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Shared Service Error"
                );
            }
        });
    });

    describe("Update User Role", () => {
        it("Admin Update User: Add Role to Existing User", async () => {
            const userDetails = {
                email: "john.doe@example.com",
                role: "ADMIN",
            };

            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );

            (userSharedService.updateUserRole as jest.Mock).mockResolvedValue({
                status: 200,
                message: "User role updated",
                res: {
                    id: SAVED_USER.personId,
                    email: SAVED_USER.contact.email,
                },
            });

            const result = await adminService.addUser(userDetails as any);

            expect(result).toEqual({
                status: 200,
                message: "User Role Added",
                res: {
                    id: SAVED_USER.personId,
                    email: SAVED_USER.contact.email,
                },
            });
        });

        it("Update data for existing user", async () => {
            const userDetails = {
                email: "john.doe@example.com",
                role: "ADMIN",
            };
            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );

            (userSharedService.updateUserRole as jest.Mock).mockResolvedValue({
                status: 200,
                message: "User role updated",
                res: {
                    id: SAVED_USER.personId,
                    email: SAVED_USER.contact.email,
                },
            });

            const result = await adminService.updateUserRole(
                userDetails as any
            );

            expect(userSharedService.updateUserRole).toHaveBeenCalledWith(
                userDetails,
                SAVED_USER
            );
            expect(result).toEqual({
                status: 200,
                message: "User role updated",
                res: {
                    id: SAVED_USER.personId,
                    email: SAVED_USER.contact.email,
                },
            });
        });

        it("Update data for  non-existing user", async () => {
            try {
                const userDetails = {
                    email: "john.doe@example.com",
                    role: "ADMIN",
                };
                userAggregateRepository.findByEmail.mockResolvedValue(null);

                await adminService.updateUserRole(userDetails as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("Admin Update User : ApiError", async () => {
            const userDetails = {email: "tylerdurden@gmail.com", role: "ADMIN"};

            (userSharedService.updateUserRole as jest.Mock).mockImplementation(
                () => {
                    throw new ApiError(400, "Shared Service Error", "ApiError");
                }
            );

            await expect(
                adminService.updateUserRole(userDetails as any)
            ).rejects.toThrow(ApiError);
            await expect(
                adminService.updateUserRole(userDetails as any)
            ).rejects.toMatchObject({
                status: 400,
                message: "Shared Service Error",
            });
        });
    });

    describe("Delete User", () => {
        it("Delete existing user", async () => {
            const userDetails = {email: "john.doe@example.com"};
            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );

            (userSharedService.deleteUser as jest.Mock).mockResolvedValue({
                status: 200,
                message: "User Deleted Successfully",
                res: {
                    status: true,
                },
            });

            const result = await adminService.deleteUser(userDetails as any);

            expect(result).toEqual({
                status: 200,
                message: "User Deleted Successfully",
                res: {
                    status: true,
                },
            });
        });

        it("Delete non-existing user", async () => {
            try {
                const userDetails = {email: "john.doe@example.com"};
                userAggregateRepository.findByEmail.mockResolvedValue(null);

                await adminService.deleteUser(userDetails as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("Admin Delete User : ApiError", async () => {
            const userDetails = {email: "tylerdurden@gmail.com"};

            (userSharedService.deleteUser as jest.Mock).mockImplementation(
                () => {
                    throw new ApiError(400, "Shared Service Error", "ApiError");
                }
            );

            await expect(
                adminService.deleteUser(userDetails as any)
            ).rejects.toThrow(ApiError);
            await expect(
                adminService.deleteUser(userDetails as any)
            ).rejects.toMatchObject({
                status: 400,
                message: "Shared Service Error",
            });
        });
    });

    describe("Add Organization", () => {
        it("Add Organization", async () => {
            (
                sharedOrganisationService.createOrganization as jest.Mock
            ).mockResolvedValue(SAVED_ORGANIZATION);

            const result = await adminService.addOrganization(OrganizationData);
            expect(result).toEqual({
                status: 201,
                message: "Organization created successfully",
                res: {
                    id: SAVED_ORGANIZATION.id,
                    name: SAVED_ORGANIZATION.name,
                    type: SAVED_ORGANIZATION.type,
                },
            });
        });

        it("Add Organization with existing Name", async () => {
            try {
                (
                    sharedOrganisationService.createOrganization as jest.Mock
                ).mockImplementation(() => {
                    throw new ApiError(
                        400,
                        "Organization with this name already exists",
                        "Bad Request"
                    );
                });

                await adminService.addOrganization(OrganizationData);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Organization with this name already exists"
                );
            }
        });
    });

    describe("Get All Organizations", () => {
        it("Get All Organizations For Admin", async () => {
            // mock the method properly
            (
                sharedOrganisationService.getAllOrganizations as jest.Mock
            ).mockResolvedValue(EXISTING_ORGANIZATIONS as any);

            const result = await adminService.getOrganizations();

            expect(result).toEqual({
                status: 200,
                message: "Organizations fetched successfully",
                res: {
                    organizations: EXISTING_ORGANIZATIONS,
                },
            });
        });
    });

    describe("UpdateOrganizations", () => {
        it("Successfull Updation of Data", async () => {
            (
                sharedOrganisationService.updateOrganization as jest.Mock
            ).mockResolvedValue({
                id: "old Id",
                name: "new Organization",
                type: "New Type",
            });

            const result = await adminService.updateOrganization({
                ...OrganizationData,
                id: "old Id",
            });

            expect(result).toEqual({
                status: 200,
                message: "Organization updated successfully",
                res: {
                    id: "old Id",
                    name: "new Organization",
                    type: "New Type",
                },
            });
        });

        it("Conflict Error While Updation", async () => {
            try {
                (
                    sharedOrganisationService.updateOrganization as jest.Mock
                ).mockImplementation(() => {
                    throw new ApiError(
                        404,
                        "Organization not found",
                        "Not Found"
                    );
                });
                await adminService.updateOrganization({
                    ...OrganizationData,
                    id: "old Id",
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Organization not found"
                );
            }
        });
    });

    describe("Delete Organization", () => {
        it("Delete Organization Successfully", async () => {
            (
                sharedOrganisationService.deleteOrganization as jest.Mock
            ).mockResolvedValue(true);

            const result = await adminService.deleteOrganization("org:123");

            expect(result).toEqual({
                status: 200,
                message: "Organization deleted successfully",
                res: {
                    success: true,
                },
            });
        });

        it("Conflict Error While deletion", async () => {
            try {
                (
                    sharedOrganisationService.deleteOrganization as jest.Mock
                ).mockImplementation(() => {
                    throw new ApiError(
                        404,
                        "Organization not found",
                        "Not Found"
                    );
                });
                await adminService.deleteOrganization("org:123");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Organization not found"
                );
            }
        });
    });
});
