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
describe("AdminService", () => {
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

        userSharedService =
            moduleReference.get<UserSharedService>(UserSharedService);
        userAggregateRepository = moduleReference.get(USER_AGGREGATE_PORT);
        adminService = moduleReference.get<AdminService>(AdminService);
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

    it("Admin Add User : ApiError", async () => {
        const userDetails = {email: "tylerdurden@gmail.com"};

        (userSharedService.addUser as jest.Mock).mockImplementation(() => {
            throw new ApiError(400, "Shared Service Error", "ApiError");
        });

        await expect(adminService.addUser(userDetails as any)).rejects.toThrow(
            ApiError
        );
        await expect(
            adminService.addUser(userDetails as any)
        ).rejects.toMatchObject({
            status: 400,
            message: "Shared Service Error",
        });
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
