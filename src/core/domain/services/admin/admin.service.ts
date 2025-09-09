import {Inject, Injectable} from "@nestjs/common";
import ApiError from "../../../../shared/errors/api.error";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {GetAllUsersDTO} from "../../../../infrastructure/driving/dtos/admin.dto";
import {GetUsersDataResponse} from "../../../../infrastructure/driven/response-dtos/admin.response-dto";
@Injectable()
/**
 * This is the service for admin endpoints
 */
export class AdminService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort
    ) {}
    async getAllUsers(
        filterData: GetAllUsersDTO
    ): Promise<GetUsersDataResponse> {
        try {
            const {users, totalNumberOfUsers} =
                await this.userAggregateRepository.getUsers(
                    filterData.filter ?? {},
                    filterData.page,
                    filterData.numberOfResults
                );

            if (users.length == 0) {
                return {
                    status: 200,
                    message: "No User present",
                    res: {
                        users: [],
                        totalNumberOfUsers,
                    },
                };
            }
            return {
                status: 200,
                message: "User Data for Filter",
                res: {users, totalNumberOfUsers},
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
