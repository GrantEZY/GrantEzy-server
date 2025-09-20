import {Injectable, Inject} from "@nestjs/common";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {UserAccountResponse} from "../../../../infrastructure/driven/response-dtos/user.response-dto";
@Injectable()
/**
 * This file contains the services regarding the user
 */
export class UserService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort
    ) {}

    async getAccount(userId: string): Promise<UserAccountResponse> {
        try {
            const user = await this.userAggregateRepository.findById(
                userId,
                false
            );

            if (!user) {
                throw new ApiError(404, "User Not Found", "Not Found Error");
            }

            return {
                status: 200,
                message: "User Account Fetched",
                res: {user},
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
