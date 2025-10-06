import {TestingModule, Test} from "@nestjs/testing";
import {CoApplicantService} from "./co.applicant.service";
import ApiError from "../../../../shared/errors/api.error";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {dummyUserInvite, saved_Application} from "./co.applicant.mock.data";
import {SharedApplicationService} from "../shared/application/shared.application.service";
describe("CoApplicantService", () => {
    let coApplicationService: CoApplicantService;
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let sharedApplicationService: jest.Mocked<SharedApplicationService>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                CoApplicantService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
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
});
