import {Inject, Injectable} from "@nestjs/common";

import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../../ports/outputs/crypto/hash.port";

import {
    AddUserDTO,
    DeleteUserDTO,
    UpdateRole,
    UpdateUserRoleDTO,
} from "../../../../../infrastructure/driving/dtos/shared/shared.user.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {UserCommitmentStatus} from "../../../constants/commitment.constants";
import {
    AddUserDataResponse,
    UpdateUserDataResponse,
    DeleteUserDataResponse,
    AddUserData,
} from "../../../../../infrastructure/driven/response-dtos/shared.response-dto";

@Injectable()
export class UserSharedService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(PASSWORD_HASHER_PORT)
        private readonly passwordHasherRepository: PasswordHasherPort
    ) {}

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

    async updateUserRole(
        userData: UpdateUserRoleDTO
    ): Promise<UpdateUserDataResponse> {
        try {
            const {type, role, email} = userData;
            const user = await this.userAggregateRepository.findByEmail(email);
            if (!user) {
                throw new ApiError(400, "User Not Found", "User conflict");
            }
            const isThere = user.role.includes(role);
            if (type == UpdateRole.ADD_ROLE) {
                if (isThere) {
                    throw new ApiError(
                        401,
                        "User already has the role privileges",
                        "Conflict Error"
                    );
                }
                user.role.push(role);
                const newRoles = user.role;
                const isUpdated =
                    await this.userAggregateRepository.updateUserRole(
                        user.personId,
                        newRoles
                    );
                if (isUpdated) {
                    return {
                        status: 200,
                        message: "User role Updated",
                        res: {
                            id: user.personId,
                            role,
                        },
                    };
                } else {
                    throw new ApiError(
                        500,
                        "Error in Updating User Role",
                        "Internal Error"
                    );
                }
            } else {
                if (!isThere) {
                    throw new ApiError(
                        401,
                        "User don't  have the role privileges",
                        "Conflict Error"
                    );
                }
                const newRoles = user.role.filter(
                    (userRole) => userRole != role
                );

                if (newRoles.length == 0) {
                    throw new ApiError(
                        400,
                        "User Should have at least one Role",
                        "Conflict Error"
                    );
                }
                const isUpdated =
                    await this.userAggregateRepository.updateUserRole(
                        user.personId,
                        newRoles
                    );

                if (isUpdated) {
                    return {
                        status: 200,
                        message: "User role Updated",
                        res: {
                            id: user.personId,
                            role,
                        },
                    };
                } else {
                    throw new ApiError(
                        500,
                        "Error in Updating User Role",
                        "Internal Error"
                    );
                }
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteUser(
        userDetails: DeleteUserDTO
    ): Promise<DeleteUserDataResponse> {
        try {
            const {email} = userDetails;
            const user = await this.userAggregateRepository.findByEmail(email);
            if (!user) {
                throw new ApiError(400, "User Not Found", "User conflict");
            }
            const isDeleted = await this.userAggregateRepository.deleteUser(
                user.personId
            );
            if (isDeleted) {
                return {
                    status: 200,
                    message: "User Deleted Successfully",
                    res: {
                        status: true,
                    },
                };
            }
            throw new ApiError(
                500,
                "Error in Deleting the User",
                "Deletion Error"
            );
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

        const targetLength = Math.floor(Math.random() * (20 - 8 + 1)) + 8;
        let result = hash.slice(0, targetLength);

        while (result.length < targetLength) {
            result += Math.random().toString(36).slice(2);
        }
        result = result.slice(0, targetLength);

        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const digits = "0123456789";
        const specials = "!@#$%^&*()_-+=<>?";

        if (!/[A-Z]/.test(result))
            result += upper[Math.floor(Math.random() * upper.length)];
        if (!/[a-z]/.test(result))
            result += lower[Math.floor(Math.random() * lower.length)];
        if (!/[0-9]/.test(result))
            result += digits[Math.floor(Math.random() * digits.length)];
        if (!/[!@#$%^&*()_\-+=<>?]/.test(result))
            result += specials[Math.floor(Math.random() * specials.length)];

        const shuffled = result
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        return shuffled.slice(0, Math.min(shuffled.length, 20));
    }

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
