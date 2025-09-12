import {Inject, Injectable} from "@nestjs/common";
import ApiError from "../../../../shared/errors/api.error";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {GetAllUsersDTO} from "../../../../infrastructure/driving/dtos/admin.dto";
import {
    AddUserDTO,
    DeleteUserDTO,
    UpdateUserRoleDTO,
} from "../../../../infrastructure/driving/dtos/shared/shared.user.dto";
import {
    AddUserDataResponse,
    UpdateUserDataResponse,
    DeleteUserDataResponse,
} from "../../../../infrastructure/driven/response-dtos/shared.response-dto";
import {GetUsersDataResponse} from "../../../../infrastructure/driven/response-dtos/admin.response-dto";

import {UserSharedService} from "../shared/user/shared.user.service";
import {UpdateRole} from "../../../../infrastructure/driving/dtos/shared/shared.user.dto";
@Injectable()
/**
 * This is the service for admin endpoints
 */
export class AdminService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        private readonly userSharedService: UserSharedService
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

    async addUser(userData: AddUserDTO): Promise<AddUserDataResponse> {
        try {
            const {email, role} = userData;
            const user = await this.userAggregateRepository.findByEmail(
                email,
                false
            );
            const addRole = UpdateRole.ADD_ROLE;
            if (user) {
                const {email: userEmail} = user.contact;

                const updatedUser = await this.userSharedService.updateUserRole(
                    {email: userEmail, type: addRole, role},
                    user
                );

                const {status} = updatedUser;
                if (status == 200) {
                    return {
                        status: 200,
                        message: "User Role Added",
                        res: {
                            id: user.personId,
                            email,
                        },
                    };
                } else {
                    return {
                        status: 400,
                        message: "Error in Adding Role to Existing User",
                    };
                }
            }
            return await this.userSharedService.addUser(userData);
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateUserRole(
        userData: UpdateUserRoleDTO
    ): Promise<UpdateUserDataResponse> {
        try {
            const {email} = userData;
            const user = await this.userAggregateRepository.findByEmail(
                email,
                false
            );
            if (!user) {
                throw new ApiError(400, "User Not Found", "User conflict");
            }
            return await this.userSharedService.updateUserRole(userData, user);
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteUser(
        userDetails: DeleteUserDTO
    ): Promise<DeleteUserDataResponse> {
        try {
            const {email} = userDetails;
            const user = await this.userAggregateRepository.findByEmail(
                email,
                false
            );
            if (!user) {
                throw new ApiError(400, "User Not Found", "User conflict");
            }
            return await this.userSharedService.deleteUser(user.personId);
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
