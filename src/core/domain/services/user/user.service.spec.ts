import {Test, TestingModule} from "@nestjs/testing";
import {UserService} from "./user.service";
import ApiError from "../../../../shared/errors/api.error";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {SAVED_USER} from "./user.service.mock.data";
describe("UserService", () => {
    let userService: UserService;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
            ],
        }).compile();

        userService = moduleReference.get(UserService);
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;
    });

    it("To be defined", async () => {
        expect(userService).toBeDefined();
    });

    describe("Get User Profile", () => {
        it("Successful User Profile Fetch", async () => {
            userAggregateRepository.findById.mockResolvedValue(
                SAVED_USER as any
            );

            const result = await userService.getAccount("user-123");

            expect(result).toEqual({
                status: 200,
                message: "User Account Fetched",
                res: {
                    user: SAVED_USER,
                },
            });
        });

        it("User Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(null);

                await userService.getAccount("user-123");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });
    });
});
