import {TestingModule, Test} from "@nestjs/testing";
import {CoApplicantService} from "./co.applicant.service";
import ApiError from "../../../../shared/errors/api.error";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {
    dummyUserInvite,
    saved_Application,
    SAVED_USER,
} from "./co.applicant.mock.data";
import {SharedApplicationService} from "../shared/application/shared.application.service";
import {InviteStatus} from "../../constants/invite.constants";
describe("CoApplicantService", () => {
    let coApplicationService: CoApplicantService;
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let sharedApplicationService: jest.Mocked<SharedApplicationService>;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                CoApplicantService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: SharedApplicationService,
                    useValue: createMock<SharedApplicationService>(),
                },
            ],
        }).compile();

        coApplicationService = moduleReference.get(CoApplicantService);
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;
        sharedApplicationService = moduleReference.get(
            SharedApplicationService
        ) as jest.Mocked<SharedApplicationService>;
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;
    });

    it("should be defined", () => {
        expect(coApplicationService).toBeDefined();
    });

    describe("Get View Access for Application", () => {
        it("should return application details successfully", async () => {
            applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                saved_Application as any
            );

            const result = await coApplicationService.getApplicationDetails(
                "applicationId",
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Application Details for CoApplicant",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("should throw an error when application is not found", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                    null
                );

                await coApplicationService.getApplicationDetails(
                    "applicationId",
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application Not Found"
                );
            }
        });

        it("User don't have access to the application", async () => {
            try {
                applicationAggregateRepository.getUserCreatedApplication.mockResolvedValue(
                    saved_Application as any
                );

                await coApplicationService.getApplicationDetails(
                    "applicationId",
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only TeamMates Can View the Application"
                );
            }
        });
    });

    describe("Get Token Details", () => {
        it("Successful Token details fetch", async () => {
            sharedApplicationService.getTokenDetails.mockResolvedValue({
                application: saved_Application,
                invite: dummyUserInvite,
            } as any);

            const result = await coApplicationService.getTokenDetails("hash");

            expect(result).toEqual({
                status: 200,
                message: "Co Applicant Invite Details Fetch",
                res: {
                    invitedAt: dummyUserInvite.createdAt,
                    application: {
                        name: saved_Application.basicDetails.title,
                        problem: saved_Application.basicDetails.problem,
                    },
                },
            });
        });

        it("Internal Token Verification Error", async () => {
            try {
                sharedApplicationService.getTokenDetails.mockImplementation(
                    () => {
                        throw new ApiError(
                            404,
                            "Token Not Valid",
                            "Conflict Error"
                        );
                    }
                );

                await coApplicationService.getTokenDetails("hash");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Token Not Valid");
            }
        });
    });

    describe("Update TeamMate Invite Status", () => {
        it("Successful addition of the teammate", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
                email: "tylerdurden@gmail.com",
            } as any);

            userAggregateRepository.findByEmail.mockResolvedValue(
                SAVED_USER as any
            );

            applicationAggregateRepository.addApplicationTeammates.mockResolvedValue(
                saved_Application as any
            );

            const result =
                await coApplicationService.updateTeamMateInviteStatus({
                    token: "token",
                    status: InviteStatus.ACCEPTED,
                });

            expect(result).toEqual({
                status: 200,
                message: "User TeamMate Status Updated",
                res: {
                    applicationId: saved_Application.id,
                    status: InviteStatus.ACCEPTED,
                },
            });
        });

        it("Successful rejection of the teammate", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
                email: "tylerdurden@gmail.com",
            } as any);

            const result =
                await coApplicationService.updateTeamMateInviteStatus({
                    token: "token",
                    status: InviteStatus.REJECTED,
                });

            expect(userAggregateRepository.findByEmail).toHaveBeenCalledTimes(
                0
            );
            expect(
                applicationAggregateRepository.addApplicationTeammates
            ).toHaveBeenCalledTimes(0);
            expect(result).toEqual({
                status: 200,
                message: "User TeamMate Status Updated",
                res: {
                    applicationId: saved_Application.id,
                    status: InviteStatus.REJECTED,
                },
            });
        });

        it("Updation Error", async () => {
            try {
                sharedApplicationService.getInviteResponse.mockResolvedValue({
                    status: false,
                    application: saved_Application,
                    email: "tylerdurden@gmail.com",
                } as any);

                await coApplicationService.updateTeamMateInviteStatus({
                    token: "token",
                    status: InviteStatus.REJECTED,
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Error in Updating the User Invite Status"
                );
            }
        });

        it("User Not Found", async () => {
            try {
                sharedApplicationService.getInviteResponse.mockResolvedValue({
                    status: true,
                    application: saved_Application,
                    email: "tylerdurden@gmail.com",
                } as any);

                userAggregateRepository.findByEmail.mockResolvedValue(null);

                await coApplicationService.updateTeamMateInviteStatus({
                    token: "token",
                    status: InviteStatus.ACCEPTED,
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });
    });
});
