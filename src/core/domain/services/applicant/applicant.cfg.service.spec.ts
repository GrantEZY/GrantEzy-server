import {TestingModule, Test} from "@nestjs/testing";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import ApiError from "../../../../shared/errors/api.error";
import {
    USER_INVITE_AGGREGATE_PORT,
    UserInviteAggregatePort,
} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {CycleInviteQueue} from "../../../../infrastructure/driven/queue/queues/cycle.invite.queue";
import {EmailQueue} from "../../../../infrastructure/driven/queue/queues/email.queue";
import {ConfigService} from "@nestjs/config";
import {ApplicantCfgService} from "./applicant.cfg.service";
import {
    InviteResponse,
    saved_Application,
    SAVED_CYCLE,
    SAVED_USER,
    TEAM_MATE_USER,
} from "./applicant.service.mock.data";
describe("Applicant Config", () => {
    let applicantCfgService: ApplicantCfgService;

    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let cycleAggregateRepository: jest.Mocked<CycleAggregatePort>;
    let userinviteAggregateRepository: jest.Mocked<UserInviteAggregatePort>;
    let emailQueue: jest.Mocked<EmailQueue>;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let cycleInviteQueue: jest.Mocked<CycleInviteQueue>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicantCfgService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: CycleInviteQueue,
                    useValue: createMock<CycleInviteQueue>(),
                },
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },

                {
                    provide: USER_INVITE_AGGREGATE_PORT,
                    useValue: createMock<UserInviteAggregatePort>(),
                },
                {
                    provide: EmailQueue,
                    useValue: createMock<EmailQueue>(),
                },

                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(() => ({
                            CLIENT_URL: "http://localhost:3000",
                        })),
                    },
                },
            ],
        }).compile();

        applicantCfgService = moduleReference.get(ApplicantCfgService);
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;
        cycleAggregateRepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;
        userinviteAggregateRepository = moduleReference.get(
            USER_INVITE_AGGREGATE_PORT
        ) as jest.Mocked<UserInviteAggregatePort>;
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;

        cycleInviteQueue = moduleReference.get(
            CycleInviteQueue
        ) as jest.Mocked<CycleInviteQueue>;
        emailQueue = moduleReference.get(EmailQueue) as jest.Mocked<EmailQueue>;
    });

    it("to be Defined", () => {
        expect(applicantCfgService).toBeDefined();
    });

    describe("Add TeamMate To Application", () => {
        it("Successful Addition To Application", async () => {
            userAggregateRepository.findById.mockResolvedValue(
                SAVED_USER as any
            );

            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            cycleAggregateRepository.findById.mockResolvedValue(
                SAVED_CYCLE as any
            );

            userinviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                InviteResponse as any
            );

            cycleInviteQueue.UserCycleInvite.mockResolvedValue({
                status: true,
            } as any);

            const result = await applicantCfgService.addTeamMatesToApplication(
                {applicationId: "id", email: "teamMate@gmail.com"},
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Application TeamMate Invited",
                res: {
                    status: true,
                },
            });
        });

        it("User Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(null);
                await applicantCfgService.addTeamMatesToApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("Applicant Can't Add himself", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );
                await applicantCfgService.addTeamMatesToApplication(
                    {applicationId: "id", email: "john.doe@example.com"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Applicant cant be invited as CoApplicant"
                );
            }
        });

        it("Application Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(null);

                await applicantCfgService.addTeamMatesToApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
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

        it("User Not Allowed", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicantCfgService.addTeamMatesToApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });

        it("Addition To Queue Failure", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                cycleAggregateRepository.findById.mockResolvedValue(
                    SAVED_CYCLE as any
                );

                userinviteAggregateRepository.addApplicationInvites.mockResolvedValue(
                    InviteResponse as any
                );

                cycleInviteQueue.UserCycleInvite.mockResolvedValue({
                    status: false,
                } as any);

                await applicantCfgService.addTeamMatesToApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(500);
                expect((error as ApiError).message).toBe(
                    "Error in sending Invite to the user"
                );
            }
        });
    });

    describe("Remove TeamMate From Application", () => {
        it("Successful Removal Of TeamMate From Application", async () => {
            userAggregateRepository.findById.mockResolvedValue(
                SAVED_USER as any
            );

            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            userAggregateRepository.findByEmail.mockResolvedValue(
                TEAM_MATE_USER as any
            );

            applicationAggregateRepository.checkTeamMateApplication.mockResolvedValue(
                saved_Application as any
            );

            applicationAggregateRepository.removeTeamMateFromApplication.mockResolvedValue(
                true
            );

            emailQueue.removeTeamMateFromApplication.mockResolvedValue({
                status: true,
            } as any);

            const result =
                await applicantCfgService.removeTeamMateFromApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
                    "uuid"
                );

            expect(result).toEqual({
                status: 200,
                message: "Application TeamMate Removed",
                res: {
                    status: true,
                },
            });
        });

        it("Applicant Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(null);

                await applicantCfgService.removeTeamMateFromApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("Applicant Cannot be removed", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                await applicantCfgService.removeTeamMateFromApplication(
                    {applicationId: "id", email: "john.doe@example.com"},
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Applicant cant be removed from application"
                );
            }
        });

        it("Application Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(null);

                await applicantCfgService.removeTeamMateFromApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
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

        it("User Not Allowed", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                await applicantCfgService.removeTeamMateFromApplication(
                    {applicationId: "id", email: "teamMate@gmail.com"},
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only the applicant can add further details"
                );
            }
        });

        it("TeamMate Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                userAggregateRepository.findByEmail.mockResolvedValue(null);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("TeamMate Not Found");
            }
        });

        it("TeamMate Not Found", async () => {
            try {
                userAggregateRepository.findById.mockResolvedValue(
                    SAVED_USER as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(
                    saved_Application as any
                );

                userAggregateRepository.findByEmail.mockResolvedValue(
                    TEAM_MATE_USER as any
                );

                applicationAggregateRepository.checkTeamMateApplication.mockResolvedValue(
                    saved_Application as any
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "The Person is not a TeamMate"
                );
            }
        });
    });
});
