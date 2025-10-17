import {Injectable, Inject} from "@nestjs/common";
import {SharedApplicationService} from "../shared/application/shared.application.service";
import {TokenVerificationResponse} from "../../../../infrastructure/driven/response-dtos/co.applicant.response-dto";
import ApiError from "../../../../shared/errors/api.error";
import {SubmitInviteStatusDTO} from "../../../../infrastructure/driving/dtos/co.applicant.dto";
import {InviteAs, InviteStatus} from "../../constants/invite.constants";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    GrantApplicationStatus,
    ReviewStatus,
} from "../../constants/status.constants";
import {
    ReviewerAggregatePort,
    REVIEW_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/review/review.aggregate.port";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
import {
    GetReviewDetailsDTO,
    GetUserReviewsDTO,
    SubmitReviewDTO,
} from "../../../../infrastructure/driving/dtos/reviewer.dto";
import {
    GetUserReviewsResponse,
    SubmitReviewResponse,
    UpdateReviewInviteResponse,
    GetReviewDetailsResponse,
} from "../../../../infrastructure/driven/response-dtos/reviewer.response-dto";
@Injectable()
export class ReviewerService {
    constructor(
        private readonly sharedApplicationService: SharedApplicationService,
        @Inject(GRANT_APPLICATION_AGGREGATE_PORT)
        private readonly grantApplicationAggregateRepository: GrantApplicationAggregatePort,
        @Inject(REVIEW_AGGREGATE_PORT)
        private readonly reviewerAggregateRepository: ReviewerAggregatePort,
        @Inject(USER_AGGREGATE_PORT)
        private readonly userAggregateRepository: UserAggregatePort
    ) {}

    async getTokenDetails(
        token: string,
        slug: string
    ): Promise<TokenVerificationResponse> {
        try {
            const {application, invite} =
                await this.sharedApplicationService.getTokenDetails(
                    token,
                    slug
                );

            return {
                status: 200,
                message: "Reviewer Invite Details Fetch",
                res: {
                    invitedAt: invite.createdAt,
                    application: {
                        name: application.basicDetails.title,
                        problem: application.basicDetails.problem,
                    },
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateInviteStatus(
        inviteStatus: SubmitInviteStatusDTO
    ): Promise<UpdateReviewInviteResponse> {
        try {
            const {
                status: isUpdated,
                application,
                email,
            } = await this.sharedApplicationService.getInviteResponse(
                inviteStatus.token,
                inviteStatus.slug,
                inviteStatus.status,
                InviteAs.REVIEWER
            );

            if (!isUpdated) {
                throw new ApiError(
                    400,
                    "Error in Updating the User Invite Status",
                    "Conflict Error"
                );
            }

            if (inviteStatus.status === InviteStatus.ACCEPTED) {
                const user = await this.userAggregateRepository.findByEmail(
                    email,
                    false
                );
                if (!user) {
                    throw new ApiError(404, "User Not Found", "Not Found");
                }
                const userId = user.personId;
                const isAlreadyReviewer =
                    await this.reviewerAggregateRepository.getUserApplicationReview(
                        userId,
                        application.id
                    );

                if (isAlreadyReviewer) {
                    return {
                        status: 200,
                        message:
                            "User is already a Reviewer for this Application",
                        res: {
                            applicationId: application.id,
                            status: inviteStatus.status,
                            reviewId: isAlreadyReviewer.id,
                        },
                    };
                }

                await this.grantApplicationAggregateRepository.modifyApplicationStatus(
                    application,
                    GrantApplicationStatus.IN_REVIEW,
                    false
                );

                const createReview =
                    await this.reviewerAggregateRepository.addReviewerToApplication(
                        userId,
                        application.id
                    );

                if (!createReview) {
                    throw new ApiError(
                        400,
                        "Error in Creating the Review for the Application",
                        "Conflict Error"
                    );
                }
                return {
                    status: 201,
                    message: "User Reviewer Status Updated",
                    res: {
                        applicationId: application.id,
                        status: inviteStatus.status,
                        reviewId: createReview.id,
                    },
                };
            }

            return {
                status: 200,
                message: "User Reviewer Status Updated",
                res: {
                    applicationId: application.id,
                    status: inviteStatus.status,
                    reviewId: null,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async submitReview(
        reviewDetails: SubmitReviewDTO,
        userId: string
    ): Promise<SubmitReviewResponse> {
        try {
            const {applicationId, scores, budget, recommendation} =
                reviewDetails;
            const review =
                await this.reviewerAggregateRepository.getUserApplicationReview(
                    userId,
                    applicationId
                );
            if (!review) {
                throw new ApiError(404, "Review Not Found", "Not Found");
            }

            if (review.status === ReviewStatus.COMPLETED) {
                throw new ApiError(
                    400,
                    "Review Already Completed",
                    "Bad Request"
                );
            }

            const updatedReview =
                await this.reviewerAggregateRepository.modifyReview(review, {
                    scores,
                    budget,
                    recommendation,
                });

            await this.reviewerAggregateRepository.changeReviewStatus(
                updatedReview,
                ReviewStatus.COMPLETED
            );

            return {
                status: 200,
                message: "Review Submitted Successfully",
                res: {
                    reviewId: updatedReview.id,
                    applicationId: updatedReview.applicationId,
                    status: ReviewStatus.COMPLETED,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getUserReviews(
        filter: GetUserReviewsDTO,
        userId: string
    ): Promise<GetUserReviewsResponse> {
        try {
            const reviews =
                await this.reviewerAggregateRepository.getUserReviews(
                    userId,
                    filter.page,
                    filter.numberOfResults
                );

            return {
                status: 200,
                message: "User Reviews Fetch",
                res: {
                    reviews,
                },
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async getReviewDetails(
        details: GetReviewDetailsDTO,
        userId: string
    ): Promise<GetReviewDetailsResponse> {
        try {
            const review = await this.reviewerAggregateRepository.findBySlug(
                details.reviewSlug
            );

            if (!review) {
                throw new ApiError(404, "Review Not Found", "Not Found");
            }

            if (review.reviewerId != userId) {
                throw new ApiError(
                    403,
                    "User is not a reviewer",
                    "Mismatch Error"
                );
            }

            return {
                status: 200,
                message: "Review Details Fetched Successfully",
                res: {
                    review,
                    application: review.application,
                },
            };
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
