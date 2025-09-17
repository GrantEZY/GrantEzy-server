import {Injectable, Inject} from "@nestjs/common";
import {
    AddProgramManagerDTO,
    CreateProgramDTO,
    DeleteProgramDTO,
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
    AddProgramManagerResponse,
    CreateProgramResponse,
    DeletProgramResponse,
    GetAllProgramsResponse,
    GetGCVUsersDataResponse,
    UpdateProgramResponse,
    UpdateUserDataResponse,
} from "../../../../infrastructure/driven/response-dtos/gcv.response-dto";
import {SharedOrganizationService} from "../shared/organization/shared.organization.service";
import {Organization} from "../../entities/organization.entity";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {
    GetAllProgramDTO,
    UpdateProgramDTO,
} from "../../../../infrastructure/driving/dtos/shared/shared.program.dto";
import {SharedProgramService} from "../shared/program/shared.program.service";

@Injectable()
/**
 * This is the GCV only service
 */
export class GCVService {
    constructor(
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort,
        @Inject(PROGRAM_AGGREGATE_PORT)
        private readonly programAggregateRepository: ProgramAggregatePort,
        private readonly userSharedService: UserSharedService,
        private readonly sharedOrganizationService: SharedOrganizationService,
        private readonly sharedProgramService: SharedProgramService
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
                    filterData.filter.otherFilters,
                    page,
                    numberOfResults
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

    async createProgram(
        program: CreateProgramDTO
    ): Promise<CreateProgramResponse> {
        try {
            const {organization} = program;
            const {isNew} = organization;
            let linkedOrganization: Organization;
            if (isNew && organization.name && organization.type) {
                linkedOrganization =
                    await this.sharedOrganizationService.createOrganization({
                        name: organization.name,
                        type: organization.type,
                    });
            } else {
                linkedOrganization =
                    await this.sharedOrganizationService.getOrganizationByName(
                        organization.name
                    );

                const ExistingProgram =
                    await this.programAggregateRepository.findByName(
                        program.details.name,
                        organization.name
                    );

                if (ExistingProgram) {
                    throw new ApiError(
                        409,
                        "The Organization already has a program with this name",
                        "Conflict Error"
                    );
                }
            }

            const programDetails = {
                details: program.details,
                duration: program.duration,
                budget: program.budget,
                minTRL: program.minTRL,
                maxTRL: program.maxTRL,
            };

            const createdProgram = await this.programAggregateRepository.save(
                programDetails,
                linkedOrganization.id
            );
            return {
                status: 201,
                message: "Program Created Successfully",
                res: {
                    organizationId: linkedOrganization.id,
                    name: programDetails.details.name,
                    id: createdProgram.id,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getPrograms(
        getProgramFilter: GetAllProgramDTO
    ): Promise<GetAllProgramsResponse> {
        try {
            const {programs, totalNumberOfPrograms} =
                await this.sharedProgramService.getPrograms(getProgramFilter);
            return {
                status: 200,
                message: "Programs filtered as per filter",
                res: {
                    programs,
                    numberOfPrograms: totalNumberOfPrograms,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateProgram(
        updatedDetails: UpdateProgramDTO
    ): Promise<UpdateProgramResponse> {
        try {
            const program =
                await this.sharedProgramService.UpdateProgramDetails(
                    updatedDetails
                );

            return {
                status: 200,
                message: "Program Updated Successfully",
                res: {
                    id: program.id,
                    status: program.status,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteProgram(
        deleteProgramDetails: DeleteProgramDTO
    ): Promise<DeletProgramResponse> {
        try {
            const {id} = deleteProgramDetails;

            const program = await this.programAggregateRepository.findById(id);
            if (!program) {
                throw new ApiError(404, " Program Not Found ", "Program Error");
            }
            const isDeleted =
                await this.programAggregateRepository.deleteProgram(id);
            if (isDeleted) {
                return {
                    status: 200,
                    message: "Program Deleted Successfully",
                    res: {
                        success: true,
                    },
                };
            }
            throw new ApiError(
                400,
                "Error in deleting Program",
                "Program Error"
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    async addProgramManager(
        programMangerDetails: AddProgramManagerDTO
    ): Promise<AddProgramManagerResponse> {
        try {
            const {id: programId, email} = programMangerDetails;
            const manager = await this.userAggregateRepository.findByEmail(
                email,
                false
            );

            if (!manager) {
                throw new ApiError(404, "User not found", "User Conflict");
            }
            const program =
                await this.programAggregateRepository.findById(programId);

            if (!program) {
                throw new ApiError(404, "Program Not Found", "Conflict Error");
            }

            const isLinked =
                await this.programAggregateRepository.getProgramByManagerId(
                    manager.personId
                );
            if (isLinked) {
                throw new ApiError(
                    409,
                    "Manager already has a program",
                    "Conflict Error"
                );
            }
            const previousManagerId = program?.managerId;

            if (previousManagerId) {
                const previousManager =
                    await this.userAggregateRepository.findById(
                        previousManagerId,
                        false
                    );

                const previousManagerUpdatedRoles =
                    previousManager?.role.filter(
                        (role) => role != UserRoles.PROGRAM_MANAGER
                    );

                await this.userAggregateRepository.updateUserRole(
                    previousManagerId,
                    previousManagerUpdatedRoles ?? [UserRoles.NORMAL_USER]
                );
            }

            if (!manager.role.includes(UserRoles.PROGRAM_MANAGER)) {
                manager.role.push(UserRoles.PROGRAM_MANAGER);
                await this.userAggregateRepository.updateUserRole(
                    manager.personId,
                    manager.role
                );
            }
            const isAdded =
                await this.programAggregateRepository.addProgramManager(
                    manager.personId,
                    program
                );
            if (isAdded) {
                return {
                    status: 200,
                    message: "Program Manager Added Successfully",
                    res: {
                        managerId: manager.personId,
                        programId,
                    },
                };
            } else {
                throw new ApiError(
                    400,
                    "Error in Adding Manager",
                    "Internal Error"
                );
            }
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
