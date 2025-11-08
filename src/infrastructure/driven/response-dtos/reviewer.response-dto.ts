import {GrantApplication} from "../../../core/domain/aggregates/grantapplication.aggregate";
import {Review} from "../../../core/domain/aggregates/application.review.aggregate";
import {InviteStatus} from "../../../core/domain/constants/invite.constants";
import {ReviewStatus} from "../../../core/domain/constants/status.constants";
import {ApiResponse} from "../../../shared/types/response.type";
export class UpdateReviewInvite {
    applicationId: string;
    status: InviteStatus;
    reviewId: string | null;
}

export class SubmitReviewDetails {
    applicationId: string;
    reviewId: string;
    status: ReviewStatus;
}

export class GetUserReviews {
    reviews: Review[];
}
export class GetReviewDetails {
    review: Review;
    application: GrantApplication;
}
export class UpdateReviewInviteResponse extends ApiResponse(
    UpdateReviewInvite
) {}
export class SubmitReviewResponse extends ApiResponse(SubmitReviewDetails) {}
export class GetUserReviewsResponse extends ApiResponse(GetUserReviews) {}
export class GetReviewDetailsResponse extends ApiResponse(GetReviewDetails) {}
