import {TestingModule, Test} from "@nestjs/testing";
import {ReviewerService} from "./reviewer.service";
import {SharedApplicationService} from "../shared/application/shared.application.service";
import {createMock} from "@golevelup/ts-jest";
import ApiError from "../../../../shared/errors/api.error";
import {
    saved_Application,
    dummyUserInvite,
    createReviewMock,
    SAVED_USER,
    mockProjectReview,
    mockCycleAssessment,
} from "./reviewer.service.mock.data";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    ReviewerAggregatePort,
    REVIEW_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/review/application.review.aggregate.port";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../ports/outputs/crypto/hash.port";
import {
    ProjectReviewAggregatePort,
    PROJECT_REVIEW_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/projectReview/project.review.aggregate.port";
import {
    CycleAssessmentAggregatePort,
    CYCLE_ASSESSMENT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycleAssessment/cycle.assessment.aggregate.port";
import {
    ProjectAggregatePort,
    PROJECT_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/project/project.aggregate.port";
import {InviteAs} from "../../constants/invite.constants";
describe("Reviewer", () => {
    let reviewService: ReviewerService;
    let sharedApplicationService: jest.Mocked<SharedApplicationService>;
    let grantApplicationRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let reviewAggregateRepository: jest.Mocked<ReviewerAggregatePort>;
    let userAggregateRepository: jest.Mocked<UserAggregatePort>;
    let passwordHasherRepository: jest.Mocked<PasswordHasherPort>;
    let projectReviewAggregateRepository: jest.Mocked<ProjectReviewAggregatePort>;
    let cycleAssessmentAggregateRepository: jest.Mocked<CycleAssessmentAggregatePort>;
    let projectAggregateRepository: jest.Mocked<ProjectAggregatePort>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewerService,

                {
                    provide: SharedApplicationService,
                    useValue: createMock<SharedApplicationService>(),
                },
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: REVIEW_AGGREGATE_PORT,
                    useValue: createMock<ReviewerAggregatePort>(),
                },
                {
                    provide: USER_AGGREGATE_PORT,
                    useValue: createMock<UserAggregatePort>(),
                },
                {
                    provide: PASSWORD_HASHER_PORT,
                    useValue: createMock<PasswordHasherPort>(),
                },
                {
                    provide: PROJECT_REVIEW_AGGREGATE_PORT,
                    useValue: createMock<ProjectReviewAggregatePort>(),
                },
                {
                    provide: CYCLE_ASSESSMENT_AGGREGATE_PORT,
                    useValue: createMock<CycleAssessmentAggregatePort>(),
                },
                {
                    provide: PROJECT_AGGREGATE_PORT,
                    useValue: createMock<ProjectAggregatePort>(),
                },
            ],
        }).compile();

        reviewService = moduleReference.get(ReviewerService);

        sharedApplicationService = moduleReference.get(
            SharedApplicationService
        ) as jest.Mocked<SharedApplicationService>;

        grantApplicationRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;

        reviewAggregateRepository = moduleReference.get(
            REVIEW_AGGREGATE_PORT
        ) as jest.Mocked<ReviewerAggregatePort>;
        userAggregateRepository = moduleReference.get(
            USER_AGGREGATE_PORT
        ) as jest.Mocked<UserAggregatePort>;
        passwordHasherRepository = moduleReference.get(
            PASSWORD_HASHER_PORT
        ) as jest.Mocked<PasswordHasherPort>;
        projectReviewAggregateRepository = moduleReference.get(
            PROJECT_REVIEW_AGGREGATE_PORT
        ) as jest.Mocked<ProjectReviewAggregatePort>;
        cycleAssessmentAggregateRepository = moduleReference.get(
            CYCLE_ASSESSMENT_AGGREGATE_PORT
        ) as jest.Mocked<CycleAssessmentAggregatePort>;
        projectAggregateRepository = moduleReference.get(
            PROJECT_AGGREGATE_PORT
        ) as jest.Mocked<ProjectAggregatePort>;
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

            const result = await reviewService.getTokenDetails("hash", "slug");

            expect(result).toEqual({
                status: 200,
                message: "Reviewer Invite Details Fetch",
                res: {
                    invitedAt: dummyUserInvite.createdAt,
                    inviteAs: InviteAs.REVIEWER,
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

                await reviewService.getTokenDetails("hash", "slug");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Token Not Valid");
            }
        });
    });

    describe("Update User Invite Status", () => {
        it("Successful User Invite Status Update - Accept", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
            } as any);

            reviewAggregateRepository.getUserApplicationReview.mockResolvedValue(
                null
            );

            userAggregateRepository.findByEmail.mockResolvedValueOnce(
                SAVED_USER as any
            );

            grantApplicationRepository.modifyApplicationStatus.mockResolvedValue(
                {status: "IN_REVIEW"} as any
            );

            reviewAggregateRepository.addReviewerToApplication.mockResolvedValue(
                createReviewMock as any
            );

            const result = await reviewService.updateApplicationReviewerStatus({
                status: "ACCEPTED",
                token: "hash",
            } as any);

            expect(result).toEqual({
                status: 201,
                message: "User Reviewer Status Updated",
                res: {
                    applicationId: saved_Application.id,
                    status: "ACCEPTED",
                    reviewId: createReviewMock.id,
                },
            });
        });

        it("Successful User Invite Status Update - Reject", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
            } as any);

            const result = await reviewService.updateApplicationReviewerStatus({
                status: "REJECTED",
                token: "hash",
            } as any);

            expect(result).toEqual({
                status: 200,
                message: "User Reviewer Status Updated",
                res: {
                    applicationId: saved_Application.id,
                    status: "REJECTED",
                    reviewId: null,
                },
            });
        });

        it("Internal User Invite Status Update Error", async () => {
            try {
                sharedApplicationService.getInviteResponse.mockImplementation(
                    () => {
                        throw new ApiError(
                            404,
                            "Token Not Valid",
                            "Conflict Error"
                        );
                    }
                );

                await reviewService.updateApplicationReviewerStatus({
                    status: "ACCEPTED",
                    token: "hash",
                } as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Token Not Valid");
            }
        });

        it("User Not Found with the given Email Address", async () => {
            try {
                sharedApplicationService.getInviteResponse.mockResolvedValue({
                    status: true,
                    application: saved_Application,
                    email: "john.doe@example.com",
                } as any);

                userAggregateRepository.findByEmail.mockResolvedValueOnce(null);

                await reviewService.updateApplicationReviewerStatus({
                    status: "ACCEPTED",
                    token: "hash",
                } as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("User is already a Reviewer for this Application", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
            } as any);

            userAggregateRepository.findByEmail.mockResolvedValueOnce(
                SAVED_USER as any
            );

            reviewAggregateRepository.getUserApplicationReview.mockResolvedValue(
                createReviewMock as any
            );

            const result = await reviewService.updateApplicationReviewerStatus({
                status: "ACCEPTED",
                token: "hash",
            } as any);

            expect(result).toEqual({
                status: 200,
                message: "User is already a Reviewer for this Application",
                res: {
                    applicationId: saved_Application.id,
                    status: "ACCEPTED",
                    reviewId: createReviewMock.id,
                },
            });
        });
    });

    describe("Submit Application Review", () => {
        it("Successful Application Review Submission", async () => {
            reviewAggregateRepository.getUserApplicationReview.mockResolvedValue(
                createReviewMock as any
            );

            reviewAggregateRepository.modifyReview.mockResolvedValue({
                ...createReviewMock,
                recommendation: "APPROVE",
                scores: {
                    technical: 10,
                },
                budget: 50000,
            } as any);

            reviewAggregateRepository.changeReviewStatus.mockResolvedValue({
                ...createReviewMock,
                recommendation: "APPROVE",
                status: "COMPLETED",
                scores: {
                    technical: 10,
                },
                budget: 50000,
            } as any);

            const result = await reviewService.submitReview(
                {
                    applicationId: "app-id",
                    scores: {technical: 10},
                    budget: 50000,
                    recommendation: "APPROVE",
                } as any,
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Review Submitted Successfully",
                res: {
                    reviewId: createReviewMock.id,
                    applicationId: createReviewMock.applicationId,
                    status: "COMPLETED",
                },
            });
        });

        it("Review Not Found for the User and Application", async () => {
            try {
                reviewAggregateRepository.getUserApplicationReview.mockResolvedValue(
                    null
                );

                await reviewService.submitReview(
                    {
                        applicationId: "app-id",
                        scores: {technical: 10},
                        budget: 50000,
                        recommendation: "APPROVE",
                    } as any,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Review Not Found");
            }
        });

        it("Review Already Completed", async () => {
            try {
                reviewAggregateRepository.getUserApplicationReview.mockResolvedValue(
                    {
                        ...createReviewMock,
                        status: "COMPLETED",
                    } as any
                );

                await reviewService.submitReview(
                    {
                        applicationId: "app-id",
                        scores: {technical: 10},
                        budget: 50000,
                        recommendation: "APPROVE",
                    } as any,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Review Already Completed"
                );
            }
        });
    });

    describe("Get User Reviews", () => {
        it("Successful fetch Of User Reviews", async () => {
            const userReviews = [
                createReviewMock,
                createReviewMock,
                createReviewMock,
            ];
            reviewAggregateRepository.getUserReviews.mockResolvedValue(
                userReviews as any
            );

            const result = await reviewService.getUserReviews(
                {page: 1, numberOfResults: 10},
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "User Reviews Fetch",
                res: {
                    reviews: userReviews,
                },
            });
        });
    });

    describe("Review Details", () => {
        it("Successful Fetch Of Review Detail", async () => {
            const review = JSON.parse(JSON.stringify(createReviewMock));

            review.application = saved_Application;
            reviewAggregateRepository.findBySlug.mockResolvedValue(
                review as any
            );

            const result = await reviewService.getReviewDetails(
                {reviewSlug: "slug"},
                "reviewer-uuid"
            );

            expect(result).toEqual(
                expect.objectContaining({
                    status: 200,
                    message: "Review Details Fetched Successfully",
                    res: expect.objectContaining({
                        review: expect.objectContaining({
                            id: createReviewMock.id,
                            reviewerId: createReviewMock.reviewerId,
                            applicationId: createReviewMock.applicationId,
                        }),
                        application: saved_Application,
                    }),
                })
            );
        });

        it("Review Not Found", async () => {
            try {
                reviewAggregateRepository.findBySlug.mockResolvedValue(null);
                await reviewService.getReviewDetails(
                    {reviewSlug: "slug"},
                    "reviewer-uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Review Not Found");
            }
        });

        it("User is not a Reviewer", async () => {
            try {
                reviewAggregateRepository.findBySlug.mockResolvedValue(
                    createReviewMock as any
                );
                await reviewService.getReviewDetails(
                    {reviewSlug: "slug"},
                    "reviewer!uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "User is not a reviewer"
                );
            }
        });
    });

    describe("Update Project Reviewer Status", () => {
        it("Successful User Reviewer Status Update - Accept", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
            } as any);

            userAggregateRepository.findByEmail.mockResolvedValueOnce(
                SAVED_USER as any
            );

            passwordHasherRepository.decrypt.mockReturnValue("raw_value");

            projectReviewAggregateRepository.findAssessmentReviewerByUserIdAndAssessmentId.mockResolvedValue(
                null
            );

            projectAggregateRepository.getProjectDetailsWithApplicationId.mockResolvedValue(
                {
                    id: "project-uuid",
                    title: "Project Title",
                } as any
            );

            projectAggregateRepository.modifyProjectStatus.mockResolvedValue({
                status: "IN_REVIEW",
            } as any);

            projectReviewAggregateRepository.addReviewerToProject.mockResolvedValue(
                mockProjectReview as any
            );

            const result =
                await reviewService.updateProjectAssessmentReviewerStatus({
                    status: "ACCEPTED",
                    token: "hash",
                    slug: "slug",
                    assessmentId: "encrypted-assessment-id",
                } as any);

            expect(result).toEqual({
                status: 201,
                message: "User Reviewer Status Updated",
                res: {
                    applicationId: saved_Application.id,
                    status: "ACCEPTED",
                    reviewId: mockProjectReview.id,
                },
            });
        });

        it("Updation Error for Invite", async () => {
            try {
                sharedApplicationService.getInviteResponse.mockResolvedValue({
                    status: false,
                    application: saved_Application,
                } as any);

                await reviewService.updateProjectAssessmentReviewerStatus({
                    status: "ACCEPTED",
                    token: "hash",
                    slug: "slug",
                    assessmentId: "encrypted-assessment-id",
                } as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Error in Updating the User Invite Status"
                );
            }
        });

        it("User Not Found with the given Email Address", async () => {
            try {
                sharedApplicationService.getInviteResponse.mockResolvedValue({
                    status: true,
                    application: saved_Application,
                    email: "<EMAIL>",
                } as any);

                userAggregateRepository.findByEmail.mockResolvedValueOnce(null);

                await reviewService.updateProjectAssessmentReviewerStatus({
                    status: "ACCEPTED",
                    token: "hash",
                    slug: "slug",
                    assessmentId: "encrypted-assessment-id",
                } as any);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("User Not Found");
            }
        });

        it("Already a Reviewer for this Assessment", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
            } as any);

            userAggregateRepository.findByEmail.mockResolvedValueOnce(
                SAVED_USER as any
            );

            passwordHasherRepository.decrypt.mockReturnValue("raw_value");

            projectReviewAggregateRepository.findAssessmentReviewerByUserIdAndAssessmentId.mockResolvedValue(
                mockProjectReview as any
            );

            const result =
                await reviewService.updateProjectAssessmentReviewerStatus({
                    status: "ACCEPTED",
                    token: "hash",
                    slug: "slug",
                    assessmentId: "encrypted-assessment-id",
                } as any);

            expect(result).toEqual({
                status: 200,
                message:
                    "User is already a Reviewer for this Project Assessment",
                res: {
                    applicationId: saved_Application.id,
                    status: "ACCEPTED",
                    reviewId: mockProjectReview.id,
                },
            });
        });

        it("User Reviewer Status Update - Reject", async () => {
            sharedApplicationService.getInviteResponse.mockResolvedValue({
                status: true,
                application: saved_Application,
            } as any);

            const result =
                await reviewService.updateProjectAssessmentReviewerStatus({
                    status: "REJECTED",
                    token: "hash",
                    slug: "slug",
                    assessmentId: "encrypted-assessment-id",
                } as any);

            expect(result).toEqual({
                status: 200,
                message: "User Reviewer Status Updated",
                res: {
                    applicationId: saved_Application.id,
                    status: "REJECTED",
                    reviewId: null,
                },
            });
        });
    });

    describe("Submit Project Assessment Review ", () => {
        it("Successful Project Assessment Review Submission", async () => {
            projectReviewAggregateRepository.findAssessmentReviewerByUserIdAndAssessmentId.mockResolvedValue(
                mockProjectReview as any
            );

            projectReviewAggregateRepository.modifyReview.mockResolvedValue({
                ...mockProjectReview,
                recommendation: "EXCELLENT",
                reviewAnalysis: "Great work!",
            } as any);

            projectReviewAggregateRepository.changeReviewStatus.mockResolvedValue(
                {
                    ...mockProjectReview,
                    recommendation: "EXCELLENT",
                    status: "COMPLETED",
                    reviewAnalysis: "Great work!",
                } as any
            );

            const result = await reviewService.submitProjectAssessmentReview(
                {
                    assessmentId: "assessment-id",
                    recommendation: "EXCELLENT",
                    reviewAnalysis: "Great work!",
                } as any,
                "user-uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Project Assessment Review Submitted Successfully",
                res: {
                    reviewId: mockProjectReview.id,
                    submissionId: mockProjectReview.submissionId,
                    status: "COMPLETED",
                },
            });
        });

        it("Project Assessment Review Not Found for the User and Assessment", async () => {
            try {
                projectReviewAggregateRepository.findAssessmentReviewerByUserIdAndAssessmentId.mockResolvedValue(
                    null
                );

                await reviewService.submitProjectAssessmentReview(
                    {
                        assessmentId: "assessment-id",
                        recommendation: "EXCELLENT",
                        reviewAnalysis: "Great work!",
                    } as any,
                    "user-uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Review Not Found");
            }
        });

        it("Project Assessment Review Already Completed", async () => {
            try {
                projectReviewAggregateRepository.findAssessmentReviewerByUserIdAndAssessmentId.mockResolvedValue(
                    {
                        ...mockProjectReview,
                        status: "COMPLETED",
                    } as any
                );

                await reviewService.submitProjectAssessmentReview(
                    {
                        assessmentId: "assessment-id",
                        recommendation: "EXCELLENT",
                        reviewAnalysis: "Great work!",
                    } as any,
                    "user-uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Review Already Completed"
                );
            }
        });
    });

    describe("Get User Project Reviews", () => {
        it("Successful fetch Of User Project Reviews", async () => {
            const userReviews = [
                mockProjectReview,
                mockProjectReview,
                mockProjectReview,
            ];
            projectReviewAggregateRepository.getUserReviews.mockResolvedValue(
                userReviews as any
            );

            const result = await reviewService.getUserProjectReviews(
                {page: 1, numberOfResults: 10},
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "User Project Reviews Fetch",
                res: {
                    reviews: userReviews,
                },
            });
        });
    });

    describe("Get Project Review Details", () => {
        it("Successful Fetch Of Project Review Detail", async () => {
            const review = JSON.parse(JSON.stringify(mockProjectReview));

            cycleAssessmentAggregateRepository.findBySlug.mockResolvedValue(
                mockCycleAssessment as any
            );

            projectReviewAggregateRepository.findAssessmentReviewerByUserIdAndAssessmentId.mockResolvedValue(
                review as any
            );

            const result = await reviewService.getProjectReviewDetails(
                "slug",
                "reviewer-uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Project Review Details Fetched Successfully",
                res: {
                    review,
                    assessment: mockCycleAssessment,
                    project: mockCycleAssessment.project,
                    criteria: mockCycleAssessment.criteria,
                },
            });
        });

        it("Project Review Not Found", async () => {
            try {
                cycleAssessmentAggregateRepository.findBySlug.mockResolvedValue(
                    mockCycleAssessment as any
                );

                projectReviewAggregateRepository.findAssessmentReviewerByUserIdAndAssessmentId.mockResolvedValue(
                    null
                );

                await reviewService.getProjectReviewDetails(
                    "slug",
                    "reviewer-uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Review Not Found");
            }
        });

        it("Assessment Not Found", async () => {
            try {
                cycleAssessmentAggregateRepository.findBySlug.mockResolvedValue(
                    null
                );

                await reviewService.getProjectReviewDetails(
                    "slug",
                    "reviewer-uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Assessment Not Found"
                );
            }
        });
    });
});
