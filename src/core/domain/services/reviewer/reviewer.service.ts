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
import {GrantApplicationStatus} from "../../constants/status.constants";
import {
    ReviewerAggregatePort,
    REVIEW_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/review/review.aggregate.port";
import {
    UserAggregatePort,
    USER_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/user/user.aggregate.port";
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

    async getTokenDetails(token: string): Promise<TokenVerificationResponse> {
        try {
            const {application, invite} =
                await this.sharedApplicationService.getTokenDetails(token);

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

    async updateInviteStatus(inviteStatus: SubmitInviteStatusDTO) {
        try {
            const {
                status: isUpdated,
                application,
                email,
            } = await this.sharedApplicationService.getInviteResponse(
                inviteStatus.token,
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

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
