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
import {SAVED_USER} from "./admin.service.mock.data";
describe.only("AdminService", () => {
    let userSharedService: UserSharedService;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let adminService: AdminService;

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
            ],
        }).compile();

        userSharedService = moduleReference.get(
            UserSharedService
        ) as jest.Mocked<UserSharedService>;
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;
        adminService = moduleReference.get(AdminService);
    });

    it("To be Defined", () => {
        expect(AdminService).toBeDefined();
    });

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

        const result = await adminService.updateUserRole(userDetails as any);

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

    it("Admin Add User : ApiError", async () => {
        const userDetails = {email: "tylerdurden@gmail.com", role: "ADMIN"};

        try {
            userAggregateRepository.findByEmail.mockResolvedValue(null);

            (userSharedService.addUser as jest.Mock).mockImplementation(() => {
                throw new ApiError(400, "Shared Service Error", "ApiError");
            });
            await adminService.addUser(userDetails as any);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).status).toBe(400);
            expect((error as ApiError).message).toBe("Shared Service Error");
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

    it("Admin Delete User : ApiError", async () => {
        const userDetails = {email: "tylerdurden@gmail.com"};

        (userSharedService.deleteUser as jest.Mock).mockImplementation(() => {
            throw new ApiError(400, "Shared Service Error", "ApiError");
        });

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
