import {Injectable, Inject} from "@nestjs/common";
import {
    GCVMemberAddDTO,
    GetAllGCVUsersDTO,
    UpdateGCVUserRoleDTO,
} from "../../../../infrastructure/driving/dtos/gcv.dto";
import {USER_AGGREGATE_PORT} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {UserAggregatePort} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {UserSharedService} from "../shared/user/shared.user.service";
import {UpdateRole} from "../../../../infrastructure/driving/dtos/shared/shared.user.dto";
import {UserRoles} from "../../constants/userRoles.constants";
import ApiError from "../../../../shared/errors/api.error";
import {
    AddGCVUserDataResponse,
    GetGCVUsersDataResponse,
    UpdateUserDataResponse,
} from "../../../../infrastructure/driven/response-dtos/gcv.response-dto";

@Injectable()
/**
 * This is the GCV only service
 */
export class GCVService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        private readonly userSharedService: UserSharedService
    ) {}

    async addGCVMember(
        userData: GCVMemberAddDTO
    ): Promise<AddGCVUserDataResponse> {
        try {
            const {email} = userData;
            const user = await this.userAggregateRepository.findByEmail(
                email,
                false
            );
            const addRole = UpdateRole.ADD_ROLE;
            const role = UserRoles.COMMITTEE_MEMBER;
            if (user) {
                const {email} = user.contact;
                const updatedUser = await this.userSharedService.updateUserRole(
                    {email, type: addRole, role},
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
                }
            }
            return await this.userSharedService.addUser({
                email: userData.email,
                role,
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    async getAllGCVmembers(
        filterData: GetAllGCVUsersDTO
    ): Promise<GetGCVUsersDataResponse> {
        try {
            filterData.filter ??= {};
            filterData.filter.otherFilters ??= {};
            filterData.filter.otherFilters.isGCVmember = true;

            const page = filterData.page ?? 1;
            const numberOfResults = filterData.numberOfResults ?? 10;

            const {users, totalNumberOfUsers} =
                await this.userAggregateRepository.getUsers(
                    filterData.filter, //eslint-disable-line
                    page, //eslint-disable-line
                    numberOfResults // eslint-disable-line
                );

            if (users.length === 0) {
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
                message: "GCV Member Data for Filter",
                res: {users, totalNumberOfUsers},
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateGCVUserRole(
        userData: UpdateGCVUserRoleDTO
    ): Promise<UpdateUserDataResponse> {
        try {
            const {email} = userData;
            const user = await this.userAggregateRepository.findByEmail(
                email, // eslint-disable-line
                false
            );
            if (!user) {
                throw new ApiError(400, "User Not Found", "User conflict");
            }
            const data = {
                email: userData.email,
                type: userData.type,
                role: UserRoles.COMMITTEE_MEMBER,
            };
            return await this.userSharedService.updateUserRole(data, user);
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
