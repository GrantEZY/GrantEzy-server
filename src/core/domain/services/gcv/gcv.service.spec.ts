import {TestingModule, Test} from "@nestjs/testing";
import {GCVService} from "./gcv.service";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {UserSharedService} from "../shared/user/shared.user.service";
import {createMock} from "@golevelup/ts-jest";
import {SAVED_USER} from "./gcv.service.mock.data";
import ApiError from "../../../../shared/errors/api.error";

describe("GCV Service", () => {
    let gcvService: GCVService;
    let userSharedService: UserSharedService;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                GCVService,
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
        gcvService = moduleReference.get(GCVService);
    });

    it("To be Defined", () => {
        expect(GCVService).toBeDefined();
    });

    it('Add GCV Member: Should add role "COMMITTEE_MEMBER" to existing user', async () => {
        const userData = {
            email: "john.doe@example.com",
        };

        userAggregateRepository.findByEmail.mockResolvedValue(
            SAVED_USER as any
        );
        (userSharedService.updateUserRole as jest.Mock).mockResolvedValue({
            status: 200,
            message: "User Role Added",
            res: {
                id: "user-123",
                email: "john.doe@example.com",
            },
        });

        const result = await gcvService.addGCVMember(userData as any);

        expect(result).toEqual({
            status: 200,
            message: "User Role Added",
            res: {
                id: "user-123",
                email: "john.doe@example.com",
            },
        });
    });

    it('Add GCV Member: Should add role "COMMITTEE_MEMBER" to non-existing user', async () => {
        const userData = {
            email: "john.doe@example.com",
        };

        userAggregateRepository.findByEmail.mockResolvedValue(null);
        (userSharedService.addUser as jest.Mock).mockResolvedValue({
            status: 201,
            message: "User added Successfully",
            res: {
                id: "user-123",
                email: "john.doe@example.com",
            },
        });

        const result = await gcvService.addGCVMember(userData as any);

        expect(userSharedService.addUser).toHaveBeenCalledWith({
            email: "john.doe@example.com",
            role: "COMMITTEE_MEMBER",
        });
        expect(result).toEqual({
            status: 201,
            message: "User added Successfully",
            res: {
                id: "user-123",
                email: "john.doe@example.com",
            },
        });
    });

    it("Get All GCV Members: Should return list of GCV members when no filter provided", async () => {
        const filterData = {
            page: 1,
            numberOfResults: 10,
        };
        const mockUsers = [SAVED_USER];

        userAggregateRepository.getUsers.mockResolvedValue({
            users: mockUsers as any,
            totalNumberOfUsers: 1,
        });

        const result = await gcvService.getAllGCVmembers(filterData as any);

        expect(userAggregateRepository.getUsers).toHaveBeenCalledWith(
            {
                otherFilters: {isGCVmember: true},
            },
            1,
            10
        );
        expect(result).toEqual({
            status: 200,
            message: "GCV Member Data for Filter",
            res: {
                users: mockUsers,
                totalNumberOfUsers: 1,
            },
        });
    });

    it("Get All GCV Members: Should return list of GCV members when filter provided", async () => {
        const filterData = {
            filter: {
                otherFilters: {
                    role: "ADMIN",
                },
            },
            page: 1,
            numberOfResults: 10,
        };
        const mockUsers = [SAVED_USER];

        userAggregateRepository.getUsers.mockResolvedValue({
            users: mockUsers as any,
            totalNumberOfUsers: 1,
        });

        const result = await gcvService.getAllGCVmembers(filterData as any);

        expect(userAggregateRepository.getUsers).toHaveBeenCalledWith(
            {
                otherFilters: {isGCVmember: true, role: "ADMIN"},
            },
            1,
            10
        );
        expect(result).toEqual({
            status: 200,
            message: "GCV Member Data for Filter",
            res: {
                users: mockUsers,
                totalNumberOfUsers: 1,
            },
        });
    });

    it("Update User Role: Should update role of existing user", async () => {
        const userDetails = {email: "john.doe@example.com", type: "ADD_ROLE"};

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

        const result = await gcvService.updateGCVUserRole(userDetails as any);

        expect(userSharedService.updateUserRole).toHaveBeenCalledWith(
            {
                ...userDetails,
                type: "ADD_ROLE",
                role: "COMMITTEE_MEMBER",
            },
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
    it("Update User Role: Should throw error when user not found", async () => {
        const userDetails = {email: "john.doe@example.com"};

        userAggregateRepository.findByEmail.mockResolvedValue(null);

        await expect(
            gcvService.updateGCVUserRole(userDetails as any)
        ).rejects.toBeInstanceOf(ApiError);

        await expect(
            gcvService.updateGCVUserRole(userDetails as any)
        ).rejects.toMatchObject({
            status: 400,
            message: "User Not Found",
        });
    });
});
