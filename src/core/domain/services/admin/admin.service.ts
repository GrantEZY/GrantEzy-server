import {Inject, Injectable} from "@nestjs/common";
import ApiError from "../../../../shared/errors/api.error";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    AddUserDTO,
    GetAllUsersDTO,
} from "../../../../infrastructure/driving/dtos/admin.dto";
import {
    GetUsersDataResponse,
    AddUserDataResponse,
    AddUserData,
} from "../../../../infrastructure/driven/response-dtos/admin.response-dto";
import {UserCommitmentStatus} from "../../constants/commitment.constants";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../ports/outputs/crypto/hash.port";
@Injectable()
/**
 * This is the service for admin endpoints
 */
export class AdminService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(PASSWORD_HASHER_PORT)
        private readonly passwordHasherRepository: PasswordHasherPort
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
            const {email} = userData;
            const user = await this.userAggregateRepository.findByEmail(email);
            if (user) {
                throw new ApiError(400, "User Already Found", "User conflict");
            }

            const {user: newUser} = await this.addUserDetails(userData);
            const {personId, contact} = newUser;
            return {
                status: 201,
                message: "User Added Successfully",
                res: {
                    id: personId,
                    email: contact.email,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    private async addUserDetails(userData: AddUserDTO): Promise<AddUserData> {
        try {
            const {email, role} = userData;
            const [firstNamePart] = email.split("@");
            const firstName = firstNamePart;
            const lastName = firstNamePart;
            const commitment = UserCommitmentStatus.FULL_TIME;

            const password = this.generateRandomStringFromEmail(email);
            const PASSWORD_HASH =
                await this.passwordHasherRepository.hash(password);
            const user = await this.userAggregateRepository.save({
                firstName,
                lastName,
                email,
                role,
                commitment,
                password_hash: PASSWORD_HASH,
            });
            return {user};
        } catch (error) {
            this.handleError(error);
        }
    }

    private generateRandomStringFromEmail(email: string): string {
        const base =
            email + Date.now().toString() + Math.random().toString(36).slice(2);
        const hash = Buffer.from(base)
            .toString("base64")
            .replace(/[^a-zA-Z0-9]/g, "");
        return hash.slice(0, 20);
    }

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
