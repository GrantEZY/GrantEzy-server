import {TestingModule, Test} from "@nestjs/testing";
import {ReviewerService} from "./reviewer.service";
import {SharedApplicationService} from "../shared/application/shared.application.service";
import {createMock} from "@golevelup/ts-jest";
import ApiError from "../../../../shared/errors/api.error";
import {saved_Application, dummyUserInvite} from "./reviewer.service.mock.data";
describe("Reviewer", () => {
    let reviewService: ReviewerService;
    let sharedApplicationService: jest.Mocked<SharedApplicationService>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewerService,

                {
                    provide: SharedApplicationService,
                    useValue: createMock<SharedApplicationService>(),
                },
            ],
        }).compile();

        reviewService = moduleReference.get(ReviewerService);

        sharedApplicationService = moduleReference.get(
            SharedApplicationService
        ) as jest.Mocked<SharedApplicationService>;
    });

    it("should be defined", () => {
        expect(reviewService).toBeDefined();
    });

    describe("Get Token Details", () => {
        it("Successful Token details fetch", async () => {
            sharedApplicationService.getTokenDetails.mockResolvedValue({
                application: saved_Application,
                invite: dummyUserInvite,
            } as any);

            const result = await reviewService.getTokenDetails("hash");

            expect(result).toEqual({
                status: 200,
                message: "Reviewer Invite Details Fetch",
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

                await reviewService.getTokenDetails("hash");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Token Not Valid");
            }
        });
    });
});
