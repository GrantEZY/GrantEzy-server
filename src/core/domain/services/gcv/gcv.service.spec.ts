import {TestingModule, Test} from "@nestjs/testing";
import {GCVService} from "./gcv.service";
import {
    USER_AGGREGATE_PORT,
    UserAggregatePort,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {UserSharedService} from "../shared/user/shared.user.service";
import {createMock} from "@golevelup/ts-jest";
import {
    SAVED_USER,
    SAVED_ORGANIZATION,
    NEW_PROGRAM_DATA,
    SAVED_PROGRAM,
    PROGRAMS_ARRAY,
} from "./gcv.service.mock.data";
import ApiError from "../../../../shared/errors/api.error";
import {SharedOrganizationService} from "../shared/organization/shared.organization.service";
import {
    ProgramAggregatePort,
    PROGRAM_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {SharedProgramService} from "../shared/program/shared.program.service";
import {UserRoles} from "../../constants/userRoles.constants";

describe("GCV Service", () => {
    let gcvService: GCVService;
    let sharedOrganisationService: SharedOrganizationService;
    let userSharedService: jest.Mocked<UserSharedService>;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let programAggregateRepository: jest.Mocked<ProgramAggregatePort>;
    let sharedProgramService: jest.Mocked<SharedProgramService>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                GCVService,
                {
                    provide: SharedOrganizationService,
                    useValue: createMock<SharedOrganizationService>(),
                },
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: PROGRAM_AGGREGATE_PORT,
                    useValue: createMock<ProgramAggregatePort>(),
                },
                {
                    provide: UserSharedService,
                    useValue: createMock<UserSharedService>(),
                },
                {
                    provide: SharedProgramService,
                    useValue: createMock<SharedProgramService>(),
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
        sharedOrganisationService = moduleReference.get(
            SharedOrganizationService
        );
        programAggregateRepository = moduleReference.get(
            PROGRAM_AGGREGATE_PORT
        ) as jest.Mocked<ProgramAggregatePort>;
        sharedProgramService = moduleReference.get(
            SharedProgramService
        ) as jest.Mocked<SharedProgramService>;
    });

    it("To be Defined", () => {
        expect(GCVService).toBeDefined();
    });

    describe("ADD GCV Users", () => {
        it('Add GCV Member: Should add role "COMMITTEE_MEMBER" to existing user', async () => {
            const userData = {email: "john.doe@example.com"};

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
            const userData = {email: "john.doe@example.com"};

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
    });

    describe("GET ALL GCV Users", () => {
        it("Get All GCV Members: Should return list of GCV members when no filter provided", async () => {
            const filterData = {page: 1, numberOfResults: 10};
            const mockUsers = [SAVED_USER];

            userAggregateRepository.getUsers.mockResolvedValue({
                users: mockUsers as any,
                totalNumberOfUsers: 1,
            });

            const result = await gcvService.getAllGCVmembers(filterData as any);

            expect(userAggregateRepository.getUsers).toHaveBeenCalledWith(
                {isGCVmember: true},
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
                filter: {otherFilters: {role: "ADMIN"}},
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
                {isGCVmember: true, role: "ADMIN"},
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
    });

    describe("Update GCV User Role", () => {
        it("Update User Role: Should update role of existing user", async () => {
            const userDetails = {
                email: "john.doe@example.com",
                type: "ADD_ROLE",
            };

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

            const result = await gcvService.updateGCVUserRole(
                userDetails as any
            );

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

    describe("Create Program", () => {
        it("Create Program For already existing Organisation", async () => {
            const newProgram = NEW_PROGRAM_DATA;
            (
                sharedOrganisationService.getOrganizationByName as jest.Mock
            ).mockResolvedValue(SAVED_ORGANIZATION);
            programAggregateRepository.save.mockResolvedValue(
                SAVED_PROGRAM as any
            );

            programAggregateRepository.findByName.mockResolvedValue(null);

            const result = await gcvService.createProgram(newProgram as any);

            expect(result).toEqual({
                status: 201,
                message: "Program Created Successfully",
                res: {
                    organizationId: SAVED_PROGRAM.organizationId,
                    id: SAVED_PROGRAM.id,
                    name: SAVED_PROGRAM.details.name,
                },
            });
        });

        it("Create Program For already existing Organisation which contains program with same name", async () => {
            try {
                const newProgram = NEW_PROGRAM_DATA;
                (
                    sharedOrganisationService.getOrganizationByName as jest.Mock
                ).mockResolvedValue(SAVED_ORGANIZATION);

                programAggregateRepository.findByName.mockResolvedValue(
                    newProgram as any
                );

                await gcvService.createProgram(newProgram as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "The Organization already has a program with this name"
                );
            }
        });

        it("Create Program for non-existing organization", async () => {
            const newProgram = NEW_PROGRAM_DATA;
            newProgram.organization.isNew = true;
            (
                sharedOrganisationService.createOrganization as jest.Mock
            ).mockResolvedValue(SAVED_ORGANIZATION);
            programAggregateRepository.save.mockResolvedValue(
                SAVED_PROGRAM as any
            );

            const result = await gcvService.createProgram(newProgram as any);

            expect(
                sharedOrganisationService.createOrganization
            ).toHaveBeenCalled();
            expect(
                sharedOrganisationService.createOrganization
            ).toHaveBeenLastCalledWith({
                type: newProgram.organization.type,
                name: newProgram.organization.name,
            });
            expect(result).toEqual({
                status: 201,
                message: "Program Created Successfully",
                res: {
                    organizationId: SAVED_PROGRAM.organizationId,
                    id: SAVED_PROGRAM.id,
                    name: SAVED_PROGRAM.details.name,
                },
            });
        });

        it("Create Program for non-existing organization but it already exists", async () => {
            try {
                const newProgram = NEW_PROGRAM_DATA;
                (
                    sharedOrganisationService.createOrganization as jest.Mock
                ).mockImplementation(() => {
                    throw new ApiError(
                        400,
                        "Organization with this name already exists",
                        "Bad Request"
                    );
                });

                await gcvService.createProgram(newProgram as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Organization with this name already exists"
                );
            }
        });
    });

    describe("Get Programs", () => {
        it("get programs with given filter", async () => {
            (sharedProgramService.getPrograms as jest.Mock).mockResolvedValue({
                programs: PROGRAMS_ARRAY,
                totalNumberOfPrograms: 3,
            });

            const result = await gcvService.getPrograms({
                page: 1,
                numberOfResults: 10,
            });
            expect(result).toEqual({
                status: 200,
                message: "Programs filtered as per filter",
                res: {
                    programs: PROGRAMS_ARRAY,
                    numberOfPrograms: 3,
                },
            });
        });
    });

    describe("Delete Programs", () => {
        it("delete programs with given id", async () => {
            const id = SAVED_PROGRAM.id;
            (
                programAggregateRepository.findById as jest.Mock
            ).mockResolvedValue(SAVED_PROGRAM);
            (
                programAggregateRepository.deleteProgram as jest.Mock
            ).mockResolvedValue(true);
            const result = await gcvService.deleteProgram({id});

            expect(result).toEqual({
                status: 200,
                message: "Program Deleted Successfully",
                res: {
                    success: true,
                },
            });
        });

        it("delete non-existent programs ", async () => {
            try {
                const id = SAVED_PROGRAM.id;
                (
                    programAggregateRepository.findById as jest.Mock
                ).mockResolvedValue(null);

                await gcvService.deleteProgram({id});
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(" Program Not Found ");
            }
        });

        it("delete programs db Error  ", async () => {
            try {
                const id = SAVED_PROGRAM.id;
                (
                    programAggregateRepository.findById as jest.Mock
                ).mockResolvedValue(SAVED_PROGRAM);
                (
                    programAggregateRepository.deleteProgram as jest.Mock
                ).mockResolvedValue(false);
                await gcvService.deleteProgram({id});
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Error in deleting Program"
                );
            }
        });
    });

    describe("Update Program initiation", () => {
        it("Update Program Successful", async () => {
            const programDetails = NEW_PROGRAM_DATA;
            programDetails.details.name = "New NAME";
            (
                sharedProgramService.UpdateProgramDetails as jest.Mock
            ).mockResolvedValue(SAVED_PROGRAM);
            const result = await gcvService.updateProgram({
                id: "program-uuid",
                ...programDetails,
            } as any);
            expect(result).toEqual({
                status: 200,
                message: "Program Updated Successfully",
                res: {
                    id: SAVED_PROGRAM.id,
                    status: SAVED_PROGRAM.status,
                },
            });
        });

        it("Update Program UnExpected Error", async () => {
            try {
                (
                    sharedProgramService.UpdateProgramDetails as jest.Mock
                ).mockImplementation(() => {
                    throw new ApiError(
                        404,
                        " Program Not Found ",
                        "Program Error"
                    );
                });
                await gcvService.updateProgram({id: "program-uuid"} as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(" Program Not Found ");
            }
        });
    });

    describe("Add Program Manager", () => {
        it("Manager Not Found", async () => {
            try {
                const programManagerDetails = {
                    id: "program-uuid",
                    email: "john.doe@example.com",
                };
                userAggregateRepository.findByEmail.mockResolvedValue(null);
                await gcvService.addProgramManager(programManagerDetails);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User not found");
            }
        });

        it("Program Not Found", async () => {
            try {
                const programManagerDetails = {
                    id: "program-uuid",
                    email: "john.doe@example.com",
                };
                userAggregateRepository.findByEmail.mockResolvedValue(
                    SAVED_USER as any
                );
                programAggregateRepository.findById.mockResolvedValue(null);
                await gcvService.addProgramManager(programManagerDetails);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Program Not Found");
            }
        });

        it("Person already linked with another program", async () => {
            try {
                const programManagerDetails = {
                    id: "program-uuid",
                    email: "john.doe@example.com",
                };
                userAggregateRepository.findByEmail.mockResolvedValue(
                    SAVED_USER as any
                );
                programAggregateRepository.findById.mockResolvedValue(
                    SAVED_PROGRAM as any
                );
                programAggregateRepository.getProgramByManagerId.mockResolvedValue(
                    SAVED_PROGRAM as any
                );
                await gcvService.addProgramManager(programManagerDetails);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "Manager already has a program"
                );
            }
        });

        it("Add Program Manager when manager is not yet assigned", async () => {
            const programManagerDetails = {
                id: "program-uuid",
                email: "john.doe@example.com",
            };
            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );
            programAggregateRepository.findById.mockResolvedValue(
                SAVED_PROGRAM as any
            );
            programAggregateRepository.getProgramByManagerId.mockResolvedValue(
                null
            );

            (SAVED_PROGRAM as any).managerId = null;

            const result = await gcvService.addProgramManager(
                programManagerDetails
            );
            SAVED_USER.role.push(UserRoles.PROGRAM_MANAGER);
            expect(userAggregateRepository.updateUserRole).toHaveBeenCalledWith(
                SAVED_USER.personId,
                SAVED_USER.role
            );
            expect(
                programAggregateRepository.addProgramManager
            ).toHaveBeenCalledWith(SAVED_USER.personId, SAVED_PROGRAM);
            expect(result).toEqual({
                status: 200,
                message: "Program Manager Added Successfully",
                res: {
                    managerId: SAVED_USER.personId,
                    programId: "program-uuid",
                },
            });
        });

        it("Replace existing program manager with new one (updation)", async () => {
            const programManagerDetails = {
                id: "program-uuid",
                email: "john.doe@example.com",
            };
            SAVED_USER.role.pop();
            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );
            programAggregateRepository.findById.mockResolvedValue(
                SAVED_PROGRAM as any
            );
            programAggregateRepository.getProgramByManagerId.mockResolvedValue(
                null
            );

            (SAVED_PROGRAM as any).managerId = "user-id";

            const newUser = {
                id: "user-id",
                role: [UserRoles.PROGRAM_MANAGER],
            } as any;
            userAggregateRepository.findById.mockResolvedValue(newUser);
            userAggregateRepository.updateUserRole.mockResolvedValue(true);
            SAVED_USER.role.pop();

            const result = await gcvService.addProgramManager(
                programManagerDetails
            );
            SAVED_USER.role.push(UserRoles.PROGRAM_MANAGER);
            expect(userAggregateRepository.updateUserRole).toHaveBeenCalledWith(
                SAVED_USER.personId,
                SAVED_USER.role
            );
            expect(
                programAggregateRepository.addProgramManager
            ).toHaveBeenCalledWith(SAVED_USER.personId, SAVED_PROGRAM);
            expect(result).toEqual({
                status: 200,
                message: "Program Manager Added Successfully",
                res: {
                    managerId: SAVED_USER.personId,
                    programId: "program-uuid",
                },
            });
        });
    });
});
